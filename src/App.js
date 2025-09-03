import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ErrorAlert from './components/Common/ErrorAlert';
import DashboardView from './components/Dashboard/DashboardView';
import { useAppContext } from './context/AppContext';
import './App.css';
import './styles/dark-minimal.css';

// Import other views (you'll need to create these similar to the dashboard)
const PatientsView = React.lazy(() => import('./components/Patients/PatientsView'));
const AlertsView = React.lazy(() => import('./components/Alerts/AlertsView'));
const TestCenter = React.lazy(() => import('./components/TestCenter/TestCenter'));

const MainContent = () => {
  const { 
    patients, 
    alerts, 
    stats, 
    loading, 
    error, 
    clearError 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    // Show loading spinner only when initially loading data
    if (loading && patients.length === 0 && alerts.length === 0 && Object.keys(stats).length === 0) {
      return (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        {activeTab === 'dashboard' && (
          <DashboardView 
            stats={stats} 
            alerts={alerts} 
            patients={patients}
            onNavigate={handleNavigate}
          />
        )}
        
        {activeTab === 'patients' && (
          <PatientsView patients={patients} />
        )}
        
        {activeTab === 'alerts' && (
          <AlertsView alerts={alerts} />
        )}
        
        {activeTab === 'test' && (
          <TestCenter patients={patients} />
        )}
      </React.Suspense>
    );
  };

  return (
    <div className="app app--dark-minimal">
      <div className="app-shell">
        <aside className="sidenav ghost-scroll">
          <div className="sidenav__brand">
            <div className="sidenav__title">MediSys</div>
          </div>

          <div className="sidenav__section">
            <div className={`sidenav__item ${activeTab === 'dashboard' ? 'is-active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="material-symbols-rounded">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div className={`sidenav__item ${activeTab === 'patients' ? 'is-active' : ''}`} onClick={() => setActiveTab('patients')}>
              <span className="material-symbols-rounded">folder</span>
              <span>Patients</span>
            </div>
            <div className={`sidenav__item ${activeTab === 'alerts' ? 'is-active' : ''}`} onClick={() => setActiveTab('alerts')}>
              <span className="material-symbols-rounded">analytics</span>
              <span>Alerts</span>
            </div>
            <div className={`sidenav__item ${activeTab === 'test' ? 'is-active' : ''}`} onClick={() => setActiveTab('test')}>
              <span className="material-symbols-rounded">settings</span>
              <span>Test Center</span>
            </div>
          </div>
        </aside>

        <main className="main-content" style={{ padding: 'var(--s-6)', overflow: 'auto', minHeight: '100vh' }}>
          {/* Error Display */}
          {error && (
            <div className="alert alert--danger">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{error}</span>
                <button className="btn btn--icon" onClick={clearError} style={{ background: 'none', border: 'none' }}>
                  <span className="material-symbols-rounded">close</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;