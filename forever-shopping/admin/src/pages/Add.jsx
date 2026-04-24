import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Add = ({ token }) => {
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

  const acceptMimes = ['image/jpeg','image/png','image/webp','image/avif','image/jpg'];
  const maxSize = 5 * 1024 * 1024;
  const handleFiles = (files) => {
    const validFiles = [];
    for (const f of files) {
      if (!acceptMimes.includes(f.type)) {
        toast.error('Only image files are allowed');
        continue;
      }
      if (f.size > maxSize) {
        toast.error('Max size 5MB per image');
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

      // Append userId if available (for host tracking)
      const hostId = localStorage.getItem("hostId");
      if (hostId) {
        formData.append("userId", hostId);
      }

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setIsPublished(true);
        setBestseller(false);
        setSizes([]);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-5 text-red-500 font-medium bg-black p-4 sm:p-6 rounded-lg shadow-sm border border-red-900 mx-auto max-w-4xl">
      <div className="w-full">
        <p className="mb-2 text-sm text-red-400">Upload Image</p>
        <div
          className="flex flex-wrap gap-4"
          onDrop={onDrop}
          onDragOver={onDragOver}
          title="Drag & drop images here"
        >
          {[image1, image2, image3, image4].map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover cursor-pointer hover:opacity-80 transition rounded-md border border-red-900 border-dashed bg-gray-900"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt="upload_area_image"
              />
              <input
                onChange={(e) => handleFiles(e.target.files)}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-sm text-red-400">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-xl px-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 focus:border-[#FF0000] transition-all placeholder-red-800"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2 text-sm text-red-400">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-xl px-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 focus:border-[#FF0000] transition-all h-32 resize-none placeholder-red-800"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:gap-8">
        <div className="w-full sm:flex-1 sm:max-w-[200px]">
          <p className="mb-2 text-sm text-red-400">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 focus:border-[#FF0000] transition-all cursor-pointer"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="w-full sm:flex-1 sm:max-w-[200px]">
          <p className="mb-2 text-sm text-red-400">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 focus:border-[#FF0000] transition-all cursor-pointer"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="w-full sm:flex-1 sm:max-w-[200px]">
          <p className="mb-2 text-sm text-red-400">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50 focus:border-[#FF0000] transition-all placeholder-red-800"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 text-sm text-red-400">Product Sizes</p>
        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`${
                sizes.includes(size) ? "bg-red-900/30 border-[#FF0000] text-[#FF0000]" : "bg-gray-900 border-red-900 text-red-400 hover:bg-red-900/20"
              } border px-4 py-2 cursor-pointer rounded-md transition-all duration-200 ease-in-out font-medium text-sm`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2 items-center">
        <input
          onChange={() => setIsPublished((prev) => !prev)}
          checked={isPublished}
          type="checkbox"
          id="isPublished"
          className="w-4 h-4 cursor-pointer accent-[#FF0000]"
        />
        <label className="cursor-pointer text-sm text-red-400 ml-1" htmlFor="isPublished">
          Published (Visible to customers)
        </label>
      </div>

      <div className="flex gap-2 mt-1 items-center">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-4 h-4 cursor-pointer accent-[#FF0000]"
        />
        <label className="cursor-pointer text-sm text-red-400 ml-1" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        className="w-full sm:w-48 py-3 mt-4 bg-red-600 text-black rounded-md text-sm font-bold hover:bg-red-700 transition duration-300 shadow-md border border-red-600 active:scale-95"
        type="submit"
      >
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
