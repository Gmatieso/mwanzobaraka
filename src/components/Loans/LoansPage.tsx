import React, { useState } from 'react';
import { Plus, Search, CreditCard, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Loan } from '../../types';

const LoansPage: React.FC = () => {
  const { members, loans, setLoans, contributions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'completed' | 'defaulted'>('all');

  const [loanForm, setLoanForm] = useState({
    memberId: '',
    amount: '',
    purpose: '',
    repaymentPeriod: '12'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanForm.memberId || !loanForm.amount || !loanForm.purpose) return;

    const member = members.find(m => m.id === loanForm.memberId);
    if (!member) return;

    // Calculate member's share balance
    const memberContributions = contributions.filter(c => c.memberId === loanForm.memberId);
    const shareBalance = memberContributions.reduce((sum, c) => sum + c.amount, 0);

    const loanAmount = parseFloat(loanForm.amount);
    const maxLoanAmount = member.type === 'individual' ? shareBalance * 3 : shareBalance * 4;

    if (loanAmount > maxLoanAmount) {
      alert(`Maximum loan amount for this member is KSh ${maxLoanAmount.toLocaleString()}`);
      return;
    }

    const monthlyInterest = 0.012; // 1.2% monthly
    const repaymentPeriod = parseInt(loanForm.repaymentPeriod);
    const monthlyPayment = (loanAmount * (1 + monthlyInterest * repaymentPeriod)) / repaymentPeriod;

    const newLoan: Loan = {
      id: `L${Date.now()}`,
      memberId: loanForm.memberId,
      amount: loanAmount,
      purpose: loanForm.purpose,
      interestRate: monthlyInterest,
      repaymentPeriod: repaymentPeriod,
      monthlyPayment: monthlyPayment,
      outstandingBalance: loanAmount,
      status: 'pending',
      applicationDate: new Date()
    };

    setLoans([...loans, newLoan]);
    
    // Reset form
    setLoanForm({
      memberId: '',
      amount: '',
      purpose: '',
      repaymentPeriod: '12'
    });
    setShowForm(false);
  };

  const approveLoan = (loanId: string) => {
    setLoans(loans.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'active', approvalDate: new Date(), disbursementDate: new Date() }
        : loan
    ));
  };

  const filteredLoans = loans.filter(loan => {
    const member = members.find(m => m.id === loan.memberId);
    const matchesSearch = member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || loan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const pendingLoans = loans.filter(l => l.status === 'pending').length;
  const totalOutstanding = loans.filter(l => l.status === 'active')
    .reduce((sum, l) => sum + l.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Loans Management</h2>
          <p className="text-gray-600">Process loan applications and manage repayments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>New Loan</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingLoans}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">KSh {totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">New Loan Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                <select
                  value={loanForm.memberId}
                  onChange={(e) => setLoanForm({...loanForm, memberId: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Choose a member...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.type === 'individual' ? 'Individual' : 'Group'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (KSh)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({...loanForm, amount: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({...loanForm, purpose: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Period (Months)</label>
                <select
                  value={loanForm.repaymentPeriod}
                  onChange={(e) => setLoanForm({...loanForm, repaymentPeriod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  <strong>Interest Rate:</strong> 1.2% per month<br />
                  <strong>Maximum Period:</strong> 36 months
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member name or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const member = members.find(m => m.id === loan.memberId);
                return (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-600">
                              {member?.name.split(' ').map(n => n[0]).join('') || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{loan.applicationDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        KSh {loan.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Outstanding: KSh {loan.outstandingBalance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {loan.monthlyPayment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'pending' && (
                        <button
                          onClick={() => approveLoan(loan.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                      )}
                      <button className="text-orange-600 hover:text-orange-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;