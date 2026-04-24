import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProducItem from "./ProducItem";
import PropTypes from "prop-types";



const RelatedProducts = ({ productId, category, subCategory }) => {

  const { products, backendUrl } = useContext(ShopContext);
  const [related, setRelated] = useState([]);


  useEffect(() => {
    const load = async () => {
      try {
        if (productId) {
          const res = await axios.get(`${backendUrl}/api/product/${productId}/recommendations`);
          if (res.data?.success) {
            // Prefer same-subcategory items, fallback to whatever backend returns
            const recs = Array.isArray(res.data.recommendations) ? res.data.recommendations : [];
            const sameSub = recs.filter(r => r.subCategory === subCategory);
            setRelated((sameSub.length ? sameSub : recs).slice(0, 8));
            return;
          }
        }
        // Fallback to legacy behavior if API not available
        if (products.length > 0) {
          let productsCopy = products.slice();
          productsCopy = productsCopy.filter((item) => category === item.category && subCategory === item.subCategory);
          setRelated(productsCopy.slice(0, 8));
        }
      } catch {
        if (products.length > 0) {
          let productsCopy = products.slice();
          productsCopy = productsCopy.filter((item) => category === item.category && subCategory === item.subCategory);
          setRelated(productsCopy.slice(0, 8));
        }
      }
    };
    load();
  }, [products, category, subCategory, productId, backendUrl]);


  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-5">
        {related.map((item, index) => (
          <ProducItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

RelatedProducts.propTypes = {
  productId: PropTypes.string,
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired,
};

export default RelatedProducts;
