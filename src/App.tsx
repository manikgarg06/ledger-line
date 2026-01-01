import React from 'react';
import './App.css';
import { StatusBar, TabBar } from './components/core';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeTab from './tabs/HomeTab';
import FDTab from './tabs/FDTab';

const App: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-gray-200 relative pb-16">
      <StatusBar />

      <div className="pt-16 pb-4">
        <Routes>
          <Route path="/" element={<Navigate to="/finance" replace />} />
          <Route path="/home" element={<Navigate to="/finance" replace />} />
          <Route path="/finance" element={<HomeTab detail={false} />} />
          <Route path="/finance/:personId" element={<HomeTab detail={true} />} />
          <Route path="/fd" element={<FDTab detail={false} />} />
          <Route path="/fd/:personId" element={<FDTab detail={true} />} />
          <Route path="*" element={<Navigate to="/finance" replace />} />
        </Routes>
      </div>

      <TabBar />
    </div>
  );
};

export default App;
