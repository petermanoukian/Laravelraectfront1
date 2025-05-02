// layouts/GuestLayout.tsx
import React from 'react';

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded">
        {children}
      </div>
    </div>
  );
};

export default GuestLayout;
