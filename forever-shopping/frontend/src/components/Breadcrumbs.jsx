import { Link, useLocation } from "react-router-dom";

const LABELS = {
  "": "Home",
  collection: "Collection",
  about: "About",
  contact: "Contact",
  product: "Product",
  cart: "Cart",
  login: "Login",
  "sign-up": "Sign Up",
  "fash-shop": "fash-shop",
  profile: "Profile",
  "host": "Host Panel",
  orders: "Orders",
  "place-order": "Place Order",
  verify: "Verify",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  // Hide breadcrumbs on the home page
  if (parts.length === 0) return null;

  let pathAcc = "";

  return (
    <nav aria-label="Breadcrumb" className="text-sm my-3">
      <ol className="flex flex-wrap items-center gap-2 text-brand-blue-300">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        {parts.map((seg, idx) => {
          pathAcc += `/${seg}`;
          const isLast = idx === parts.length - 1;
          const label = LABELS[seg] || decodeURIComponent(seg);
          return (
            <li key={idx} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span aria-current="page" className="text-brand-black-900">
                  {label}
                </span>
              ) : (
                <Link to={pathAcc} className="hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
