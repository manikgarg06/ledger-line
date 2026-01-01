import React from 'react';

const StatusBar: React.FC = () => {
  return (
    <div className="fixed top-0 w-full z-10 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-300">Money View</h1>
      </div>
    </div>
  );
};

export default StatusBar;
