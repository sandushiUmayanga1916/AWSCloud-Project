import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import PatientForm from './PatientForm';
import { createPatient, updatePatient, deletePatient } from '../../services/api';

const PatientsView = ({ patients }) => {
  const { loading, refreshData } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeletePatient = (patient) => {
    setDeleteConfirm(patient);
  };

  const confirmDelete = async () => {
    try {
      await deletePatient(deleteConfirm.patient_id);
      setDeleteConfirm(null);
      refreshData();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error deleting patient: ${error.message}`);
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patient_id, patientData);
      } else {
        await createPatient(patientData);
      }
      setShowForm(false);
      setEditingPatient(null);
      refreshData();
    } catch (error) {
      throw error;
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--s-6) 0' }}>
        <h1>Patients</h1>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`patients-view ${showForm ? 'has-inline-form' : ''}`} style={{ padding: 'var(--s-6) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s-6)' }}>
        <div>
          <h1>Patients ({patients?.length || 0})</h1>
          <p className="text-secondary">Manage patient records and monitor vitals</p>
        </div>
        {showForm ? (
          <button onClick={() => setShowForm(false)} className="btn btn--primary">
            <span className="material-symbols-rounded">list</span>
            View Patient List
          </button>
        ) : (
          <button onClick={handleAddPatient} className="btn btn--success">
            <span className="material-symbols-rounded">person_add</span>
            Add New Patient
          </button>
        )}
      </div>
      
      <div>
        {!patients || patients.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-rounded">group</span>
            <h3>No Patients Found</h3>
            <p>Start by adding your first patient to begin monitoring</p>
            <button onClick={handleAddPatient} className="btn btn--primary">
              <span className="material-symbols-rounded">person_add</span>
              Add Your First Patient
            </button>
          </div>
        ) : (
          <>
            {showForm ? (
              // render the form inline in place of the table
              <PatientForm
                patient={editingPatient}
                onSave={handleSavePatient}
                onCancel={handleCancelForm}
                isEditing={!!editingPatient}
                inline={true}
              />
            ) : (
              <div className="card" style={{ overflow: 'hidden' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Medical Conditions</th>
                      <th>Heart Rate</th>
                      <th>Oxygen Level</th>
                      <th>Last Reading</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.patient_id}>
                        <td style={{ fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--accent)' }}>
                          {patient.patient_id}
                        </td>
                        <td>{patient.name}</td>
                        <td className="numeric">{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.medical_conditions}</td>
                        <td className="numeric" style={{ 
                          color: patient.heart_rate > 100 ? 'var(--danger)' : 
                                 patient.heart_rate < 60 ? 'var(--warning)' : 
                                 'var(--success)'
                        }}>
                          {patient.heart_rate || '--'}
                          {patient.heart_rate && <span style={{ fontSize: '12px', color: 'var(--text-2)', marginLeft: '4px' }}>bpm</span>}
                        </td>
                        <td className="numeric" style={{ 
                          color: patient.oxygen_level < 90 ? 'var(--danger)' : 
                                 patient.oxygen_level < 95 ? 'var(--warning)' : 
                                 'var(--success)'
                        }}>
                          {patient.oxygen_level || '--'}
                          {patient.oxygen_level && <span style={{ fontSize: '12px', color: 'var(--text-2)', marginLeft: '1px' }}>%</span>}
                        </td>
                        <td style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-2)' }}>
                          {patient.last_reading ? new Date(patient.last_reading).toLocaleString() : 'No data'}
                        </td>
                        <td>
                          <span className={`badge badge--${patient.connection_status.toLowerCase() === 'online' ? 'success' : 
                                                            patient.connection_status.toLowerCase() === 'offline' ? 'danger' : 'warning'}`}>
                            {patient.connection_status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--s-1)' }}>
                            <button 
                              onClick={() => handleEditPatient(patient)}
                              className="btn btn--icon"
                              title="Edit Patient"
                              style={{ background: 'rgba(95, 114, 144, 0.1)', border: '1px solid rgba(95, 114, 144, 0.2)' }}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeletePatient(patient)}
                              className="btn btn--icon"
                              title="Delete Patient"
                              style={{ background: 'rgba(211, 107, 107, 0.1)', border: '1px solid rgba(211, 107, 107, 0.2)' }}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'var(--danger)' }}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={handleCancelForm}
          isEditing={!!editingPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ color: 'var(--danger)' }}>
                <span className="material-symbols-rounded" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  warning
                </span>
                Confirm Delete
              </h3>
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="btn btn--icon"
                style={{ background: 'none', border: 'none' }}
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete patient <strong>{deleteConfirm.name}</strong> ({deleteConfirm.patient_id})?
              </p>
              <div className="alert alert--warning" style={{ margin: 'var(--s-4) 0' }}>
                This will permanently delete all associated telemetry data and alerts.
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeleteConfirm(null)} className="btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn--danger">
                <span className="material-symbols-rounded">delete_forever</span>
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsView;