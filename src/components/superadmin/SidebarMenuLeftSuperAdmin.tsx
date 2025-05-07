//SidebarMenuLeftSuperAdmin.tsx
import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type MenuSection = {
  title: string;
  items: { label: string; to: string }[];
};

type SidebarMenuLeftSuperAdminProps = {
  menuSections: MenuSection[];
  openSections: { [key: string]: boolean };
  toggleSection: (title: string) => void;
  setOpenSectionForRoute: (title: string) => void;
};

const SidebarMenuLeftSuperAdmin = ({
    menuSections,
    openSections,
    toggleSection,
    setOpenSectionForRoute,
  }: SidebarMenuLeftSuperAdminProps) => 
  {
  const location = useLocation();
  const navigate = useNavigate();
  // Automatically open parent section based on active route (even if it's a submenu)

  useEffect(() => {
    const activeRoute = location.pathname;

  
    menuSections.forEach((section) => {
      const isMatch = section.items.some(
        (item) => activeRoute === item.to || activeRoute.startsWith(item.to + '/')
      );

  
      if (isMatch && !openSections[section.title]) {
    
        //setOpenSectionForRoute(section.title);
      }
    });
  }, [location.pathname, menuSections, openSections, setOpenSectionForRoute]);
  
  
  

  return (
    <nav className="w-60 space-y-2 p-4">
      {menuSections.map((section) => (
        <div key={section.title}>
          <div
            onClick={() => toggleSection(section.title)}
            className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm font-semibold hover:text-blue-600"
          >
            <span>{section.title}</span>
            {openSections[section.title] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>

          {/* Section Items */}
          {openSections[section.title] && (
            <div className="ml-4 mt-1 flex flex-col space-y-1 text-sm">
              {section.items.map((item) => (
                  <div
                  key={item.to}
                  onClick={() => {
                    if (location.pathname === item.to) {
                      // Force rerender by pushing a dummy state
                      navigate(item.to, { state: { refresh: Date.now() } });
                    }
                  }}
                >
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-1 rounded transition-all duration-200 ${
                    location.pathname === item.to
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:text-blue-500'
                  }`}
                >
                  {item.label}
                </NavLink>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenuLeftSuperAdmin;
