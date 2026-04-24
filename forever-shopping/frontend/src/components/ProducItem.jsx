import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { transformCloudinaryUrl, buildSrcSet } from "../utils/cloudinary";

const ProducItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const primary = Array.isArray(image) ? image[0] : image;

  return (
    <Link
      className="text-brand-blue-300 cursor-pointer"
      to={`/product/${id}`}
      onClick={handleClick}
    >
      <div className="overflow-hidden bg-gradient-brand p-[1.5px] rounded-md">
        <div className="overflow-hidden rounded-md bg-white">
          <img
            className="hover:scale-110 transition ease-out w-full"
            src={transformCloudinaryUrl(primary, { width: 640 })}
            srcSet={buildSrcSet(primary, [320, 480, 640, 800, 1024])}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
            alt="product_img"
            onError={(e) => { e.currentTarget.src = primary; }}
          />
        </div>
      </div>

      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};
ProducItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProducItem;
