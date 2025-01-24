import React from "react";
import PricingCard from "../Components/PricingCard";
import { Link } from "react-router-dom";
import AnimationWrapper from "../Components/Animations";

function Pricing() {
  return (
    <>
      <div className="relative">
        <div className="absolute top-5 right-10 text-3xl text-gray-200 cursor-pointer">
          <Link to={"/"}>&times;</Link>
        </div>
      </div>
      <AnimationWrapper
        initial={{ opacity: 0, scale: 0.5 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
              <PricingCard />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
              <PricingCard />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
              <PricingCard />
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </>
  );
}

export default Pricing;
