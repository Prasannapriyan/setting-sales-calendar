import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { saveAppointment, deleteAppointment, subscribeToAppointments } from '../firebase';
import { formatTime, createTimeSlots, calculateStats, getStatusDisplay, getStatusColor } from './calendar-utils';
import AppointmentForm from './forms/AppointmentForm';
import StatusForm from './forms/StatusForm';
import AppointmentTooltip from './AppointmentTooltip';
import SetterSummary from './SetterSummary';

const SalesCalendar = () => {
  // Initial sales people with attendance status
  const [salesPeople, setSalesPeople] = useState([
    { name: "Harsha", startTime: "11:00", endTime: "20:00", isPresent: true },
    { name: "Mani", startTime: "11:00", endTime: "19:00", isPresent: true },
    { name: "Monish", startTime: "16:30", endTime: "20:30", isPresent: true },
    { name: "Pranav", startTime: "09:00", endTime: "13:00", isPresent: true },
    { name: "Tamil", startTime: "11:00", endTime: "20:00", isPresent: true }
  ]);

  // State management
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [unavailableSlots, setUnavailableSlots] = useState({});

  // Time slots memoization
  const timeSlots = useMemo(() => createTimeSlots(), []);

  // Firebase subscription
  useEffect(() => {
    const unsubscribe = subscribeToAppointments((updatedAppointments) => {
      setAppointments(updatedAppointments);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Event handlers
  const handleBookAppointment = useCallback(async (formData) => {
    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: 'booked',
      date: new Date(selectedDate)
    };

    try {
      await saveAppointment(newAppointment);
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  }, [selectedDate]);

  const handleUpdateStatus = useCallback(async (appointmentId, updates) => {
    try {
      if (updates.status === null) {
        await deleteAppointment(appointmentId);
      } else {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (appointment) {
          await saveAppointment({
            ...appointment,
            ...updates
          });
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  }, [appointments]);

  const handleReschedule = useCallback(async (newAppointment) => {
    try {
      await saveAppointment({
        ...newAppointment,
        date: new Date(selectedDate)
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  }, [selectedDate]);

  const toggleAttendance = (index) => {
    setSalesPeople(prev => prev.map((person, i) => 
      i === index ? { ...person, isPresent: !person.isPresent } : person
    ));
  };

  const handleSlotClick = (person, time, isUnavailable) => {
    const slotKey = `${person.name}-${time}-${selectedDate.toDateString()}`;
    if (isUnavailable || unavailableSlots[slotKey]) {
      const confirmBook = window.confirm(
        'This slot is marked as unavailable. Would you still like to book it?'
      );
      if (!confirmBook) return;
    }
    setSelectedSlot({ person, time, isUnavailable });
    setShowBookingForm(true);
  };

  const toggleUnavailable = (person, time) => {
    const slotKey = `${person.name}-${time}-${selectedDate.toDateString()}`;
    setUnavailableSlots(prev => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  // Calculate statistics
  const stats = useMemo(() => calculateStats(appointments, salesPeople, selectedDate), 
    [appointments, salesPeople, selectedDate]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Date selector */}
      <div className="mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={e => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      {/* Main booking table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50">Time</th>
              {salesPeople.map((person, index) => (
                <th key={person.name} className="border p-2 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span>{person.name}</span>
                    <input
                      type="checkbox"
                      checked={person.isPresent}
                      onChange={() => toggleAttendance(index)}
                      className="ml-2"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(person.startTime)} - {formatTime(person.endTime)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="border p-2 font-medium">{formatTime(time)}</td>
                {salesPeople.map(person => {
                  const appointment = appointments.find(
                    app => 
                      app.salesPerson === person.name && 
                      app.time === time &&
                      app.date.toDateString() === selectedDate.toDateString()
                  );
                  const slotKey = `${person.name}-${time}-${selectedDate.toDateString()}`;
                  const isTimeAvailable = time >= person.startTime && 
                                        time < person.endTime && 
                                        person.isPresent;

                  return (
                    <td 
                      key={`${person.name}-${time}`} 
                      className="border p-2 text-center relative"
                    >
                      {appointment ? (
                        <button
                          className={`w-full p-2 rounded text-white ${getStatusColor(appointment.status)}`}
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setHoveredAppointment({
                              appointment,
                              position: {
                                x: rect.left,
                                y: rect.bottom + window.scrollY
                              }
                            });
                          }}
                          onMouseLeave={() => setHoveredAppointment(null)}
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowStatusForm(true);
                          }}
                        >
                          {getStatusDisplay(appointment.status)}
                        </button>
                      ) : (
                        <div className="relative">
                          <button
                            className={`w-full p-2 ${
                              isTimeAvailable && !unavailableSlots[slotKey]
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 hover:bg-gray-500'
                            } text-white rounded`}
                            onClick={() => handleSlotClick(person, time, !isTimeAvailable || unavailableSlots[slotKey])}
                          >
                            {isTimeAvailable && !unavailableSlots[slotKey] ? 'Available' : 'Unavailable'}
                          </button>
                          {isTimeAvailable && (
                            <button
              className={`absolute top-0 right-0 -mr-0.5 -mt-0.5 ${
                unavailableSlots[slotKey] 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-black/20 hover:bg-black/30'
              } text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center`}
                              onClick={() => toggleUnavailable(person, time)}
                              title={unavailableSlots[slotKey] ? "Mark as Available" : "Mark as Unavailable"}
                            >
                              {unavailableSlots[slotKey] ? '✓' : '×'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sales Statistics */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h2 className="text-lg font-bold mb-4">Sales Summary</h2>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-green-100 p-3 rounded">
            <div className="text-lg">Available</div>
            <div className="text-2xl font-bold">{stats.available}</div>
          </div>
          <div className="bg-orange-100 p-3 rounded">
            <div className="text-lg">Booked</div>
            <div className="text-2xl font-bold">{stats.booked}</div>
          </div>
          <div className="bg-purple-100 p-3 rounded">
            <div className="text-lg">Picked</div>
            <div className="text-2xl font-bold">{stats.picked}</div>
          </div>
          <div className="bg-red-100 p-3 rounded">
            <div className="text-lg">Didn't Pick</div>
            <div className="text-2xl font-bold">{stats.didntPick}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <div className="text-lg">Call Later</div>
            <div className="text-2xl font-bold">{stats.callLater}</div>
          </div>
          <div className="bg-green-100 p-3 rounded">
            <div className="text-lg">Paid</div>
            <div className="text-2xl font-bold">{stats.paid}</div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mt-4">
          <div className="bg-pink-100 p-3 rounded">
            <div className="text-lg">Will Join Later</div>
            <div className="text-2xl font-bold">{stats.willJoinLater}</div>
          </div>
          <div className="bg-indigo-100 p-3 rounded">
            <div className="text-lg">Ghosted</div>
            <div className="text-2xl font-bold">{stats.ghosted}</div>
          </div>
          <div className="bg-cyan-100 p-3 rounded">
            <div className="text-lg">5K Pitched</div>
            <div className="text-2xl font-bold">{stats.pitched5k}</div>
          </div>
          <div className="bg-teal-100 p-3 rounded">
            <div className="text-lg">20K Pitched</div>
            <div className="text-2xl font-bold">{stats.pitched20k}</div>
          </div>
          <div className="bg-red-100 p-3 rounded">
            <div className="text-lg">Wrong Qual.</div>
            <div className="text-2xl font-bold">{stats.wronglyQualified}</div>
          </div>
          <div className="bg-gray-200 p-3 rounded">
            <div className="text-lg">Wrong Num.</div>
            <div className="text-2xl font-bold">{stats.wrongNumber}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Payment Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">5K</div>
              <div className="text-xl font-bold">{stats.payments['5k'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">4K</div>
              <div className="text-xl font-bold">{stats.payments['4k'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">1000 Deposit</div>
              <div className="text-xl font-bold">{stats.payments['1k_deposit'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">5000 Deposit</div>
              <div className="text-xl font-bold">{stats.payments['5k_deposit'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">6000 Sub</div>
              <div className="text-xl font-bold">{stats.payments['6k_sub'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">10K</div>
              <div className="text-xl font-bold">{stats.payments['10k'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">10K 2nd Ins</div>
              <div className="text-xl font-bold">{stats.payments['10k_2nd'] || 0}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg">20K</div>
              <div className="text-xl font-bold">{stats.payments['20k'] || 0}</div>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <div className="text-lg">Total Revenue</div>
              <div className="text-xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Setter Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <SetterSummary setterStats={stats.setterStats} />
      </div>

      {/* Forms */}
      {showBookingForm && selectedSlot && (
        <AppointmentForm
          salesPerson={selectedSlot.person.name}
          time={selectedSlot.time}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookAppointment}
          isUnavailable={selectedSlot.isUnavailable}
        />
      )}

      {showStatusForm && selectedAppointment && (
        <StatusForm
          appointment={selectedAppointment}
          onClose={() => {
            setShowStatusForm(false);
            setSelectedAppointment(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          onReschedule={handleReschedule}
          salesPeople={salesPeople}
        />
      )}

      {/* Tooltip */}
      {hoveredAppointment && (
        <AppointmentTooltip
          appointment={hoveredAppointment.appointment}
          position={hoveredAppointment.position}
        />
      )}
    </div>
  );
};

export default SalesCalendar;
