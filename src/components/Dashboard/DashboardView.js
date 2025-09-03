import React, { useEffect } from 'react';

const DashboardView = ({ stats, alerts, onNavigate, patients }) => {
  // Prevent page-level scrolling while this view is mounted
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow || '';
      document.documentElement.style.overflow = prevHtmlOverflow || '';
    };
  }, []);
  // Calculate stats from patients data as fallback
  const totalPatients = patients?.length || 0;
  const activePatients = patients?.filter(p => p.connection_status === 'Online').length || 0;
  const criticalAlertsToday = patients?.filter(p => 
    p.heart_rate < 50 || p.heart_rate > 120 || p.oxygen_level < 90
  ).length || 0;
  const unresolvedAlerts = alerts?.filter(alert => !alert.resolved).length || 0;
  
  const avgHeartRate = patients?.length > 0 
    ? Math.round(patients.reduce((sum, p) => sum + (p.heart_rate || 0), 0) / patients.length)
    : 0;
  const avgOxygenLevel = patients?.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + (p.oxygen_level || 0), 0) / patients.length)
    : 0;

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      

      {/* Centered content area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--s-5)',
        flexGrow: 1,
        width: '100%',
        overflow: 'hidden'
      }}>

        {/* Header (top-left) */}
      <div style={{ marginBottom: 'var(--s-5)', alignSelf: 'flex-start' }}>
        <h1 style={{ textAlign: 'left', fontSize: '28px', margin: 0 }}>Dashboard Overview</h1>
        <p className="text-secondary" style={{ textAlign: 'left', fontSize: '14px' }}>Real-time patient monitoring system status</p>
      </div>

        {/* Critical Alerts Banner - Only show when there are critical alerts */}
        {(stats?.critical_alerts_today > 0 || criticalAlertsToday > 0) && (
          <div className="card" style={{ 
            padding: 'var(--s-4)', 
            background: 'rgba(73, 24, 24, 0.12)',
            border: '1px solid rgba(137, 56, 56, 0.35)',
            borderRadius: 'var(--radius-card)',
            height: '78px',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-symbols-rounded" style={{ marginRight: '16px', color: 'var(--danger)', fontSize: '28px' }}>
                  warning
                </span>
                <div>
                  <h3 style={{ color: 'var(--danger)', margin: 0, fontSize: '18px' }}>
                    Critical Alerts Today
                  </h3>
                  <p style={{ color: 'var(--danger)', margin: 0, fontSize: '15px' }}>
                    {stats?.critical_alerts_today || criticalAlertsToday} critical alert(s) require immediate attention
                  </p>
                </div>
              </div>
              <button 
                className="btn btn--danger"
                onClick={() => onNavigate && onNavigate('alerts')}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              >
                <span className="material-symbols-rounded">arrow_forward</span>
                &nbsp;Review Alerts
              </button>
            </div>
          </div>
        )}

        {/* Main KPI Grid - scaled up */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 'var(--s-4)', 
          width: '100%',
          alignItems: 'stretch'
        }}>
          <div className="card card--kpi" onClick={() => onNavigate && onNavigate('patients')} style={{ cursor: 'pointer', padding: '20px' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ fontSize: '14px', marginBottom: '8px' }}>Total Patients</div>
              <div className="kpi__value" style={{ fontSize: '32px', fontWeight: 600 }}>{stats?.total_patients || totalPatients}</div>
            </div>
          </div>
          <div className="card card--kpi" style={{ padding: '20px' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ fontSize: '14px', marginBottom: '8px' }}>Active Now</div>
              <div className="kpi__value" style={{ color: 'var(--success)', fontSize: '32px', fontWeight: 600 }}>{stats?.active_patients || activePatients}</div>
            </div>
          </div>
          <div className="card card--kpi" onClick={() => onNavigate && onNavigate('alerts')} style={{ cursor: 'pointer', padding: '20px' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ fontSize: '14px', marginBottom: '8px' }}>Critical Alerts</div>
              <div className="kpi__value" style={{ color: 'var(--danger)', fontSize: '32px', fontWeight: 600 }}>{stats?.critical_alerts_today || criticalAlertsToday}</div>
            </div>
          </div>
          <div className="card card--kpi" style={{ padding: '20px' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ fontSize: '14px', marginBottom: '8px' }}>Unresolved</div>
              <div className="kpi__value" style={{ color: 'var(--warning)', fontSize: '32px', fontWeight: 600 }}>{stats?.unresolved_alerts || unresolvedAlerts}</div>
            </div>
          </div>
        </div>

        {/* Vitals Row - removed Quick Actions; avg cards left-aligned and larger */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 'var(--s-4)', 
          width: '100%',
          marginBottom: 'var(--s-8)'
        }}>
          <div className="card card--kpi" style={{ padding: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ marginBottom: '12px', fontSize: '15px' }}>Avg Heart Rate Today</div>
              <div className="kpi__value" style={{ color: 'var(--text-0)', fontSize: '56px', fontWeight: 700, lineHeight: 1 }}>
                {stats?.avg_heart_rate_today || avgHeartRate}
                <span style={{ fontSize: '18px', color: 'var(--text-2)', marginLeft: '10px' }}>bpm</span>
              </div>
            </div>
          </div>

          <div className="card card--kpi" style={{ padding: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="kpi" style={{ textAlign: 'left' }}>
              <div className="kpi__label" style={{ marginBottom: '12px', fontSize: '15px' }}>Avg Oxygen Level Today</div>
              <div className="kpi__value" style={{ color: 'var(--success)', fontSize: '56px', fontWeight: 700, lineHeight: 1 }}>
                {stats?.avg_oxygen_level_today || avgOxygenLevel}
                <span style={{ fontSize: '18px', color: 'var(--text-2)', marginLeft: '10px' }}>%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;