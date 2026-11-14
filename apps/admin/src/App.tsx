import React, { useState, useEffect } from 'react';
import { apiRequest, getAuthToken, removeAuthToken } from './api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './views/LoginView';
import { OverviewView } from './views/OverviewView';
import { CustomersView } from './views/CustomersView';
import { LeadsView } from './views/LeadsView';
import { EnquiriesView } from './views/EnquiriesView';
import { TicketsView } from './views/TicketsView';
import { ProjectsView } from './views/ProjectsView';
import { SoftwareView } from './views/SoftwareView';
import { AmcView } from './views/AmcView';
import { InvoicesView } from './views/InvoicesView';
import { ReportsView } from './views/ReportsView';
import { CmsView } from './views/CmsView';
import { GbpView } from './views/GbpView';
import { AutomationView } from './views/AutomationView';
import { IntegrationsView } from './views/IntegrationsView';
import { EmployeesView } from './views/EmployeesView';
import { AuditLogsView } from './views/AuditLogsView';
import { SettingsView } from './views/SettingsView';
import { ThemeProvider } from '@digikhojindia/ui';

export const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiRequest('/auth/me')
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          } else {
            removeAuthToken();
          }
        })
        .catch(() => removeAuthToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {}
    removeAuthToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D20] flex items-center justify-center text-cyan-300 text-xs font-semibold gap-2">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Initializing Digikhojindia Liquid Glass Cockpit...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <LoginView onLoginSuccess={(u) => setUser(u)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-[#080D20] text-slate-100 overflow-hidden relative">
        {/* Ambient Fluid Background Lights */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute -top-[10%] left-[25%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#287BFF]/15 via-[#42DDF5]/10 to-transparent blur-[140px] animate-pulse-slow" />
          <div className="absolute top-[35%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#9B70FF]/15 via-[#F078C8]/10 to-transparent blur-[140px] animate-pulse-slow" />
          <div className="absolute -bottom-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#102B50]/30 via-[#10B981]/10 to-transparent blur-[140px]" />
        </div>

        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
          userName={user.full_name || user.name || 'Staff User'}
          userRole={user.role}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            currentTab={currentTab}
            userName={user.full_name || user.name || 'Staff User'}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {currentTab === 'overview' && <OverviewView onNavigate={(tab) => setCurrentTab(tab)} />}
              {currentTab === 'customers' && <CustomersView />}
              {currentTab === 'leads' && <LeadsView />}
              {currentTab === 'enquiries' && <EnquiriesView />}
              {currentTab === 'tickets' && <TicketsView />}
              {currentTab === 'projects' && <ProjectsView />}
              {currentTab === 'employee-panel' && <EmployeesView />}
              {currentTab === 'software' && <SoftwareView />}
              {currentTab === 'amc' && <AmcView />}
              {currentTab === 'invoices' && <InvoicesView />}
              {currentTab === 'reports' && <ReportsView />}
              {currentTab === 'cms' && <CmsView />}
              {currentTab === 'gbp' && <GbpView />}
              {currentTab === 'automation' && <AutomationView />}
              {currentTab === 'integrations' && <IntegrationsView />}
              {currentTab === 'employees' && <EmployeesView />}
              {currentTab === 'audit' && <AuditLogsView />}
              {currentTab === 'settings' && <SettingsView />}
            </div>

            {/* Mandatory Brand Footer */}
            <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-white/10 space-y-0.5">
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
};
export default App;
