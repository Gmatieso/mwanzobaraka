import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <header className="bg-green-800 shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Karibu Tena, {currentUser?.name}</h1>
          <p className="text-sm text-gray-100">Here's what's happening with your organization today.</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;