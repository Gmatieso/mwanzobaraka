import React from 'react';
import { Users, PiggyBank, CreditCard, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatsCard from './StatsCard';

const DashboardPage: React.FC = () => {
  const { members, contributions, loans, loanRepayments } = useApp();

  // Calculate statistics
  const totalMembers = members.length;
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalLoansOutstanding = loans
    .filter(l => l.status === 'active')
    .reduce((sum, l) => sum + l.outstandingBalance, 0);
  const totalInterestEarned = loanRepayments.reduce((sum, r) => sum + (r.amount * 0.012), 0);

  const activeLoans = loans.filter(l => l.status === 'active');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const overdueLoans = loans.filter(l => l.status === 'defaulted');

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={totalMembers.toString()}
          icon={Users}
          trend={{ value: '12%', isPositive: true }}
          color="orange"
        />
        <StatsCard
          title="Total Contributions"
          value={`KSh ${totalContributions.toLocaleString()}`}
          icon={PiggyBank}
          trend={{ value: '8%', isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Loans Outstanding"
          value={`KSh ${totalLoansOutstanding.toLocaleString()}`}
          icon={CreditCard}
          trend={{ value: '15%', isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Interest Earned"
          value={`KSh ${totalInterestEarned.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: '22%', isPositive: true }}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <span className="text-orange-700 font-medium">Register New Member</span>
              <Users size={18} className="text-orange-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-green-700 font-medium">Record Contribution</span>
              <PiggyBank size={18} className="text-green-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-blue-700 font-medium">Process Loan</span>
              <CreditCard size={18} className="text-blue-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Status Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">Pending Applications</span>
              </div>
              <span className="font-semibold text-gray-800">{pendingLoans.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard size={16} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Active Loans</span>
              </div>
              <span className="font-semibold text-gray-800">{activeLoans.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-500 mr-2" />
                <span className="text-sm text-gray-600">Overdue Loans</span>
              </div>
              <span className="font-semibold text-gray-800">{overdueLoans.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-green-100 rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {contributions.slice(-5).map((contribution, index) => {
            const member = members.find(m => m.id === contribution.memberId);
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{member?.name || 'Unknown Member'}</p>
                  <p className="text-sm text-gray-600">Monthly contribution payment</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+KSh {contribution.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{contribution.date.toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;