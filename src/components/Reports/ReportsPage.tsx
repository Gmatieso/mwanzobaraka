import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ReportsPage: React.FC = () => {
  const { members, contributions, loans, loanRepayments } = useApp();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const generateReport = () => {
    // This would generate and download the selected report
    console.log('Generating report:', selectedReport, dateRange);
  };

  const reportTypes = [
    { id: 'overview', name: 'Organization Overview', description: 'Complete summary of all activities' },
    { id: 'members', name: 'Member Report', description: 'All member information and statistics' },
    { id: 'contributions', name: 'Contributions Summary', description: 'Monthly contribution tracking' },
    { id: 'loans', name: 'Loan Portfolio', description: 'Active and completed loans analysis' },
    { id: 'financial', name: 'Financial Statement', description: 'Income, expenses, and dividend distribution' },
    { id: 'performance', name: 'Performance Metrics', description: 'Key performance indicators and trends' }
  ];

  // Calculate summary statistics
  const totalMembers = members.length;
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const totalInterest = loans.reduce((sum, l) => sum + (l.amount * l.interestRate * l.repaymentPeriod), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600">Generate comprehensive reports and analyze performance</p>
        </div>
        <button
          onClick={generateReport}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download size={20} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedReport === report.id
                      ? 'border-orange-600 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FileText size={20} className={selectedReport === report.id ? 'text-orange-600' : 'text-gray-400'} />
                    <span className="ml-2 font-medium">{report.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Date Range */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Members</span>
                <span className="font-medium">{totalMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Contributions</span>
                <span className="font-medium">KSh {totalContributions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Loans</span>
                <span className="font-medium">{activeLoans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Interest</span>
                <span className="font-medium">KSh {totalInterest.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Report Preview</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{dateRange.start} to {dateRange.end}</span>
          </div>
        </div>

        {selectedReport === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Total Members</h4>
                <p className="text-2xl font-bold text-blue-900">{totalMembers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Contributions</h4>
                <p className="text-2xl font-bold text-green-900">KSh {totalContributions.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">Active Loans</h4>
                <p className="text-2xl font-bold text-purple-900">{activeLoans}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-orange-700">Interest Earned</h4>
                <p className="text-2xl font-bold text-orange-900">KSh {totalInterest.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contribution</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.slice(0, 5).map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{member.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{member.type}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">KSh {member.monthlyContribution.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">... and {members.length - 5} more members</p>
            )}
          </div>
        )}

        {selectedReport === 'contributions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Total Contributions</h4>
                <p className="text-xl font-bold text-green-900">KSh {totalContributions.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Average Monthly</h4>
                <p className="text-xl font-bold text-blue-900">KSh {(totalContributions / Math.max(members.length, 1)).toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">Total Payments</h4>
                <p className="text-xl font-bold text-purple-900">{contributions.length}</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'loans' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Total Loans</h4>
                <p className="text-xl font-bold text-blue-900">{totalLoans}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Active</h4>
                <p className="text-xl font-bold text-green-900">{activeLoans}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-700">Pending</h4>
                <p className="text-xl font-bold text-yellow-900">{loans.filter(l => l.status === 'pending').length}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-red-700">Defaulted</h4>
                <p className="text-xl font-bold text-red-900">{loans.filter(l => l.status === 'defaulted').length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            This is a preview of the {reportTypes.find(r => r.id === selectedReport)?.name} report. 
            Click "Generate Report" to create a full PDF or Excel version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;