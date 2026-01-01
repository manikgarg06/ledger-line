import React from 'react';

export interface QuickActionsProps {
  onQuickAction: (type: 'given' | 'received' | 'settled') => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => onQuickAction('given')}
        className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-400 mr-1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
        <span>Given</span>
      </button>
      <button
        onClick={() => onQuickAction('received')}
        className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-400 mr-1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
        Received
      </button>
      <button
        onClick={() => onQuickAction('settled')}
        className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-400 mr-1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Settled
      </button>
    </div>
  );
};

export default QuickActions;
