import React from 'react';

const PlanCard = ({ plan, onSubscribe, processingPlan }) => {
  const isLoading = processingPlan === plan.name;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <h3 className="text-2xl font-bold text-center mb-2">{plan.name.replace('-', ' ')}</h3>
      <p className="text-4xl font-extrabold text-center mb-4">
        ₹{plan.price}
      </p>
      <ul className="text-gray-600 space-y-2 mb-6 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSubscribe(plan)}
        disabled={isLoading}
        className={`mt-auto w-full font-bold py-3 px-4 rounded-lg transition duration-300 ${
          isLoading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default PlanCard;