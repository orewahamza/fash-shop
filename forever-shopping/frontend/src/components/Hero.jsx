import React from "react";
import { assets } from './../assets/assets';

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-red-600 bg-gradient-brand-radial">
      {/* Hero left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-red-500">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-red-500"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELERS</p>
          </div>

          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Latest Arrivals
          </h1>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-gradient-to-r from-primary to-secondary"></p>
          </div>
        </div>
      </div>


      {/* Hero right side */}
      <img src={assets.hero_img} alt="Hero_img" className="w-full sm:w-1/2"/>
    </div>
  );
};

export default Hero;
