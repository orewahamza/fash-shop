import { assets } from "../assets/assets";
import { FiPhone, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm">
        <div>
          <span className="text-3xl font-bold tracking-wide uppercase bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-5 block">fash-shop</span>
          <p className="w-full md:w-2/3 text-brand-blue-300">
            Fash-Shop is your premier destination for modern fashion. We are dedicated to providing the highest quality apparel with a focus on style, comfort, and sustainability.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-brand-blue-300">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-brand-blue-300">
            <li className="flex items-center gap-2">
              <FiPhone className="text-brand-blue-400" />
              <span>+880 1992113015</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-brand-blue-400" />
              <span>pranto113015@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-brand-blue-800" />
        <p className="py-5 text-sm text-center text-brand-blue-300">
          © {new Date().getFullYear()} fash-shop. All rights reserved.
          <span className="ml-1">
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/pranto-kumar-a326801b3/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              Pranto Kumar
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
