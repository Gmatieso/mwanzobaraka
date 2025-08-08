import React from 'react';
import { 
  Home, 
  Users, 
  PiggyBank, 
  CreditCard, 
  Calculator, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import logo from '../../../assets/plant.png';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { currentUser } = useApp();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'member', 'accountant'] },
    { id: 'members', label: 'Members', icon: Users, roles: ['admin', 'accountant'] },
    { id: 'contributions', label: 'Contributions', icon: PiggyBank, roles: ['admin', 'accountant'] },
    { id: 'loans', label: 'Loans', icon: CreditCard, roles: ['admin', 'accountant'] },
    { id: 'financial', label: 'Financial', icon: Calculator, roles: ['admin', 'accountant'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'accountant'] },
  ];

  const filteredItems = navigationItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-600 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-green-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200">
          <img src={logo} alt="Mwanzo Baraka Logo" className="w-12 h-12" />
          <p className="text-sm font-bold text-gray-50">Financial Management</p>
        </div>

        <nav className="mt-6">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-orange-600 text-white border-r-4 border-orange-800'
                    : 'text-white hover:bg-gray-50 hover:text-green-400'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-100">{currentUser?.name}</p>
              <p className="text-xs text-gray-100 capitalize">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;