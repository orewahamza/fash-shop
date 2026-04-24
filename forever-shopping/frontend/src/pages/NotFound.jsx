import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-brand-blue-300 mb-4">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="underline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
