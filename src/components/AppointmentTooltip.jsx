import React from 'react';
import PropTypes from 'prop-types';
import { getStatusDisplay } from './calendar-utils';
import { format } from 'date-fns';

const AppointmentTooltip = ({ appointment, position }) => (
  <div
    className="absolute bg-white shadow-lg p-4 rounded z-50 w-72"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`
    }}
  >
    {/* Client Information */}
    <div className="mb-4">
      <div className="text-sm font-semibold text-gray-500 mb-2">Client Information</div>
      <h3 className="font-bold">{appointment.name}</h3>
      <p className="text-sm">
        <span className="font-medium">Phone:</span> {appointment.phone}
      </p>
      {appointment.notes && (
        <p className="text-sm">
          <span className="font-medium">Notes:</span> {appointment.notes}
        </p>
      )}
    </div>
    
    {/* Setter Information */}
    <div className="mb-4">
      <div className="text-sm font-semibold text-gray-500 mb-2 border-b pb-1">Setter Data</div>
      <p className="text-sm">
        <span className="font-medium">Setter:</span> {appointment.setterName}
      </p>
      <p className="text-sm">
        <span className="font-medium">Initial Pitch:</span>{' '}
        {getStatusDisplay(appointment.initialPitchType)}
      </p>
    </div>

    {/* Sales Information */}
    <div>
      <div className="text-sm font-semibold text-gray-500 mb-2 border-b pb-1">Sales Data</div>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">Status:</span>{' '}
          {getStatusDisplay(appointment.status)}
        </p>
        
        <p className="text-sm">
          <span className="font-medium">Time:</span>{' '}
          {format(new Date(`2024-01-01 ${appointment.time}`), 'hh:mm aa')}
        </p>
        
        <p className="text-sm">
          <span className="font-medium">Sales Person:</span>{' '}
          {appointment.salesPerson}
        </p>
        
        {appointment.callLaterDateTime && (
          <p className="text-sm">
            <span className="font-medium">Call Back:</span>{' '}
            {format(new Date(appointment.callLaterDateTime), 'dd/MM/yyyy hh:mm aa')}
          </p>
        )}
        
        {appointment.callNotes && (
          <p className="text-sm">
            <span className="font-medium">Call Notes:</span>{' '}
            {appointment.callNotes}
          </p>
        )}
        
        {(appointment.status === 'paid' && appointment.pitchedType) && (
          <p className="text-sm">
            <span className="font-medium">Final Pitch:</span>{' '}
            {getStatusDisplay(appointment.pitchedType)}
          </p>
        )}

        {appointment.paymentType && (
          <p className="text-sm">
            <span className="font-medium">Payment:</span>{' '}
            {appointment.paymentType}
          </p>
        )}
      </div>
    </div>
  </div>
);

AppointmentTooltip.propTypes = {
  appointment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    notes: PropTypes.string,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    salesPerson: PropTypes.string.isRequired,
    setterName: PropTypes.string.isRequired,
    initialPitchType: PropTypes.string.isRequired,
    callLaterDateTime: PropTypes.string,
    callNotes: PropTypes.string,
    paymentType: PropTypes.string,
    pitchedType: PropTypes.string
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired
};

export default AppointmentTooltip;