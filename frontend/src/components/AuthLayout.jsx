import React from 'react';
import bgImg from '../assets/bgImg.jpg';

// Split-screen auth layout: gradient/image story panel + clean form panel.
const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-700/80 to-brand-500/70" />
        {/* Decorative glow blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-300/30 rounded-full blur-3xl" />

        <div className="relative text-center text-white px-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            📚 Digital Library
          </div>
          <h1 className="text-4xl font-display font-extrabold leading-tight">
            Your Quiet Corner<br />for Success.
          </h1>
          <p className="mt-4 text-lg text-brand-50/90">
            Join a community of dedicated students in an environment built for focus and growth.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_top_right,_#f2f0ff,_#ffffff_60%)]">
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
