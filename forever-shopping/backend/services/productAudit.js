import productModel from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import connectCloudinary from '../config/cloudinary.js';
const repoRoot = path.resolve(process.cwd(), '..');
const localAsset = (rel) => path.join(repoRoot, 'frontend', 'src', 'assets', rel);

const TYPE_KEYWORDS = {
  tshirt: ['t-shirt', 'tee', 'tshirt', 'graphic tee', 'thermal'],
  shirt: ['shirt', 'oxford'],
  hoodie: ['hoodie', 'zip hoodie', 'hooded'],
  sweater: ['sweater', 'knit', 'pullover'],
  jacket: ['jacket', 'puffer', 'denim jacket', 'trucker'],
  jeans: ['jeans', 'denim'],
  pants: ['pants', 'chino', 'chinos', 'trouser', 'trousers', 'leggings'],
};

const SUBCATEGORY_EXPECTED = {
  Topwear: ['tshirt', 'shirt', 'hoodie', 'sweater'],
  Bottomwear: ['jeans', 'pants'],
  Winterwear: ['jacket', 'sweater'],
};

const MODEL_URL_MARKERS = [
  '/samples/people/',
  '/samples/fashion/',
  '/pm/woman_car.jpg',
  't-shirt-model.jpg',
  'hoodie-man.jpg'
];

export const detectTypeFromName = (name = '') => {
  const n = String(name).toLowerCase();
  for (const [type, words] of Object.entries(TYPE_KEYWORDS)) {
    if (words.some(w => n.includes(w))) return type;
  }
  return null;
};

export const expectedTypesFromSub = (subCategory) => {
  return SUBCATEGORY_EXPECTED[subCategory] || [];
};

export const standardizeName = (doc) => {
  const { category, subCategory } = doc;
  const gender = category;
  const detected = detectTypeFromName(doc.name) || (SUBCATEGORY_EXPECTED[subCategory]?.[0] ?? '');
  const typeMap = {
    tshirt: 'T-Shirt',
    shirt: 'Shirt',
    hoodie: 'Hoodie',
    sweater: 'Sweater',
    jacket: 'Jacket',
    jeans: 'Jeans',
    pants: subCategory === 'Bottomwear' ? 'Chinos' : 'Pants',
  };
  const type = typeMap[detected] || 'Apparel';
  const styleTokens = [];
  if (/slim/.test(doc.name.toLowerCase())) styleTokens.push('Slim Fit');
  if (/regular|relaxed/.test(doc.name.toLowerCase())) styleTokens.push('Regular Fit');
  if (/zip/.test(doc.name.toLowerCase())) styleTokens.push('Zip');
  if (/crew|round/.test(doc.name.toLowerCase())) styleTokens.push('Crew Neck');
  if (/graphic/.test(doc.name.toLowerCase())) styleTokens.push('Graphic');
  if (/stretch/.test(doc.description?.toLowerCase() || '')) styleTokens.push('Stretch');
  const features = styleTokens.length ? ` – ${styleTokens.join(' ')}` : '';
  return `${gender} ${type}${features}`.trim();
};

export const isModelPhoto = (url) => {
  if (!url || typeof url !== 'string') return false;
  return MODEL_URL_MARKERS.some(m => url.includes(m));
};

export const transformCdn = (url) => {
  try {
    if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const prefix = parts[0] + '/upload/';
    const suffix = parts[1];
    const tx = 'f_auto,q_auto,w_800';
    if (suffix.startsWith('f_auto')) return url;
    return `${prefix}${tx}/${suffix}`;
  } catch {
    return url;
  }
};

export const filterImages = (arr = []) => {
  const urls = (Array.isArray(arr) ? arr : []).filter(u => !!u && !isModelPhoto(u));
  const seen = new Set();
  const deduped = urls.map(transformCdn).filter(u => {
    if (!u || seen.has(u)) return false;
    seen.add(u);
    return true;
  }).slice(0, 4);
  return deduped;
};

const seedBase = (url) => {
  try {
    const m = url.match(/\/(p_img[\w\d_]+)\.(?:png|jpg|jpeg|webp)$/i);
    if (!m) return null;
    const raw = m[1]; // e.g., p_img11_uegn75 or p_img2_1_abcd
    const base = raw.match(/^(p_img\d+(?:_\d)?)/i);
    if (base) return base[1];
    return raw;
  } catch {
    return null;
  }
};

// Allowed seed bases by category+subcategory to avoid cross-gender mix-ups
const ALLOWED_SEEDS = {
  Men: {
    Topwear: new Set(['p_img2','p_img2_1','p_img2_2','p_img2_3','p_img2_4','p_img4','p_img5','p_img6','p_img7','p_img8','p_img9','p_img38']),
    Bottomwear: new Set(['p_img31','p_img32','p_img33','p_img10']),
    Winterwear: new Set(['p_img28','p_img39','p_img8']) // thermal under winter group in sample
  },
  Women: {
    Topwear: new Set(['p_img1','p_img29','p_img37']),
    Bottomwear: new Set(['p_img20']),
    Winterwear: new Set(['p_img21','p_img35','p_img36'])
  },
  Kids: {
    Topwear: new Set(['p_img11','p_img12','p_img18','p_img23','p_img24']),
    Bottomwear: new Set(['p_img16']),
    Winterwear: new Set(['p_img30','p_img19'])
  }
};

const filterBySubcategory = (doc, urls) => {
  if (!Array.isArray(urls) || urls.length === 0) return urls;
  const allowed = ALLOWED_SEEDS[doc.category]?.[doc.subCategory];
  if (!allowed) return urls;
  const refined = urls.filter(u => allowed.has(seedBase(u) || ''));
  return refined.length ? refined : urls;
};

const pickFallbackAssets = (category, subCategory) => {
  const map = {
    Men: {
      Topwear: ['p_img2_1.png','p_img2_2.png','p_img4.png','p_img8.png'],
      Bottomwear: ['p_img31.png','p_img32.png','p_img33.png','p_img10.png'],
      Winterwear: ['p_img28.png','p_img39.png']
    },
    Women: {
      Topwear: ['p_img1.png','p_img29.png','p_img37.png'],
      Bottomwear: ['p_img20.png'],
      Winterwear: ['p_img21.png','p_img35.png','p_img36.png']
    },
    Kids: {
      Topwear: ['p_img11.png','p_img23.png','p_img24.png','p_img25.png','p_img27.png'],
      Bottomwear: ['p_img16.png'],
      Winterwear: ['p_img30.png','p_img19.png']
    }
  };
  return map[category]?.[subCategory] || [];
};

const uploadLocal = async (rel) => {
  try {
    await connectCloudinary();
  } catch {}
  const fp = localAsset(rel);
  if (!fs.existsSync(fp)) return null;
  const res = await cloudinary.uploader.upload(fp, {
    resource_type: 'image',
    folder: 'products/audit',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });
  return transformCdn(res.secure_url);
};

export const auditOne = (doc) => {
  const detected = detectTypeFromName(doc.name);
  const expect = expectedTypesFromSub(doc.subCategory);
  const nameMatchesImage = !!(detected && expect.includes(detected));
  const baseClean = filterImages(doc.image);
  const cleanImages = filterBySubcategory(doc, baseClean);
  const imagesShowProductOnly = cleanImages.length > 0;
  const noUnrelatedModelPhotography = cleanImages.length === (doc.image?.length || 0);
  const standardizedName = standardizeName(doc);
  return {
    id: doc._id.toString(),
    currentName: doc.name,
    standardizedName,
    expectedTypes: expect,
    detectedType: detected,
    nameMatchesImage,
    imagesShowProductOnly,
    noUnrelatedModelPhotography,
    imageCountBefore: doc.image?.length || 0,
    imageCountAfter: cleanImages.length,
    cleanedImages: cleanImages,
  };
};

export const applyFixes = async (report) => {
  const updates = [];
  for (const item of report) {
    const changes = {};
    if (!item.nameMatchesImage) {
      changes.name = item.standardizedName;
    }
    const doc = await productModel.findById(item.id);
    let imgs = item.cleanedImages;
    if (imgs.length === 0) {
      // attach fallbacks
      const names = pickFallbackAssets(doc.category, doc.subCategory);
      const uploaded = [];
      for (const n of names) {
        try {
          const url = await uploadLocal(n);
          if (url) uploaded.push(url);
          if (uploaded.length >= 4) break;
        } catch {}
      }
      imgs = uploaded;
    }
    if (imgs.length > 0) {
      const current = Array.isArray(doc.image) ? doc.image : [];
      const sameLen = current.length === imgs.length;
      const sameOrder = sameLen && current.every((v, i) => v === imgs[i]);
      if (!sameOrder) {
        changes.image = imgs;
      }
    }
    if (Object.keys(changes).length > 0) {
      updates.push(productModel.findByIdAndUpdate(item.id, changes, { new: true }));
    }
  }
  await Promise.all(updates);
};

export const auditAll = async () => {
  const docs = await productModel.find({});
  return docs.map(auditOne);
};
