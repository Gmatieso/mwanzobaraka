import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import MembersPage from './components/Members/MembersPage';
import ContributionsPage from './components/Contributions/ContributionsPage';
import LoansPage from './components/Loans/LoansPage';
import FinancialPage from './components/Financial/FinancialPage';
import ReportsPage from './components/Reports/ReportsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'members':
        return <MembersPage />;
      case 'contributions':
        return <ContributionsPage />;
      case 'loans':
        return <LoansPage />;
      case 'financial':
        return <FinancialPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <div className="lg:ml-64">
          <Header />
          <main className="p-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;