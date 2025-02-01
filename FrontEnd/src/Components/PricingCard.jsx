import React from "react";
import { Card } from "flowbite-react";

function PricingCard({ title, price, features, premiumFeatures }) {
  return (
    <Card className="max-w-sm bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-300 h-full flex flex-col">
      <h5 className="mb-4 text-xl font-medium text-gray-300">{title}</h5>
      <div className="flex items-baseline text-white">
        <span className="text-3xl font-semibold">$</span>
        <span className="text-5xl font-extrabold tracking-tight">
          {price.replace("$", "")}
        </span>
        <span className="ml-1 text-xl font-normal text-gray-400">/month</span>
      </div>
      <ul className="my-7 space-y-5 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex space-x-3">
            <svg
              className="h-5 w-5 shrink-0 text-cyan-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-normal leading-tight text-gray-400">
              {feature}
            </span>
          </li>
        ))}
        {premiumFeatures.map((feature, index) => (
          <li key={index} className="flex space-x-3 line-through decoration-gray-500">
            <svg
              className="h-5 w-5 shrink-0 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-normal leading-tight text-gray-500">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:from-cyan-700 hover:to-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 transition-all duration-300"
      >
        Choose plan
      </button>
    </Card>
  );
}

export default PricingCard;