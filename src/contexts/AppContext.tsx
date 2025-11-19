import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'client' | 'visitor' | null;

export interface UserData {
  ingresos: number;
  empleo: string;
  deuda: number;
  retrasos: number;
  importe: number;
}

export interface CreditPathResult {
  explanation: string;
  currentProbability: number;
  improvedProbability: number;
  limitingFactors: { factor: string; impact: number }[];
}

export interface PreApprovalResult {
  products: { name: string; probability: number; amount: number; risk: string }[];
  overallRisk: number;
}

export interface SimulationResult {
  narrative: string;
  beforeScore: number;
  afterScore: number;
  impactFactors: { factor: string; value: number }[];
}

interface AppContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  creditPath: CreditPathResult | null;
  setCreditPath: (data: CreditPathResult) => void;
  preApproval: PreApprovalResult | null;
  setPreApproval: (data: PreApprovalResult) => void;
  simulation: SimulationResult | null;
  setSimulation: (data: SimulationResult) => void;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [creditPath, setCreditPath] = useState<CreditPathResult | null>(null);
  const [preApproval, setPreApproval] = useState<PreApprovalResult | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    setChatHistory(prev => [...prev, { role, content }]);
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        userData,
        setUserData,
        creditPath,
        setCreditPath,
        preApproval,
        setPreApproval,
        simulation,
        setSimulation,
        chatHistory,
        addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
