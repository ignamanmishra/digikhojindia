import React, { useState, useEffect } from 'react';
import { PortalSidebar } from './components/PortalSidebar';
import { PortalHeader } from './components/PortalHeader';
import { PortalDashboardView } from './views/PortalDashboardView';
import { PortalCompanyView } from './views/PortalCompanyView';
import { PortalSoftwareView } from './views/PortalSoftwareView';
import { PortalProjectsView } from './views/PortalProjectsView';
import { PortalRaiseTicketView } from './views/PortalRaiseTicketView';
import { PortalTicketsView } from './views/PortalTicketsView';
import { PortalAmcView } from './views/PortalAmcView';
import { PortalInvoicesView } from './views/PortalInvoicesView';
import { PortalDocumentsView } from './views/PortalDocumentsView';
import { PortalProfileView } from './views/PortalProfileView';
import { PortalLoginView } from './views/PortalLoginView';
import { getPortalToken, removePortalToken } from './api';
import { ThemeProvider } from '@digikhojindia/ui';

export function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('dki_portal_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Check if token already exists in storage
    if (getPortalToken()) {
      return {
        id: 'usr-client-rajesh',
        name: 'Dr. Rajesh Verma',
        email: 'rajesh@cityhospital.com',
        role: 'customer_admin',
        tenant_id: 'tenant-city-hospital',
        organization_name: 'City Hospital & Research Centre',
        customer_id: 'DKI-100001',
      };
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const handleLoginSuccess = (userData: any) => {
    const fullUser = {
      ...userData,
      organization_name: userData.organization_name || 'City Hospital & Research Centre',
      customer_id: userData.customer_id || 'DKI-100001',
    };
    setUser(fullUser);
    localStorage.setItem('dki_portal_user', JSON.stringify(fullUser));
  };

  const handleLogout = () => {
    removePortalToken();
    localStorage.removeItem('dki_portal_user');
    setUser(null);
  };

  if (!user) {
    return (
      <ThemeProvider>
        <PortalLoginView onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <PortalDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'company':
        return <PortalCompanyView />;
      case 'software':
        return <PortalSoftwareView customerId={user.customer_id || 'DKI-100001'} />;
      case 'projects':
        return <PortalProjectsView />;
      case 'raise-ticket':
        return (
          <PortalRaiseTicketView
            customerId={user.customer_id || 'DKI-100001'}
            onSuccess={(ticketId) => {
              setActiveTicketId(ticketId);
              setCurrentTab('tickets');
            }}
          />
        );
      case 'tickets':
        return <PortalTicketsView initialTicketId={activeTicketId} />;
      case 'amc':
        return <PortalAmcView />;
      case 'invoices':
        return <PortalInvoicesView />;
      case 'documents':
        return <PortalDocumentsView />;
      case 'profile':
        return (
          <PortalProfileView
            userName={user.name}
            userEmail={user.email}
            tenantId={user.tenant_id}
            role={user.role}
          />
        );
      default:
        return <PortalDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-[#080D20] text-slate-100 overflow-hidden font-sans relative">
        {/* Ambient Fluid Background Lights */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute -top-[10%] left-[25%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#287BFF]/15 via-[#42DDF5]/10 to-transparent blur-[140px] animate-pulse-slow" />
          <div className="absolute top-[35%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#9B70FF]/15 via-[#F078C8]/10 to-transparent blur-[140px] animate-pulse-slow" />
          <div className="absolute -bottom-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#102B50]/30 via-[#10B981]/10 to-transparent blur-[140px]" />
        </div>

        {/* Sidebar Navigation */}
        <PortalSidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={handleLogout}
          orgName={user.organization_name || 'Customer Organization'}
          userName={user.name}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <PortalHeader
            currentTab={currentTab}
            orgName={user.organization_name || 'Customer Organization'}
            customerId={user.customer_id || 'DKI-100001'}
            onRaiseTicket={() => setCurrentTab('raise-ticket')}
          />

          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {renderActiveView()}
            </div>

            {/* Mandatory Brand Footer */}
            <footer className="pt-8 pb-4 border-t border-white/10 text-center text-xs text-slate-500 space-y-0.5">
              <p>© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.</p>
              <p className="text-[11px] text-slate-600 italic">
                "Technology की हर नई खोज, आपके लिए!"
              </p>
            </footer>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
export default App;
