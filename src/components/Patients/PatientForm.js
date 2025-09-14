import React, { useState, useEffect } from 'react';

const PatientForm = ({ patient, onSave, onCancel, isEditing = false, inline = false }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    name: '',
    age: '',
    gender: '',
    medical_conditions: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patient && isEditing) {
      setFormData({
        patient_id: patient.patient_id,
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        medical_conditions: patient.medical_conditions || ''
      });
    }
  }, [patient, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSave({
        ...formData,
        age: parseInt(formData.age)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formStyles = {
    background: '#014F36',
    color: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    width: inline ? '100%' : '400px',
    maxWidth: '100%'
  };

  const inputStyles = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #28C76F',
    marginTop: '6px',
    background: '#013220',
    color: '#fff'
  };

  const labelStyles = { marginTop: '12px', display: 'block', fontWeight: '600' };

  const buttonStyles = (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600
  });

  const content = (
    <form onSubmit={handleSubmit}>
      {!isEditing && (
        <div style={labelStyles}>
          <label htmlFor="patient_id">Patient ID *</label>
          <input
            style={inputStyles}
            type="text"
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            placeholder="e.g., P006"
            pattern="P[0-9]{3,}"
            title="Patient ID must start with 'P' followed by numbers"
          />
        </div>
      )}

      <div style={labelStyles}>
        <label htmlFor="name">Full Name *</label>
        <input
          style={inputStyles}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., John Smith"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="age">Age *</label>
          <input
            style={inputStyles}
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            max="120"
            placeholder="e.g., 45"
          />
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="gender">Gender *</label>
          <select
            style={inputStyles}
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={labelStyles}>
        <label htmlFor="medical_conditions">Medical Conditions</label>
        <textarea
          style={{ ...inputStyles, resize: 'vertical' }}
          id="medical_conditions"
          name="medical_conditions"
          value={formData.medical_conditions}
          onChange={handleChange}
          placeholder="e.g., Hypertension, Diabetes"
          rows="3"
        />
        <small style={{ color: '#ccc' }}>Separate multiple conditions with commas</small>
      </div>

      {error && (
        <div style={{ marginTop: '12px', color: '#FF4C4C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-rounded">error</span>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button type="button" style={buttonStyles('#ccc')} onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" style={buttonStyles('#28C76F')} disabled={submitting}>
          <span className="material-symbols-rounded">{isEditing ? 'save' : 'person_add'}</span>
          {submitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>
    </form>
  );

  if (inline) {
    return <div style={formStyles}>{content}</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={formStyles}>{content}</div>
    </div>
  );
};

export default PatientForm;
