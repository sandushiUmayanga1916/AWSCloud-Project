import React from 'react';
import TelemetryForm from './TelemetryForm';

const TestCenter = ({ patients }) => {
  return (
    <div style={{ padding: 'var(--s-6) 0' }}>
      <div style={{ marginBottom: 'var(--s-6)' }}>
        <h1>Test Center</h1>
        <p className="text-secondary">Simulate live telemetry data from wearable health devices</p>
      </div>
      
      <div className="grid grid--auto" style={{ marginBottom: 'var(--s-6)' }}>
        <div className="col-8">
          <div className="card" style={{ padding: 'var(--s-5)' }}>
            <div className="alert alert--info" style={{ marginBottom: 'var(--s-4)' }}>
              <span className="material-symbols-rounded" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                info
              </span>
              Critical values will automatically trigger email alerts through AWS SNS
            </div>
            <TelemetryForm />
          </div>
        </div>
        
        <div className="col-4">
          <div className="card" style={{ padding: 'var(--s-5)' }}>
            <h3 style={{ marginBottom: 'var(--s-4)' }}>
              <span className="material-symbols-rounded" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                monitor_heart
              </span>
              Live Monitoring
            </h3>
            <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
              {patients && patients.length > 0 ? (
                patients.slice(0, 3).map(patient => (
                  <div key={patient.patient_id} style={{
                    padding: 'var(--s-3)',
                    background: 'var(--bg-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-2)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--accent)' }}>
                        {patient.patient_id}
                      </span>
                      <span className={`badge badge--${
                        patient.connection_status.toLowerCase() === 'online' ? 'success' : 
                        patient.connection_status.toLowerCase() === 'offline' ? 'danger' : 'warning'
                      }`} style={{ fontSize: 'var(--fs-micro)' }}>
                        {patient.connection_status}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-1)', marginBottom: 'var(--s-2)' }}>
                      {patient.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-2)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div className="kpi__label">HR</div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: patient.heart_rate > 100 ? 'var(--danger)' : 
                                 patient.heart_rate < 60 ? 'var(--warning)' : 'var(--success)',
                          fontFamily: 'var(--font-display)',
                          marginTop: '2px'
                        }}>
                          {patient.heart_rate || '--'}
                          {patient.heart_rate && <span style={{ fontSize: '10px', color: 'var(--text-2)' }}>bpm</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div className="kpi__label">O₂</div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: patient.oxygen_level < 90 ? 'var(--danger)' : 
                                 patient.oxygen_level < 95 ? 'var(--warning)' : 'var(--success)',
                          fontFamily: 'var(--font-display)',
                          marginTop: '2px'
                        }}>
                          {patient.oxygen_level || '--'}
                          {patient.oxygen_level && <span style={{ fontSize: '10px', color: 'var(--text-2)' }}>%</span>}
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
              {patients && patients.length > 3 && (
                <div style={{ 
                  padding: 'var(--s-2)', 
                  textAlign: 'center', 
                  fontSize: 'var(--fs-caption)', 
                  color: 'var(--text-2)' 
                }}>
                  +{patients.length - 3} more patients
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCenter;