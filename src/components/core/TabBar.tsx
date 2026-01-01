import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab: 'home' | 'fd' = location.pathname.startsWith('/fd') ? 'fd' : 'home';

  return (
    <div className="fixed bottom-0 w-full bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 shadow-lg z-10">
      <div className="grid grid-cols-2 h-16">
        <button
          onClick={() => navigate('/finance')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform active:scale-95 ${activeTab === 'home' ? 'text-gray-300' : 'text-gray-500'} !rounded-button`}
        >
          <div className={`'text-lg transition-colors duration-200' ${activeTab === 'home' ? 'text-gray-300' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs mt-1 transition-colors duration-200">Finance</span>
        </button>
        <button
          onClick={() => navigate('/fd')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform active:scale-95 ${activeTab === 'fd' ? 'text-gray-300' : 'text-gray-500'} !rounded-button`}
        >
          <div className={`'text-lg transition-colors duration-200'`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
            </svg>
          </div>
          <span className="text-xs mt-1 transition-colors duration-200">Fixed Deposit</span>
        </button>
      </div>
    </div>
  );
};

export default TabBar;
