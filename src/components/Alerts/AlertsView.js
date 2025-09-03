import React from 'react';
import { useAppContext } from '../../context/AppContext';

const AlertsView = ({ alerts }) => {
  const { loading, refreshData } = useAppContext();

  if (loading) {
    return (
      <div style={{ padding: 'var(--s-6) 0' }}>
        <h1>Alerts</h1>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts?.filter(alert => alert.severity_level === 'high') || [];
  const unresolvedAlerts = alerts?.filter(alert => !alert.resolved) || [];

  return (
    <div style={{ padding: 'var(--s-6) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-6)' }}>
        <div>
          <h1>Alerts ({alerts?.length || 0})</h1>
          <p className="text-secondary">Monitor and manage patient health alerts</p>
        </div>
        <button onClick={refreshData} className="btn btn--primary">
          <span className="material-symbols-rounded">refresh</span>
          Refresh
        </button>
      </div>
      
      {/* Alert Summary Cards */}
      <div className="grid grid--auto" style={{ marginBottom: 'var(--s-6)' }}>
        <div className="col-4">
          <div className="card card--kpi">
            <div className="kpi">
              <div className="kpi__label">Critical Alerts</div>
              <div className="kpi__value" style={{ color: 'var(--danger)' }}>
                {criticalAlerts.length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card card--kpi">
            <div className="kpi">
              <div className="kpi__label">Unresolved</div>
              <div className="kpi__value" style={{ color: 'var(--warning)' }}>
                {unresolvedAlerts.length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card card--kpi">
            <div className="kpi">
              <div className="kpi__label">Total Today</div>
              <div className="kpi__value" style={{ color: 'var(--text-0)' }}>
                {alerts?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div>
        {!alerts || alerts.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-rounded">notifications</span>
            <h3>No Alerts Found</h3>
            <p>All systems are running normally</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--s-4)' }}>
            {alerts.map(alert => (
              <div 
                key={alert.alert_id} 
                className="card"
                style={{
                  borderLeft: `4px solid ${
                    alert.severity_level === 'high' ? 'var(--danger)' :
                    alert.severity_level === 'medium' ? 'var(--warning)' : 'var(--info)'
                  }`,
                  opacity: alert.resolved ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--s-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--accent)' }}>
                      {alert.patient_id}
                    </span>
                    <span>{alert.patient_name}</span>
                    <span className={`badge badge--${
                      alert.severity_level === 'high' ? 'danger' : 
                      alert.severity_level === 'medium' ? 'warning' : 'success'
                    }`}>
                      {alert.severity_level}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-2)' }}>
                    {new Date(alert.datetime).toLocaleString()}
                  </div>
                </div>
                
                <div style={{ marginBottom: 'var(--s-3)' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-0)', marginBottom: 'var(--s-2)' }}>
                    <span className="material-symbols-rounded" style={{ 
                      verticalAlign: 'middle', 
                      marginRight: '8px',
                      fontSize: '18px',
                      color: alert.severity_level === 'high' ? 'var(--danger)' :
                             alert.severity_level === 'medium' ? 'var(--warning)' : 'var(--accent)'
                    }}>
                      {alert.severity_level === 'high' ? 'emergency' : 'warning'}
                    </span>
                    {alert.issue_detected}
                  </div>
                  {alert.message && (
                    <div style={{ fontSize: 'var(--fs-body)', color: 'var(--text-1)' }}>
                      {alert.message}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {alert.resolved ? (
                    <span className="chip" style={{ 
                      background: 'rgba(111, 180, 143, 0.2)', 
                      border: '1px solid var(--success)',
                      color: 'var(--success)'
                    }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>check_circle</span>
                      Resolved
                    </span>
                  ) : (
                    <span className="chip" style={{ 
                      background: 'rgba(216, 163, 84, 0.2)', 
                      border: '1px solid var(--warning)',
                      color: 'var(--warning)'
                    }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>pending</span>
                      Unresolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;