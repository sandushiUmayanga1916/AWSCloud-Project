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
      <div style={{ padding: '40px', color: '#fff' }}>
        <h1>Patients</h1>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Patients ({patients?.length || 0})</h1>
          <p style={{ color: 'black', margin: 0 }}>Manage patient records and monitor vitals</p>
        </div>
        <button 
          onClick={showForm ? () => setShowForm(false) : handleAddPatient} 
          style={{
            background: showForm ? '#4B7BE5' : '#28C76F',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            gap: '8px'
          }}
        >
          <span className="material-symbols-rounded">{showForm ? 'list' : 'person_add'}</span>
          {showForm ? 'View Patient List' : 'Add New Patient'}
        </button>
      </div>

      {/* Empty State */}
      {!patients || patients.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', color: '#ccc' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '48px', color: '#28C76F' }}>group</span>
          <h3>No Patients Found</h3>
          <p>Start by adding your first patient to begin monitoring</p>
          <button 
            onClick={handleAddPatient}
            style={{
              background: '#28C76F',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-rounded">person_add</span>
            Add Your First Patient
          </button>
        </div>
      ) : (
        <>
          {showForm ? (
            <PatientForm
              patient={editingPatient}
              onSave={handleSavePatient}
              onCancel={handleCancelForm}
              isEditing={!!editingPatient}
              inline={true}
            />
          ) : (
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {patients.map(patient => (
                <div key={patient.patient_id} style={{
                  background: '#014F36',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, color: '#fff' }}>{patient.name}</h3>
                      <span className={`badge badge--${patient.connection_status.toLowerCase() === 'online' ? 'success' : 'danger'}`}>
                        {patient.connection_status}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0', color: '#ccc', fontSize: '14px' }}>ID: {patient.patient_id}</p>
                    <p style={{ margin: '4px 0', color: '#ccc', fontSize: '14px' }}>Age: {patient.age}, Gender: {patient.gender}</p>
                    <p style={{ margin: '4px 0', color: '#ccc', fontSize: '14px' }}>Conditions: {patient.medical_conditions || 'None'}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div>
                      <p style={{ margin: '2px 0', fontWeight: '600', color: patient.heart_rate > 100 ? '#FF4C4C' : patient.heart_rate < 60 ? '#FFA500' : '#28C76F' }}>
                        HR: {patient.heart_rate || '--'} bpm
                      </p>
                      <p style={{ margin: '2px 0', fontWeight: '600', color: patient.oxygen_level < 90 ? '#FF4C4C' : patient.oxygen_level < 95 ? '#FFA500' : '#28C76F' }}>
                        O₂: {patient.oxygen_level || '--'} %
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditPatient(patient)} style={{
                        background: 'rgba(95, 114, 144, 0.1)',
                        border: '1px solid rgba(95, 114, 144, 0.2)',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer'
                      }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '16px', color: '#fff' }}>edit</span>
                      </button>
                      <button onClick={() => handleDeletePatient(patient)} style={{
                        background: 'rgba(211, 107, 107, 0.1)',
                        border: '1px solid rgba(211, 107, 107, 0.2)',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer'
                      }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '16px', color: '#FF4C4C' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: '#014F36', borderRadius: '16px', padding: '24px', width: '400px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#FF4C4C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-rounded">warning</span>
                Confirm Delete
              </h3>
              <button onClick={() => setDeleteConfirm(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <p style={{ marginTop: '16px' }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong> (ID: {deleteConfirm.patient_id})?
            </p>
            <p style={{ color: '#FFA500', fontSize: '14px' }}>This will permanently delete all associated telemetry data and alerts.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ background: '#ccc', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ background: '#FF4C4C', border: 'none', borderRadius: '8px', padding: '8px 12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-rounded">delete_forever</span>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsView;
