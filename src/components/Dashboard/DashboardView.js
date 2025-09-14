import React, { useEffect } from 'react';

const DashboardView = ({ stats, alerts, onNavigate, patients }) => {
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

  const totalPatients = patients?.length || 0;
  const activePatients = patients?.filter(p => p.connection_status === 'Online').length || 0;
  const criticalAlertsToday = patients?.filter(p =>
    p.heart_rate < 50 || p.heart_rate > 120 || p.oxygen_level < 90
  ).length || 0;
  const unresolvedAlerts = alerts?.filter(alert => !alert.resolved).length || 0;

  const avgHeartRate = patients?.length
    ? Math.round(patients.reduce((sum, p) => sum + (p.heart_rate || 0), 0) / patients.length)
    : 0;
  const avgOxygenLevel = patients?.length
    ? Math.round(patients.reduce((sum, p) => sum + (p.oxygen_level || 0), 0) / patients.length)
    : 0;

  const kpis = [
    { label: 'Total Patients', value: stats?.total_patients || totalPatients, color: '#28C76F', icon: 'groups', onClick: () => onNavigate && onNavigate('patients') },
    { label: 'Active Now', value: stats?.active_patients || activePatients, color: '#4B7BE5', icon: 'online_prediction', onClick: () => {} },
    { label: 'Critical Alerts', value: stats?.critical_alerts_today || criticalAlertsToday, color: '#FF4C4C', icon: 'warning', onClick: () => onNavigate && onNavigate('alerts') },
    { label: 'Unresolved', value: stats?.unresolved_alerts || unresolvedAlerts, color: '#FFA500', icon: 'report_problem', onClick: () => {} }
  ];

  const vitals = [
    { label: 'Avg Heart Rate', value: stats?.avg_heart_rate_today || avgHeartRate, unit: 'bpm', bg: '#013220', color: '#FF4C4C' },
    { label: 'Avg Oxygen Level', value: stats?.avg_oxygen_level_today || avgOxygenLevel, unit: '%', bg: '#013220', color: '#28C76F' }
  ];

  return (
    <div style={{
      width: '95%',
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px 0',
      fontFamily: 'Arial, sans-serif',
      color: '#fff'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontSize: '36px', margin: 0, color: '#000' }}>Patient Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'black' }}>Real-time hospital monitoring system</p>
      </div>

      {/* Critical Alerts Banner */}
      {(stats?.critical_alerts_today > 0 || criticalAlertsToday > 0) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FF4C4C20',
          border: '1px solid #FF4C4C',
          padding: '16px 24px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-rounded" style={{ color: '#FF4C4C', fontSize: '32px' }}>warning</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#FF4C4C' }}>Critical Alerts</h3>
              <p style={{ margin: 0, color: '#FF4C4C' }}>
                {stats?.critical_alerts_today || criticalAlertsToday} critical alert(s) require attention
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('alerts')}
            style={{
              background: '#FF4C4C',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Review&nbsp;<span className="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {kpis.map((kpi, i) => (
          <div key={i} onClick={kpi.onClick} style={{
            cursor: 'pointer',
            padding: '24px',
            borderRadius: '16px',
            background: '#014F36',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'}}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-rounded" style={{ color: kpi.color, fontSize: '28px' }}>{kpi.icon}</span>
              <div style={{ fontSize: '14px', color: '#ccc' }}>{kpi.label}</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Vitals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginTop: '20px'
      }}>
        {vitals.map((v, i) => (
          <div key={i} style={{
            borderRadius: '20px',
            padding: '32px',
            background: v.bg,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 28px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '16px', color: '#ccc' }}>{v.label}</div>
            <div style={{ fontSize: '56px', fontWeight: 700, color: v.color }}>
              {v.value} <span style={{ fontSize: '18px', color: '#aaa' }}>{v.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
