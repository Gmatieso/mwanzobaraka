export interface Member {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  type: 'individual' | 'group';
  registrationDate: Date;
  monthlyContribution: number;
  shareBalance: number;
  status: 'active' | 'inactive';
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  purpose: string;
  leader: string;
  registrationDate: Date;
  members: Member[];
  status: 'active' | 'inactive';
}

export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  date: Date;
  type: 'monthly' | 'additional';
  receiptNumber: string;
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  purpose: string;
  interestRate: number;
  repaymentPeriod: number;
  monthlyPayment: number;
  outstandingBalance: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  date: Date;
  penalty?: number;
  receiptNumber: string;
}

export interface FinancialSummary {
  totalMembers: number;
  totalContributions: number;
  totalLoansOutstanding: number;
  totalInterestEarned: number;
  totalPenalties: number;
  dividendPool: number;
  organizationReserve: number;
}

export type UserRole = 'admin' | 'member' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId?: string;
}