import React from "react";
import { toast } from "react-toastify";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast.info("This is a demo project and doesn't support newsletter subscription yet.");
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-brand-blue-50">
        Subscribe now & get 20% off
      </p>

      <p className="text-brand-blue-300 mt-3">
        Be the first to know about our latest collections and exclusive offers.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-brand-blue-600 bg-black pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none bg-black text-white"
          type="email"
          placeholder="Enter your email"
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-10 py-4 hover:brightness-110"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
