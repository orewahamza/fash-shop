import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import productModel from '../models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const hasCloudinaryCreds = () =>
  !!(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY);

const localAsset = (rel) => path.join(repoRoot, 'frontend', 'src', 'assets', rel);

const demoUrls = {
  Men: [
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/samples/fashion/hoodie-man.jpg',
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/samples/fashion/t-shirt-model.jpg'
  ],
  Women: [
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/pm/woman_car.jpg'
  ],
  Kids: [
    'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/samples/people/boy-snow-hoodie.jpg'
  ]
};

const baseSamples = [
  {
    name: 'Essential Cotton T-Shirt',
    description: 'Classic crew-neck t-shirt crafted from soft breathable cotton.',
    price: 15,
    category: 'Men',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    assets: ['p_img2.png', 'p_img2_1.png', 'p_img2_2.png', 'p_img2_3.png'],
    stockBySize: { S: 20, M: 30, L: 25, XL: 15 }
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Mid-rise slim fit denim with a hint of stretch for comfort.',
    price: 39,
    category: 'Men',
    subCategory: 'Bottomwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: false,
    assets: ['p_img31.png', 'p_img32.png', 'p_img33.png'],
    stockBySize: { M: 18, L: 22, XL: 12 }
  },
  {
    name: 'Cozy Knit Sweater',
    description: 'Warm and lightweight knit, perfect for layering in winter.',
    price: 49,
    category: 'Women',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img21.png', 'p_img22.png', 'p_img23.png'],
    stockBySize: { S: 15, M: 20, L: 18 }
  },
  {
    name: 'Kids Graphic Tee',
    description: 'Fun graphic print tee for everyday play and comfort.',
    price: 12,
    category: 'Kids',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    assets: ['p_img11.png', 'p_img12.png', 'p_img13.png'],
    stockBySize: { S: 25, M: 25, L: 20 }
  },
];

const additionalSamples = [
  {
    name: 'Athletic Zip Hoodie',
    description: 'Soft fleece hoodie with full zip and kangaroo pockets.',
    price: 49,
    category: 'Men',
    subCategory: 'Topwear',
    sizes: ['M', 'L', 'XL', 'XXL'],
    bestseller: true,
    assets: ['p_img28.png', 'p_img38.png'],
    stockBySize: { M: 20, L: 28, XL: 18, XXL: 10 }
  },
  {
    name: 'Classic Oxford Shirt',
    description: 'Button-down collar shirt in breathable cotton oxford.',
    price: 35,
    category: 'Men',
    subCategory: 'Topwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: false,
    assets: ['p_img4.png', 'p_img11.png'],
    stockBySize: { M: 22, L: 24, XL: 12 }
  },
  {
    name: 'Chino Pants',
    description: 'Slim chinos with a hint of stretch for all-day comfort.',
    price: 45,
    category: 'Men',
    subCategory: 'Bottomwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: false,
    assets: ['p_img7.png', 'p_img10.png'],
    stockBySize: { M: 18, L: 26, XL: 14 }
  },
  {
    name: 'Slim Fit Jeans Plus',
    description: 'Tapered denim with durable wash and clean finish.',
    price: 59,
    category: 'Men',
    subCategory: 'Bottomwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: true,
    assets: ['p_img31.png', 'p_img32.png'],
    stockBySize: { M: 16, L: 20, XL: 10 }
  },
  {
    name: 'Puffer Jacket',
    description: 'Lightweight insulated puffer with stand collar.',
    price: 89,
    category: 'Men',
    subCategory: 'Winterwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: true,
    assets: ['p_img39.png', 'p_img28.png'],
    stockBySize: { M: 12, L: 14, XL: 8 }
  },
  {
    name: 'Thermal Long Sleeve',
    description: 'Ribbed thermal tee for extra winter warmth.',
    price: 29,
    category: 'Men',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: false,
    assets: ['p_img8.png'],
    stockBySize: { S: 14, M: 18, L: 18, XL: 10 }
  },
  {
    name: 'Kids Dinosaur Tee',
    description: 'Graphic tee with playful dino print.',
    price: 14,
    category: 'Kids',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img23.png', 'p_img24.png'],
    stockBySize: { S: 30, M: 28, L: 22 }
  },
  {
    name: 'Kids Cozy Joggers',
    description: 'Brushed-back fleece joggers with elastic waistband.',
    price: 19,
    category: 'Kids',
    subCategory: 'Bottomwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    assets: ['p_img16.png'],
    stockBySize: { S: 24, M: 26, L: 20 }
  },
  {
    name: 'Kids Puffer Jacket',
    description: 'Warm quilted jacket with zip closure.',
    price: 39,
    category: 'Kids',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img30.png'],
    stockBySize: { S: 18, M: 22, L: 16 }
  },
  {
    name: 'Kids Striped Polo',
    description: 'Cotton pique polo with multi-stripe detail.',
    price: 16,
    category: 'Kids',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    assets: ['p_img18.png'],
    stockBySize: { S: 26, M: 24, L: 18 }
  },
  {
    name: 'Kids Fleece Hoodie',
    description: 'Cozy fleece pullover with front pocket.',
    price: 28,
    category: 'Kids',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img19.png'],
    stockBySize: { S: 20, M: 22, L: 20 }
  },
  {
    name: 'Women Cotton Tee',
    description: 'Everyday cotton tee with a relaxed fit.',
    price: 22,
    category: 'Women',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    assets: ['p_img1.png'],
    stockBySize: { S: 18, M: 22, L: 16 }
  },
  {
    name: 'High-Waist Leggings',
    description: 'Stretch leggings with high-rise waistband.',
    price: 29,
    category: 'Women',
    subCategory: 'Bottomwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img20.png'],
    stockBySize: { S: 20, M: 24, L: 18 }
  },
  {
    name: 'Cable Knit Sweater',
    description: 'Chunky cable knit for cold days.',
    price: 52,
    category: 'Women',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    assets: ['p_img21.png'],
    stockBySize: { S: 12, M: 16, L: 14 }
  },
  {
    name: 'Denim Jacket',
    description: 'Classic trucker jacket in mid-wash denim.',
    price: 69,
    category: 'Women',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    assets: ['p_img35.png'],
    stockBySize: { S: 10, M: 14, L: 12 }
  }
];

const transformUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Insert delivery transformation for optimization
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const before = url.substring(0, idx + marker.length);
  const after = url.substring(idx + marker.length);
  const transform = 'f_auto,q_auto,w_800/';
  if (after.startsWith('f_auto')) return url;
  return `${before}${transform}${after}`;
};

const uploadImage = async (filePath) => {
  if (hasCloudinaryCreds() && fs.existsSync(filePath)) {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: 'products/seed',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    return transformUrl(res.secure_url);
  }
  return null;
};

const seed = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    const existing = await productModel.countDocuments();
    const force = process.env.FORCE_SEED === 'true';
    const append = process.env.APPEND_SEED === 'true';
    if (existing > 0 && !force && !append) {
      console.log(`Products already present (${existing}). Set FORCE_SEED=true to reseed or APPEND_SEED=true to append.`);
      process.exit(0);
    }

    if (force) {
      const docs = await productModel.find({});
      await Promise.all(
        docs.flatMap((d) =>
          (Array.isArray(d.image) ? d.image : []).map(async (url) => {
            try {
              const parts = String(url).split('/upload/');
              if (parts.length < 2) return;
              const after = parts[1].split('?')[0];
              const segs = after.split('/');
              const rest = segs[0].startsWith('v') ? segs.slice(1) : segs;
              const pid = rest.join('/').replace(/\.[^/.]+$/, '');
              if (hasCloudinaryCreds()) {
                await cloudinary.uploader.destroy(pid);
              }
            } catch {}
          })
        )
      );
      await productModel.deleteMany({});
      console.log('Cleared existing products.');
    }

    const source = force ? baseSamples.concat(additionalSamples) : append ? additionalSamples : baseSamples;
    const existingNames = new Set((await productModel.find({}, 'name')).map(d => d.name));
    const docs = [];
    for (const s of source) {
      if (append && existingNames.has(s.name)) continue;
      let imageUrls = [];
      if (Array.isArray(s.assets) && s.assets.length > 0) {
        for (const a of s.assets) {
          const fp = localAsset(a);
          try {
            const url = await uploadImage(fp);
            if (url) imageUrls.push(url);
          } catch {}
        }
      }
      // Cleanup invalids and ensure fallback
      imageUrls = imageUrls.filter(Boolean);
      if (imageUrls.length === 0) {
        const pool = demoUrls[s.category] || demoUrls.Men;
        imageUrls = [pool[0]];
      } else {
        // Deduplicate and limit
        const seen = new Set();
        imageUrls = imageUrls.filter((u) => {
          const t = transformUrl(u);
          if (!t || seen.has(t)) return false;
          seen.add(t);
          return true;
        }).slice(0, 4);
      }
      docs.push({
        name: s.name,
        description: s.description,
        price: s.price,
        category: s.category,
        subCategory: s.subCategory,
        sizes: s.sizes,
        bestseller: s.bestseller,
        image: imageUrls,
        stockBySize: s.stockBySize || {},
        date: Date.now(),
      });
    }

    await productModel.insertMany(docs);
    console.log(`Inserted ${docs.length} sample products.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();
