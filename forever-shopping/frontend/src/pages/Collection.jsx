import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./../components/Title";
import ProducItem from "./../components/ProducItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  // state of sorting by price
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products ? products.slice() : [];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  //code of product sorting by high to low and low to high
  const sortProduct = () => {
    let filterProductCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(filterProductCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // this code is for price wise product sorting
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // //this is testing purpose code
  // useEffect(() => {
  //   console.log(subCategory);
  // }, [subCategory]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <Helmet>
        <title>Collection | Fash-Shop</title>
        <meta name="description" content="Explore our latest collection of premium apparel at Fash-Shop." />
      </Helmet>
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="dropdown_icon"
          />
        </p>

        {/* Catagory Filter */}
        <div
          className={`border border-brand-blue-400 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-brand-blue-300">
            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Men</span>
            </label>

            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Women</span>
            </label>

            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Kids"}
                onChange={toggleCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Kids</span>
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-brand-blue-400 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-brand-blue-300">
            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Topwear</span>
            </label>

            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Bottomwear</span>
            </label>

            <label className="flex gap-2 items-center cursor-pointer group">
              <input
                className="hidden peer"
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              <div className="w-4 h-4 border border-brand-blue-600 rounded-sm bg-black peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                <svg className="w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="group-hover:text-red-500 transition-colors">Winterwear</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"All"} text2={"COLLECTIONS"} />
          {/* Product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="bg-black text-brand-blue-50 text-sm px-2 py-1 outline-none hover:text-red-500 transition-colors cursor-pointer"
          >
            <option value="relevent">Sort by: Relevent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">sort by: High to Low</option>
          </select>
        </div>

        {/* Map product */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProducItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
