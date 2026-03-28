import React from 'react';
import bgImg from '../assets/bgImg.jpg';

// This component creates the 50/50 split-screen layout.
const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Image Section (Hidden on small screens) */}
      <div 
        className="hidden lg:block w-1/2 bg-cover bg-center" 
        style={{ backgroundImage:  `url(${bgImg})` }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center text-white px-12">
            <h1 className="text-4xl font-bold">Your Quiet Corner for Success.</h1>
            <p className="mt-4 text-lg">Join a community of dedicated students in an environment built for focus and growth.</p>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* The Login or Register form will be placed here */}
          {children} 
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

