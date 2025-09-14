import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoadingSpinner from './components/Common/LoadingSpinner';
import DashboardView from './components/Dashboard/DashboardView';
import './App.css';
import './styles/dark-minimal.css';

// Lazy load other views
const PatientsView = React.lazy(() => import('./components/Patients/PatientsView'));
const AlertsView = React.lazy(() => import('./components/Alerts/AlertsView'));
const TestCenter = React.lazy(() => import('./components/TestCenter/TestCenter'));

const MainContent = () => {
  const { patients, alerts, stats, loading, error, clearError } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigate = (tab) => setActiveTab(tab);

  const renderContent = () => {
    if (loading && patients.length === 0 && alerts.length === 0 && Object.keys(stats).length === 0) {
      return <div className="loading-container"><LoadingSpinner /></div>;
    }

    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        {activeTab === 'dashboard' && <DashboardView stats={stats} alerts={alerts} patients={patients} onNavigate={handleNavigate} />}
        {activeTab === 'patients' && <PatientsView patients={patients} />}
        {activeTab === 'alerts' && <AlertsView alerts={alerts} />}
        {activeTab === 'test' && <TestCenter patients={patients} />}
      </React.Suspense>
    );
  };

  return (
    <div className="app app--dark-minimal" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
      <div className="app-shell" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside className="sidenav ghost-scroll" style={{
          width: '260px',
          minWidth: '200px',
          background: '#013220', // your sidebar background
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          overflowY: 'auto'
        }}>
          <div className="sidenav__brand" style={{ padding: '0 16px', marginBottom: '24px' }}>
            <div className="sidenav__title" style={{ fontSize: '20px', fontWeight: '700' }}>MediSys</div>
          </div>

          <div className="sidenav__section" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { tab: 'dashboard', label: 'Dashboard', icon: 'dashboard', iconColor: '#fff' },
              { tab: 'patients', label: 'Patients Details', icon: 'folder', iconColor: '#fff' },
              { tab: 'alerts', label: 'Patients Alerts', icon: 'notification_important', iconColor: '#ff4c4c' },
              { tab: 'test', label: 'Testing Center', icon: 'build', iconColor: '#fff' }
            ].map(item => (
              <div
                key={item.tab}
                className={`sidenav__item ${activeTab === item.tab ? 'is-active' : ''}`}
                onClick={() => setActiveTab(item.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontWeight: activeTab === item.tab ? '600' : '400',
                  background: activeTab === item.tab ? '#026341' : 'transparent',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
              >
                <span className="material-symbols-rounded" style={{ color: item.iconColor }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content" style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#f0f7f3', // main content background
        }}>
          {/* Error Banner */}
          {error && (
            <div className="alert alert--danger" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button className="btn btn--icon" onClick={clearError} style={{ background: 'none', border: 'none', color: '#fff' }}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
          )}

          {/* Main Rendered Content */}
          <div className="content-area" style={{ flex: 1 }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainContent />
  </AppProvider>
);

export default App;
