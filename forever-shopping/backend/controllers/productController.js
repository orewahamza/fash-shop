import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import validator from 'validator';
import { auditAll, applyFixes } from '../services/productAudit.js';

import jwt from 'jsonwebtoken';

const allowedCategories = ['Men', 'Women', 'Kids'];
const allowedSubCategories = ['Topwear', 'Bottomwear', 'Winterwear'];
const allowedSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const cleanText = (val) => validator.escape(validator.trim(val || ''));
const isValidPrice = (val) => typeof val !== 'undefined' && !isNaN(val) && Number(val) >= 0;
const parseSizes = (sizes) => {
    if (Array.isArray(sizes)) return sizes.filter(s => allowedSizes.includes(s));
    try {
        const arr = JSON.parse(sizes || '[]');
        return Array.isArray(arr) ? arr.filter(s => allowedSizes.includes(s)) : [];
    } catch {
        return [];
    }
};

const extractPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        const afterUpload = parts[1];
        const withoutQuery = afterUpload.split('?')[0];
        const segments = withoutQuery.split('/');
        const withoutVersion = segments[0].startsWith('v') ? segments.slice(1) : segments;
        const joined = withoutVersion.join('/');
        const withoutExt = joined.replace(/\.[^/.]+$/, '');
        return withoutExt;
    } catch {
        return null;
    }
};

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, isPublished } = req.body;
        // The token is verified in middleware, but we need to know WHO added it.
        // Assuming adminAuth or similar middleware attaches user info to req.user or we can decode token here if needed.
        // But looking at middleware/adminAuth.js, it might not set req.user if it's just checking token string.
        // However, we need to save ownerId.
        // Let's check if req.body.userId is available (sometimes passed by frontend) or we extract from token.
        // Since adminAuth middleware verifies token, let's see if we can get ID.
        // If the route uses 'adminAuth', it might decode token.
        // Let's assume we can get userId from req.body.userId (if frontend sends it) or decode it.

        // Actually, let's decode token to get ownerId if not present.
        // But better yet, the middleware should attach it.
        // For now, let's try to get it from headers token if not in body.

        let ownerId = req.body.userId;
        if (!ownerId && req.headers.token) {
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
                ownerId = decoded.id;
            } catch (e) {
                // ignore
            }
        }

        const productName = cleanText(name);
        const productDescription = cleanText(description);
        const productPrice = Number(price);
        const productCategory = cleanText(category);
        const productSubCategory = cleanText(subCategory);
        const productSizes = parseSizes(sizes);
        const isBestSeller = String(bestseller) === 'true';
        const isPublishedVal = String(isPublished) === 'true';

        if (!productName || !productDescription) {
            return res.status(400).json({ success: false, message: 'Name and description are required' });
        }
        if (!isValidPrice(productPrice)) {
            return res.status(400).json({ success: false, message: 'Invalid price' });
        }
        if (!allowedCategories.includes(productCategory) || !allowedSubCategories.includes(productSubCategory)) {
            return res.status(400).json({ success: false, message: 'Invalid category or subCategory' });
        }
        if (productSizes.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one valid size is required' });
        }

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image is required' });
        }

        const uploadedPublicIds = [];
        let imagesUrl = [];
        try {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: 'image',
                        folder: 'products',
                        use_filename: true,
                        unique_filename: true,
                        overwrite: false
                    });
                    uploadedPublicIds.push(result.public_id);
                    return result.secure_url;
                })
            );
        } catch (uploadErr) {
            await Promise.all(uploadedPublicIds.map(async (pid) => {
                try { await cloudinary.uploader.destroy(pid); } catch { }
            }));
            throw uploadErr;
        }

        const productData = {
            name: productName,
            description: productDescription,
            category: productCategory,
            price: productPrice,
            subCategory: productSubCategory,
            bestseller: isBestSeller,
            isPublished: isPublishedVal,
            sizes: productSizes,
            image: imagesUrl,
            ownerId: ownerId, // Save the owner
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.status(201).json({ success: true, message: "Product added successfully", data: { product } });


    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);
        res.status(500).json({ success: false, message: error.message || "An internal error occurred" })
    }
}

// RESTful: create product
const createProduct = addProduct;





// function for list product
const listProducts = async (req, res) => {
    try {
        console.log("Fetching all products...");
        const products = await productModel.find({ isPublished: { $ne: false } });
        console.log(`Found ${products.length} products`);
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// RESTful: get all products
const getProducts = listProducts;





// function for removing product 
const removeProduct = async (req, res) => {

    try {
        const doc = await productModel.findById(req.body.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Product not found' });
        const urls = Array.isArray(doc.image) ? doc.image : [];
        await Promise.all(urls.map(async (url) => {
            const publicId = extractPublicIdFromUrl(url);
            if (publicId) {
                try { await cloudinary.uploader.destroy(publicId); } catch { }
            }
        }));
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

// RESTful: delete product by id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await productModel.findById(id);
        if (!doc) return res.status(404).json({ success: false, message: 'Product not found' });
        const urls = Array.isArray(doc.image) ? doc.image : [];
        await Promise.all(urls.map(async (url) => {
            const publicId = extractPublicIdFromUrl(url);
            if (publicId) {
                try { await cloudinary.uploader.destroy(publicId); } catch { }
            }
        }));
        await productModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// RESTful: get product by id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// RESTful: update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await productModel.findById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

        const updates = {};
        if (typeof req.body.name !== 'undefined') updates.name = cleanText(req.body.name);
        if (typeof req.body.description !== 'undefined') updates.description = cleanText(req.body.description);
        if (typeof req.body.price !== 'undefined') {
            if (!isValidPrice(req.body.price)) return res.status(400).json({ success: false, message: 'Invalid price' });
            updates.price = Number(req.body.price);
        }
        if (typeof req.body.category !== 'undefined') {
            if (!allowedCategories.includes(req.body.category)) return res.status(400).json({ success: false, message: 'Invalid category' });
            updates.category = cleanText(req.body.category);
        }
        if (typeof req.body.subCategory !== 'undefined') {
            if (!allowedSubCategories.includes(req.body.subCategory)) return res.status(400).json({ success: false, message: 'Invalid subCategory' });
            updates.subCategory = cleanText(req.body.subCategory);
        }
        if (typeof req.body.bestseller !== 'undefined') updates.bestseller = String(req.body.bestseller) === 'true';
        if (typeof req.body.isPublished !== 'undefined') updates.isPublished = String(req.body.isPublished) === 'true';
        if (typeof req.body.sizes !== 'undefined') {
            const sz = parseSizes(req.body.sizes);
            if (sz.length === 0) return res.status(400).json({ success: false, message: 'At least one valid size is required' });
            updates.sizes = sz;
        }

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const newImages = [image1, image2, image3, image4].filter(Boolean);

        if (newImages.length > 0) {
            const uploadedPublicIds = [];
            let imagesUrl = [];
            try {
                imagesUrl = await Promise.all(
                    newImages.map(async (item) => {
                        const result = await cloudinary.uploader.upload(item.path, {
                            resource_type: 'image',
                            folder: 'products',
                            use_filename: true,
                            unique_filename: true,
                            overwrite: false
                        });
                        uploadedPublicIds.push(result.public_id);
                        return result.secure_url;
                    })
                );
            } catch (uploadErr) {
                await Promise.all(uploadedPublicIds.map(async (pid) => {
                    try { await cloudinary.uploader.destroy(pid); } catch { }
                }));
                throw uploadErr;
            }
            // Cleanup old images
            const oldUrls = Array.isArray(existing.image) ? existing.image : [];
            await Promise.all(oldUrls.map(async (url) => {
                const publicId = extractPublicIdFromUrl(url);
                if (publicId) {
                    try { await cloudinary.uploader.destroy(publicId); } catch { }
                }
            }));
            updates.image = imagesUrl;
        }

        const updated = await productModel.findByIdAndUpdate(id, updates, { new: true });
        res.json({ success: true, message: 'Product updated', data: { product: updated } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// function for listing user products (Host Panel)
const listUserProducts = async (req, res) => {
    try {
        const { token, userid } = req.headers; // note: headers are usually lowercase
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // If token is admin token (string payload), try to use the passed userId header
            if (typeof decoded === 'string') {
                userId = userid; // Use header provided ID for admin token users
            } else {
                userId = decoded.id;
            }
        } catch (e) {
            return res.json({ success: false, message: 'Invalid Token' });
        }

        if (!userId) {
            // If no userId could be determined (e.g. Super Admin without specific host context)
            // We might return ALL products? Or NONE?
            // Since this endpoint is specifically "user-list", let's return only unassigned products?
            // Or if it's the super admin logging in directly, they might expect everything.
            // But for now, let's assume we want to filter by ownerId.
            // If userId is undefined, find({ownerId: undefined}) might match all if not careful.
            // Let's force a "no match" if no user ID.
            return res.json({ success: true, products: [] });
        }

        // Only return products owned by this user
        const products = await productModel.find({ ownerId: userId });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export {
    // legacy
    listProducts, addProduct, removeProduct, listUserProducts,
    // RESTful
    createProduct, getProducts, getProductById, updateProduct, deleteProduct
};


// ----- Recommendation Engine -----
const complementaryBySub = {
    Topwear: ['Bottomwear', 'Winterwear'],
    Bottomwear: ['Topwear', 'Winterwear'],
    Winterwear: ['Topwear', 'Bottomwear'],
};

export const getRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const base = await productModel.findById(id);
        if (!base) return res.status(404).json({ success: false, message: 'Product not found' });
        const compSubs = complementaryBySub[base.subCategory] || [];
        const same = await productModel.aggregate([
            { $match: { _id: { $ne: base._id }, category: base.category, subCategory: base.subCategory } },
            { $sample: { size: 8 } },
            { $limit: 8 }
        ]);
        let recs = same;
        if (recs.length < 8) {
            const need = 8 - recs.length;
            const comp = await productModel.aggregate([
                { $match: { _id: { $ne: base._id }, category: base.category, subCategory: { $in: compSubs } } },
                { $sample: { size: need } },
                { $limit: need }
            ]);
            recs = recs.concat(comp);
        }
        res.json({ success: true, recommendations: recs.slice(0, 8) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----- Audit & Fix Endpoints -----
export const auditProducts = async (_req, res) => {
    try {
        const report = await auditAll();
        res.json({ success: true, report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const auditAndFixProducts = async (_req, res) => {
    try {
        const report = await auditAll();
        await applyFixes(report);
        res.json({
            success: true, message: 'Audit fixes applied', summary: {
                total: report.length,
                fixed: report.filter(r => !r.nameMatchesImage || r.imageCountAfter !== r.imageCountBefore).length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
