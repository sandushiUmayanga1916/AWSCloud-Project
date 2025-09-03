import React, { useEffect } from 'react';
import TelemetryForm from './TelemetryForm';

const TestCenter = ({ patients }) => {
  useEffect(() => {
    // disable page scroll while Test Center is mounted, but allow inner scrollable areas
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow || '';
      document.documentElement.style.overflow = prevHtmlOverflow || '';
    };
  }, []);
  return (
    <div style={{ padding: 'var(--s-6) 0' }}>
      <div style={{ marginBottom: 'var(--s-6)' }}>
        <h1>Test Center</h1>
        <p className="text-secondary">Simulate live telemetry data from wearable health devices</p>
      </div>
      
      <div className="test-center-grid" style={{ marginBottom: 'var(--s-6)' }}>
        <div>
          <div className="card" style={{ padding: 'var(--s-5)', minHeight: '460px' }}>
            <TelemetryForm />
          </div>
        </div>
        
        <div>
          <div className="card" style={{ padding: 'var(--s-5)' }}>
            <h3 style={{ marginBottom: 'var(--s-4)' }}>
              <span className="material-symbols-rounded" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                monitor_heart
              </span>
              Live Monitoring
            </h3>
            <div className="live-monitoring">
              <div className="live-monitoring__list ghost-scroll">
                {patients && patients.length > 0 ? (
                  patients.map(patient => (
                    <div key={patient.patient_id} className="live-patient-card">
                      <div className="live-patient-card__meta">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="patient-id">{patient.patient_id}</span>
                          <span className={`badge badge--${
                            patient.connection_status.toLowerCase() === 'online' ? 'success' : 
                            patient.connection_status.toLowerCase() === 'offline' ? 'danger' : 'warning'
                          }`}>
                            {patient.connection_status}
                          </span>
                        </div>
                        <div className="patient-name">{patient.name}</div>
                      </div>
                      <div className="live-patient-card__kpis">
                        <div className="kpi-inline">
                          <div className="kpi__label">HR</div>
                          <div className="kpi__value" style={{
                            color: patient.heart_rate > 100 ? 'var(--danger)' : 
                                   patient.heart_rate < 60 ? 'var(--warning)' : 'var(--success)',
                            fontFamily: 'var(--font-display)'
                          }}>
                            {patient.heart_rate || '--'}{patient.heart_rate && <span style={{ fontSize: '10px', color: 'var(--text-2)' }}>bpm</span>}
                          </div>
                        </div>

                        <div className="kpi-inline">
                          <div className="kpi__label">O₂</div>
                          <div className="kpi__value" style={{
                            color: patient.oxygen_level < 90 ? 'var(--danger)' : 
                                   patient.oxygen_level < 95 ? 'var(--warning)' : 'var(--success)',
                            fontFamily: 'var(--font-display)'
                          }}>
                            {patient.oxygen_level || '--'}{patient.oxygen_level && <span style={{ fontSize: '10px', color: 'var(--text-2)' }}>%</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: 'var(--s-4)' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>group</span>
                    <p style={{ fontSize: 'var(--fs-caption)', margin: 'var(--s-2) 0 0 0' }}>No patients available</p>
                  </div>
                )}
              </div>
              {patients && patients.length > 8 && (
                <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 'var(--fs-caption)' }}>+{patients.length - 8} more patients</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCenter;