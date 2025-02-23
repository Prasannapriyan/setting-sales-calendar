import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getStatusDisplay } from '../calendar-utils';
import RescheduleForm from './RescheduleForm';
import { format } from 'date-fns';

const StatusForm = ({ appointment, onClose, onUpdateStatus, onReschedule, salesPeople }) => {
  const [status, setStatus] = useState(appointment.status || 'booked');
  const [callLaterDateTime, setCallLaterDateTime] = useState(appointment.callLaterDateTime || '');
  const [callNotes, setCallNotes] = useState(appointment.callNotes || '');
  const [paymentType, setPaymentType] = useState(appointment.paymentType || '');
  const [pitchedType, setPitchedType] = useState(appointment.pitchedType || '5k_pitched');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'rescheduled') {
      setShowRescheduleForm(true);
      return;
    }

    const updates = {
      status,
      callLaterDateTime: status === 'call_later' ? callLaterDateTime : null,
      callNotes: ['5k_pitched', '20k_pitched'].includes(status) ? callNotes : null,
      paymentType: status === 'paid' ? paymentType : null,
      pitchedType: ['5k_pitched', '20k_pitched'].includes(status) ? status :
                   status === 'paid' ? pitchedType : null
    };
    onUpdateStatus(appointment.id, updates);
    onClose();
  };

  const handleClear = () => {
    onUpdateStatus(appointment.id, {
      status: null,
      callLaterDateTime: null,
      callNotes: null,
      paymentType: null,
      pitchedType: null
    });
    onClose();
  };

  if (showRescheduleForm) {
    return (
      <RescheduleForm
        appointment={appointment}
        onClose={() => setShowRescheduleForm(false)}
        onReschedule={(newAppointment) => {
          onUpdateStatus(appointment.id, { status: 'rescheduled' });
          onReschedule(newAppointment);
          onClose();
        }}
        salesPeople={salesPeople}
      />
    );
  }

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Appointment Status</h2>
        <form onSubmit={handleSubmit}>
          {/* Client Information */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-3">Client Information</div>
            <div className="mb-2">
              <span className="font-medium">Name:</span> {appointment.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Phone:</span> {appointment.phone}
            </div>
            {appointment.notes && (
              <div className="mb-2">
                <span className="font-medium">Notes:</span> {appointment.notes}
              </div>
            )}
          </div>

          {/* Setter Information */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-3 border-b pb-1">Setter Data</div>
            <div className="mb-2">
              <span className="font-medium">Setter:</span> {appointment.setterName}
            </div>
            <div className="mb-2">
              <span className="font-medium">Initial Pitch:</span> {getStatusDisplay(appointment.initialPitchType)}
            </div>
          </div>

          {/* Sales Information */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-3 border-b pb-1">Sales Data</div>
            
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                className="w-full border p-2 rounded"
                value={status}
                onChange={e => {
                  const newStatus = e.target.value;
                  setStatus(newStatus);
                  setCallNotes('');
                  setPaymentType('');
                  if (!['5k_pitched', '20k_pitched', 'paid'].includes(newStatus)) {
                    setPitchedType('5k_pitched');
                  }
                }}
              >
                <option value="booked">Booked</option>
                <option value="5k_pitched">5K Pitched</option>
                <option value="20k_pitched">20K Pitched</option>
                <option value="picked">Picked</option>
                <option value="didnt_pick">Didn't Pick</option>
                <option value="will_join_later">Will Join Later</option>
                <option value="ghosted">Ghosted</option>
                <option value="call_later">Call Later</option>
                <option value="rescheduled">Reschedule</option>
                <option value="wrongly_qualified">Wrongly Qualified</option>
                <option value="wrong_number">Wrong Number</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {status === 'call_later' && (
              <div className="mb-4">
                <label className="block mb-2">Call Back Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded"
                  value={formatDateTime(callLaterDateTime)}
                  onChange={e => setCallLaterDateTime(new Date(e.target.value).toISOString())}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  Current selected time: {callLaterDateTime ? 
                    format(new Date(callLaterDateTime), 'dd/MM/yyyy hh:mm aa') : 
                    'Not set'}
                </div>
              </div>
            )}

            {['5k_pitched', '20k_pitched'].includes(status) && (
              <div className="mb-4">
                <label className="block mb-2">Call Notes</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  required
                  placeholder="Enter feedback about the call..."
                  rows={4}
                />
              </div>
            )}

            {status === 'paid' && (
              <>
                <div className="mb-4">
                  <label className="block mb-2">Pitched Type</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={pitchedType}
                    onChange={e => setPitchedType(e.target.value)}
                    required
                  >
                    <option value="5k_pitched">5K Pitched</option>
                    <option value="20k_pitched">20K Pitched</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Payment Type</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={paymentType}
                    onChange={e => setPaymentType(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Type</option>
                    <option value="5k">5K</option>
                    <option value="4k">4K</option>
                    <option value="1k_deposit">1000 Deposit</option>
                    <option value="20k">20K</option>
                    <option value="10k">10K</option>
                    <option value="10k_2nd">10K 2nd Ins</option>
                    <option value="6k_sub">6000 Sub</option>
                    <option value="5k_deposit">5000 Deposit</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
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
              {status === 'rescheduled' ? 'Next' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

StatusForm.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    notes: PropTypes.string,
    setterName: PropTypes.string.isRequired,
    initialPitchType: PropTypes.string.isRequired,
    status: PropTypes.string,
    callLaterDateTime: PropTypes.string,
    callNotes: PropTypes.string,
    paymentType: PropTypes.string,
    pitchedType: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
  salesPeople: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isPresent: PropTypes.bool.isRequired
  })).isRequired
};

export default StatusForm;