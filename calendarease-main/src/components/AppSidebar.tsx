import { useState } from 'react';
import { Calendar, Home, Mic, Bell, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Головна",
    icon: Home,
    href: "/",
  },
  {
    title: "Календар",
    icon: Calendar,
    href: "/calendar",
  },
  {
    title: "Нагадування",
    icon: Bell,
    href: "/reminders",
  },
  {
    title: "Голосові замітки",
    icon: Mic,
    href: "/voice-notes",
  },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <h2 className="text-xl font-semibold">CalendarEase</h2>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center space-x-2 p-3 rounded-lg mb-2
                ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                transition-colors
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
