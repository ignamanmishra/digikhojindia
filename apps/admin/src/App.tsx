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

export const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
        Initializing Digikhojindia Admin Cockpit...
      </div>
    );
  }

  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        userName={user.full_name}
        userRole={user.role}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentTab={currentTab} userName={user.full_name} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && <OverviewView onNavigate={(tab) => setCurrentTab(tab)} />}
            {currentTab === 'customers' && <CustomersView />}
            {currentTab === 'leads' && <LeadsView />}
            {currentTab === 'enquiries' && <EnquiriesView />}
            {currentTab === 'tickets' && <TicketsView />}
            {currentTab === 'projects' && <ProjectsView />}
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
        </main>
      </div>
    </div>
  );
};
export default App;
