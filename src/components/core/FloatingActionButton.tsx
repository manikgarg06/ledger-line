import React from 'react';

export interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 right-4 z-10">
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-[7px] bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg flex items-center justify-center border border-gray-600 cursor-pointer !rounded-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-xl text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;
