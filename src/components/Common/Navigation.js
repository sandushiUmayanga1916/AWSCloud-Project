import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <nav className="navigation">
      <ul>
        <li>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => handleTabClick('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'patients' ? 'active' : ''}
            onClick={() => handleTabClick('patients')}
          >
            Patients Details
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'alerts' ? 'active' : ''}
            onClick={() => handleTabClick('alerts')}
          >
            Patients Alerts
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'test' ? 'active' : ''}
            onClick={() => handleTabClick('test')}
          >
            Testing
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
