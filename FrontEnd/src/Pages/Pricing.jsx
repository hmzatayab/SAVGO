import React from "react";
import PricingCard from "../Components/PricingCard";
import { Link } from "react-router-dom";
import AnimationWrapper from "../Components/Animations";

function Pricing() {
  const pricingPlans = [
    {
      title: "Basic Plan",
      price: "$29",
      features: [
        "Upload up to 10 images",
        "Sell images at your price",
        "Basic support",
        "No API Access",
        "Limited documentation",
      ],
      premiumFeatures: [
        "Advanced analytics",
        "Priority support",
        "API Access",
        "Complete documentation",
        "24×7 phone & email support",
      ],
    },
    {
      title: "Standard Plan",
      price: "$49",
      features: [
        "Upload up to 50 images",
        "Sell images at your price",
        "Integration help",
        "Basic API Access",
        "Complete documentation",
      ],
      premiumFeatures: [
        "Advanced analytics",
        "Priority support",
        "Full API Access",
        "24×7 phone & email support",
      ],
    },
    {
      title: "Premium Plan",
      price: "$99",
      features: [
        "Upload unlimited images",
        "Sell images at your price",
        "Priority support",
        "Full API Access",
        "Complete documentation",
        "24×7 phone & email support",
        "Advanced analytics",
      ],
      premiumFeatures: [], // No premium features for the Premium plan
    },
  ];

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
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
              >
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  features={plan.features}
                  premiumFeatures={plan.premiumFeatures}
                />
              </div>
            ))}
          </div>
        </div>
      </AnimationWrapper>
    </>
  );
}

export default Pricing;