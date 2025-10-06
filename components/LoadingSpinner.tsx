import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
      <p className="mt-4 text-lg text-gray-300 font-serif-display italic">Ký ức đang tan vỡ...</p>
    </div>
  );
};

export default LoadingSpinner;
