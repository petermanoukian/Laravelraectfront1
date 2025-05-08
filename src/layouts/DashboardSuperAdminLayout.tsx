//DashboardSuperAdminLayout.tsx
import React, { ReactNode ,  useState , useEffect } from 'react';
import UserStatus from '@/components/superadmin/UserStatus';
import { Link, NavLink } from 'react-router-dom';
import SidebarMenuLeftSuperAdmin, { MenuSection } from '@/components/superadmin/SidebarMenuLeftSuperAdmin';
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const menuSections: MenuSection[] = [
  {
    title: 'Users', // Change title to Users
    items: [
      { label: 'View Users', to: '/superadmin/users' },  // View Users
      { label: 'Add User', to: '/superadmin/users/add' },  // Add User
    ],
  },
  {
    title: 'Categories',
    items: [
      { label: 'View categories', to: '/superadmin/cats' },
      { label: 'Add category', to: '/superadmin/cats/add' },
      { label: 'View subcategories', to: '/superadmin/subcats/view?refreshsubs=fullrefresh' }, // <-- NEW
      { label: 'Add subcategory', to: '/superadmin/subcats/add' },
    ],
  },
  {
    title: 'Reports', // New section
    items: [
      { label: 'Sales Report', to: '/reports/sales' },
      { label: 'User Activity', to: '/reports/activity' },
    ],
  },

];




const DashboardSuperAdminLayout = ({ children }: { children: ReactNode }) => {
const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});


const location = useLocation();

useEffect(() => {
  const currentPath = location.pathname;


  for (const section of menuSections) {
    if (section.items.some(item => currentPath.startsWith(item.to))) {
      
      setOpenSections({
        [section.title]: true,
      });
      break;
    }
  }
}, [location.pathname]);


const setOpenSectionForRoute = (title: string) => {
  setOpenSections((prev) => {
    if (prev[title]) return prev; // already open, skip
    return {
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [title]: true,
    };
  });
};
  
const toggleSection = (title: string) => {
  setOpenSections((prev) => {
    const isOpen = prev[title];

    // Close all, then toggle the clicked one
    const newState: { [key: string]: boolean } = {};
    for (const key in prev) {
      newState[key] = false;
    }

    newState[title] = !isOpen;
    return newState;
  });
};


  
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}


      <header className="bg-white shadow px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Left side: title */}
                <div className="w-1/2">
                <h1 className="text-xl font-bold text-gray-800">
                <NavLink to="/superadmin" onClick={() => setOpenSections({})}
                  className={({ isActive }) =>
                            isActive ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-green-500'
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


 

        <SidebarMenuLeftSuperAdmin
          menuSections={menuSections}
          openSections={openSections}
          toggleSection={toggleSection}
          setOpenSectionForRoute={setOpenSectionForRoute}
        />

        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          
        <Outlet />
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
