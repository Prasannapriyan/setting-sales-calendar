import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Predefined list of setters
const SETTERS = [
  'Vigneshwar',
  'Vicky',
  'Hemaanth',
  'Kumaran',
  'Sethu',
  'Prasanna'
];

const PITCH_TYPES = [
  { value: '5k_pitched', label: '5K Pitch' },
  { value: '20k_pitched', label: '20K Pitch' }
];

const AppointmentForm = ({ onClose, onSubmit, salesPerson, time, isUnavailable }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    setterName: '',
    pitchType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      salesPerson, 
      time,
      initialPitchType: formData.pitchType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Book Appointment
          {isUnavailable && (
            <span className="text-sm text-red-500 block">
              Note: This slot is normally unavailable
            </span>
          )}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Client Information */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block mb-2">Name *</label>
              <input
                required
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Phone *</label>
              <input
                required
                type="tel"
                className="w-full border p-2 rounded"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Notes</label>
              <textarea
                className="w-full border p-2 rounded"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Setter Information */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-3 border-b pb-1">Setter Data</div>
            
            <div className="mb-4">
              <label className="block mb-2">Setter Name *</label>
              <select
                required
                className="w-full border p-2 rounded"
                value={formData.setterName}
                onChange={e => setFormData(prev => ({ ...prev, setterName: e.target.value }))}
              >
                <option value="">Select Setter</option>
                {SETTERS.map(setter => (
                  <option key={setter} value={setter}>{setter}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Pitch Type *</label>
              <select
                required
                className="w-full border p-2 rounded"
                value={formData.pitchType}
                onChange={e => setFormData(prev => ({ ...prev, pitchType: e.target.value }))}
              >
                <option value="">Select Pitch Type</option>
                {PITCH_TYPES.map(pitch => (
                  <option key={pitch.value} value={pitch.value}>{pitch.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AppointmentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  salesPerson: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isUnavailable: PropTypes.bool
};

export default AppointmentForm;