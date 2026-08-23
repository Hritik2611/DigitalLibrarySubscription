import React from 'react';

const PlanCard = ({ plan, onSubscribe, processingPlan }) => {
  const isLoading = processingPlan === plan.name;

  return (
    <div
      className={`relative surface-card p-6 flex flex-col transition-transform duration-200 hover:-translate-y-1 ${
        plan.popular ? 'ring-2 ring-brand-400 shadow-[0_20px_45px_-15px_rgba(112,66,240,0.35)]' : ''
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-xl font-display font-bold text-center mb-1 text-gray-900 capitalize">
        {plan.name.replace('-', ' ')}
      </h3>
      <p className="text-4xl font-display font-extrabold text-center mb-4 gradient-text">
        ₹{plan.price}
      </p>
      <ul className="text-gray-600 space-y-2.5 mb-6 flex-grow text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-brand-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSubscribe(plan)}
        disabled={isLoading}
        className={isLoading ? 'w-full py-3 rounded-[0.9rem] bg-gray-200 text-gray-500 font-semibold cursor-not-allowed' : 'btn-primary w-full py-3'}
      >
        {isLoading ? 'Processing…' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default PlanCard;
