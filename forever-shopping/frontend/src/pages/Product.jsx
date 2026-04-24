import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";
import { assets } from "./../assets/assets";
import RelatedProducts from "./../components/RelatedProducts";
import { transformCloudinaryUrl, buildSrcSet } from "../utils/cloudinary";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchProductData = async () => {
      // Always fetch fresh product details from backend to avoid stale cache
      try {
        const res = await axios.get(`${backendUrl}/api/product/${productId}`);
        if (!cancelled && res.data?.success) {
          const item = res.data.product;
          const imgs = Array.isArray(item.image) ? item.image : [];
          const clean = imgs.filter(u => {
            if (typeof u !== 'string') return false;
            const bad = u.includes('/samples/people/') || u.includes('/samples/fashion/');
            return !bad;
          });
          const finalImgs = clean.length ? clean : imgs;
          setProductData(item);
          setImages(finalImgs);
          setImage(finalImgs?.[0] || "");
          return;
        }
      } catch {}
      // Fallback to context
      for (const item of products) {
        if (item._id == productId) {
          if (cancelled) break;
          const imgs = Array.isArray(item.image) ? item.image : [];
          const clean = imgs.filter(u => {
            if (typeof u !== 'string') return false;
            const bad = u.includes('/samples/people/') || u.includes('/samples/fashion/');
            return !bad;
          });
          const finalImgs = clean.length ? clean : imgs;
          setProductData(item);
          setImages(finalImgs);
          setImage(finalImgs?.[0] || "");
          break;
        }
      }
    };
    fetchProductData();
    return () => { cancelled = true; };
  }, [productId, products, backendUrl]);
  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <Helmet>
        <title>{productData.name} | Forever Shopping</title>
        <meta name="description" content={productData.description} />
      </Helmet>
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- product images ----------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {images.map((item, index) => (
              <div 
                key={index} 
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer bg-gradient-brand p-[1px] rounded-sm"
                onClick={() => setImage(item)}
              >
                <div className="bg-white rounded-sm overflow-hidden h-full">
                  <img
                    src={transformCloudinaryUrl(item, { width: 160 })}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    alt="product_image"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <div className="bg-gradient-brand p-[1.5px] rounded-md">
              <div className="bg-white rounded-md overflow-hidden">
                <img
                  src={transformCloudinaryUrl(image, { width: 960 })}
                  srcSet={buildSrcSet(image, [480, 640, 800, 960, 1200])}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                  className="w-full h-auto"
                  alt="product_img"
                  onError={(e) => { e.currentTarget.src = image; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/*---------- product info ----------*/}
        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(134)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-brand-blue-300 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-black text-white ${
                    item === size ? "border-red-500" : "border-brand-blue-600"
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <p>Quantity</p>
            <div className="flex items-center border border-brand-blue-600 rounded">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-black text-white hover:bg-brand-blue-900 border-r border-brand-blue-600 transition-colors"
              >-</button>
              <input 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) setQuantity(val);
                }} 
                type="number" 
                min={1} 
                value={quantity}
                className="w-12 bg-black text-white text-center focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
              />
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-1 bg-black text-white hover:bg-brand-blue-900 border-l border-brand-blue-600 transition-colors"
              >+</button>
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size, quantity)}
            className="w-full sm:w-auto bg-black text-white px-8 py-4 text-sm active:bg-brand-blue-700 border border-brand-blue-600 hover:bg-brand-blue-900 transition-colors uppercase font-bold tracking-widest shadow-lg"
          >
            Add to Cart
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-brand-blue-300 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this products.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/*---------- Description & Review Section ----------*/}
      <div className="mt-20">
        <div className="flex">
          <b className="border border-brand-blue-600 px-5 py-3 text-sm">Description</b>
          <p className="border border-brand-blue-600 px-5 py-3 text-sm">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border border-brand-blue-600 px-6 py-4 text-sm text-brand-blue-300">
          <p>
            Our garments are meticulously designed using high-quality materials to provide a perfect blend of style, comfort, and longevity. We prioritize breathable fabrics and precision stitching to ensure that every item feels as good as it looks, whether you're dressing for a casual day out or a formal event.
          </p>
          <p>
            We recommend following the care instructions on the label to maintain the vibrant colors and structural integrity of your clothes. Our commitment to excellence means you can trust Fash-Shop to deliver contemporary fashion that stands the test of time.
          </p>
        </div>
      </div>

      {/* ---------- Display related products ---------- */}

      <RelatedProducts
        productId={productData._id}
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
