import React from 'react';
import Header from '@/components/Header';
import UserTypeSelector from '@/components/UserTypeSelector';
import UserDataCard from '@/components/UserDataCard';
import CreditPathAdvisor from '@/components/modules/CreditPathAdvisor';
import PreApprovalFinder from '@/components/modules/PreApprovalFinder';
import CreditSimulation from '@/components/modules/CreditSimulation';
import CoachFinancieroCTA from '@/components/CoachFinancieroCTA';
import { useAppContext } from '@/contexts/AppContext';

const Index = () => {
  const { userType, userData } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {!userType && <UserTypeSelector />}
        
        {userType && !userData && <UserDataCard />}
        
        {userData && (
          <>
            <UserDataCard />
            <CreditPathAdvisor />
            <PreApprovalFinder />
            <CreditSimulation />
            <CoachFinancieroCTA />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
