import React, { ReactNode } from 'react';
import UserStatus from '@/components/superadmin/UserStatus';
import { NavLink } from 'react-router-dom';
const DashboardSuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}


      <header className="bg-white shadow px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left side: title */}
                <div className="w-1/2">
                <h1 className="text-xl font-bold text-gray-800">
                <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? 'text-green-600 font-bold' : 'text-gray-600 hover:text-green-500'
                        }
                        >
                        Home
               </NavLink>

                </h1>
                </div>

                {/* Right side: user info */}
                <div className="w-1/2 text-right">
                <UserStatus />
                </div>
            </div>
        </header>


      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <nav className="space-y-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">Users</a>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">Settings</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        © 2025 Superadmin Dashboard
      </footer>
    </div>
  );
};

export default DashboardSuperAdminLayout;
