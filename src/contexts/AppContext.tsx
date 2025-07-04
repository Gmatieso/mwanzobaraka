import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Member, Group, Contribution, Loan, LoanRepayment, User } from '../types';

interface AppContextType {
  members: Member[];
  setMembers: (members: Member[]) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  contributions: Contribution[];
  setContributions: (contributions: Contribution[]) => void;
  loans: Loan[];
  setLoans: (loans: Loan[]) => void;
  loanRepayments: LoanRepayment[];
  setLoanRepayments: (repayments: LoanRepayment[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [members, setMembers] = useLocalStorage<Member[]>('members', []);
  const [groups, setGroups] = useLocalStorage<Group[]>('groups', []);
  const [contributions, setContributions] = useLocalStorage<Contribution[]>('contributions', []);
  const [loans, setLoans] = useLocalStorage<Loan[]>('loans', []);
  const [loanRepayments, setLoanRepayments] = useLocalStorage<LoanRepayment[]>('loanRepayments', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', {
    id: '1',
    name: 'Admin User',
    email: 'admin@mwanzobaraka.org',
    role: 'admin'
  });

  return (
    <AppContext.Provider value={{
      members,
      setMembers,
      groups,
      setGroups,
      contributions,
      setContributions,
      loans,
      setLoans,
      loanRepayments,
      setLoanRepayments,
      currentUser,
      setCurrentUser
    }}>
      {children}
    </AppContext.Provider>
  );
};