import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatTime, createTimeSlots } from '../calendar-utils';

const RescheduleForm = ({ appointment, onClose, onReschedule, salesPeople }) => {
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const timeSlots = useMemo(() => createTimeSlots(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      ...appointment,
      salesPerson: selectedSalesPerson,
      time: selectedTime,
      status: 'booked',
      id: Date.now()
    };
    onReschedule(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Sales Person</label>
            <select
              required
              className="w-full border p-2 rounded"
              value={selectedSalesPerson}
              onChange={e => setSelectedSalesPerson(e.target.value)}
            >
              <option value="">Select Sales Person</option>
              {salesPeople.map(person => (
                <option key={person.name} value={person.name}>
                  {person.name} ({formatTime(person.startTime)} - {formatTime(person.endTime)})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Time</label>
            <select
              required
              className="w-full border p-2 rounded"
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{formatTime(time)}</option>
              ))}
            </select>
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RescheduleForm.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string,
    status: PropTypes.string,
    callLaterDateTime: PropTypes.string,
    callNotes: PropTypes.string,
    paymentType: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
  salesPeople: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isPresent: PropTypes.bool.isRequired
  })).isRequired
};

export default RescheduleForm;
