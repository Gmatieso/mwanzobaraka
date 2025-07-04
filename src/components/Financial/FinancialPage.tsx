import React from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const FinancialPage: React.FC = () => {
  const { members, contributions, loans, loanRepayments } = useApp();

  // Calculate financial metrics
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalInterestEarned = loans.reduce((sum, l) => {
    if (l.status === 'active' || l.status === 'completed') {
      return sum + (l.amount * l.interestRate * l.repaymentPeriod);
    }
    return sum;
  }, 0);
  
  const totalPenalties = loanRepayments.reduce((sum, r) => sum + (r.penalty || 0), 0);
  const totalIncome = totalInterestEarned + totalPenalties;
  const dividendPool = totalIncome * 0.6; // 60% for dividends
  const organizationReserve = totalIncome * 0.4; // 40% for organization

  // Calculate individual dividends (proportionate to contributions)
  const memberDividends = members.map(member => {
    const memberContributions = contributions
      .filter(c => c.memberId === member.id)
      .reduce((sum, c) => sum + c.amount, 0);
    
    const dividendShare = totalContributions > 0 ? (memberContributions / totalContributions) * dividendPool : 0;
    
    return {
      memberId: member.id,
      memberName: member.name,
      contributions: memberContributions,
      dividendAmount: dividendShare
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Financial Management</h2>
          <p className="text-gray-600">Year-end calculations and dividend distribution</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Calculator size={20} />
          <span>Calculate Dividends</span>
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contributions</p>
              <p className="text-2xl font-bold text-gray-900">KSh {totalContributions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interest Earned</p>
              <p className="text-2xl font-bold text-gray-900">KSh {totalInterestEarned.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dividend Pool</p>
              <p className="text-2xl font-bold text-gray-900">KSh {dividendPool.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChart size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organization Reserve</p>
              <p className="text-2xl font-bold text-gray-900">KSh {organizationReserve.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calculator size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Interest from Loans</span>
              <span className="text-blue-700 font-bold">KSh {totalInterestEarned.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Penalties Collected</span>
              <span className="text-red-700 font-bold">KSh {totalPenalties.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <span className="text-green-700 font-medium">Total Income</span>
              <span className="text-green-700 font-bold">KSh {totalIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution Plan</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Member Dividends (60%)</span>
              <span className="text-purple-700 font-bold">KSh {dividendPool.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-700 font-medium">Organization Reserve (40%)</span>
              <span className="text-orange-700 font-bold">KSh {organizationReserve.toLocaleString()}</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Dividends are distributed proportionately based on each member's share contribution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Member Dividends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Dividend Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Contributions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dividend Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberDividends.map((dividend) => {
                const sharePercentage = totalContributions > 0 ? (dividend.contributions / totalContributions) * 100 : 0;
                return (
                  <tr key={dividend.memberId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-600">
                              {dividend.memberName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{dividend.memberName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {dividend.contributions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sharePercentage.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      KSh {dividend.dividendAmount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
          Export Report
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Process Dividend Payments
        </button>
      </div>
    </div>
  );
};

export default FinancialPage;