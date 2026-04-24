import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/admin/assets";

const Edit = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const acceptMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
  const maxSize = 5 * 1024 * 1024;
  const handleFiles = (files) => {
    const validFiles = [];
    for (const f of files) {
      if (!acceptMimes.includes(f.type)) {
        toast.error("Only image files are allowed");
        continue;
      }
      if (f.size > maxSize) {
        toast.error("Max size 5MB per image");
        continue;
      }
      validFiles.push(f);
    }
    if (validFiles.length === 0) return;
    const imgs = [image1, image2, image3, image4];
    let idx = 0;
    for (let i = 0; i < imgs.length && idx < validFiles.length; i++) {
      if (!imgs[i]) {
        const setter = [setImage1, setImage2, setImage3, setImage4][i];
        setter(validFiles[idx]);
        idx++;
      }
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };
  const onDragOver = (e) => e.preventDefault();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data.success) {
          const p = res.data.product;
          setName(p.name);
          setDescription(p.description);
          setPrice(p.price);
          setCategory(p.category);
          setSubCategory(p.subCategory);
          setBestseller(!!p.bestseller);
          setIsPublished(p.isPublished !== false); // default true if undefined
          setSizes(p.sizes || []);
          setExistingImages(p.image || []);
        } else {
          toast.error(res.data.message);
        }
      } catch (e) {
        console.log(e);
        toast.error(e.message);
      }
    };
    load();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("isPublished", isPublished);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.put(`${backendUrl}/api/product/${id}`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success("Product updated");
        navigate("/host/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 bg-black p-6 rounded-lg border border-red-900">
      <p className="text-xl mb-2 text-red-500 font-bold">Edit Product</p>
      <div>
        <p className="mb-2 text-red-400">Images</p>
        <div className="flex gap-2 p-3 border border-red-900 border-dashed rounded-md bg-gray-900" onDrop={onDrop} onDragOver={onDragOver}>
          {[image1, image2, image3, image4].map((img, idx) => {
            const fallback = existingImages[idx];
            const src = img ? URL.createObjectURL(img) : fallback || assets.upload_area;
            const idAttr = `image${idx + 1}`;
            return (
              <label htmlFor={idAttr} key={idAttr}>
                <img className="w-20 rounded border border-red-900 bg-black" src={src} alt="upload_area_image" />
                <input onChange={(e) => handleFiles(e.target.files)} type="file" id={idAttr} hidden />
              </label>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-red-400">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2 bg-gray-900 border border-red-900 text-red-500 rounded outline-none focus:border-red-600 placeholder-red-800" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2 text-red-400">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2 bg-gray-900 border border-red-900 text-red-500 rounded outline-none focus:border-red-600 placeholder-red-800 h-32 resize-none" type="text" placeholder="write content here" required />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 text-red-400">Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full px-3 py-2 bg-gray-900 border border-red-900 text-red-500 rounded outline-none focus:border-red-600">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-red-400">Sub Category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="w-full px-3 py-2 bg-gray-900 border border-red-900 text-red-500 rounded outline-none focus:border-red-600">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-red-400">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px] bg-gray-900 border border-red-900 text-red-500 rounded outline-none focus:border-red-600 placeholder-red-800" type="number" placeholder="25" required />
        </div>
      </div>

      <div>
        <p className="mb-2 text-red-400">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <div key={s} onClick={() => setSizes((prev) => (prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]))}>
              <p className={`${sizes.includes(s) ? "bg-red-900/30 border-red-600 text-red-500" : "bg-gray-900 border-red-900 text-red-400"} border px-3 py-1 cursor-pointer rounded transition-colors`}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setIsPublished((prev) => !prev)} checked={isPublished} type="checkbox" id="isPublished" className="accent-red-600 w-4 h-4" />
        <label className="cursor-pointer text-red-400" htmlFor="isPublished">
          Published (Visible to customers)
        </label>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type="checkbox" id="bestseller" className="accent-red-600 w-4 h-4" />
        <label className="cursor-pointer text-red-400" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button className="w-28 py-3 mt-4 bg-red-600 text-black font-bold rounded hover:bg-red-700 transition-colors cursor-pointer border border-red-600" type="submit">
        SAVE
      </button>
    </form>
  );
};

export default Edit;

