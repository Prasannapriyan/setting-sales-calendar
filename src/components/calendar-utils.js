// Previous imports remain the same
import { format } from 'date-fns';

export const SETTERS = [
  'Vigneshwar',
  'Vicky',
  'Hemaanth',
  'Kumaran',
  'Sethu',
  'Prasanna'
];

// ... other utility functions remain the same ...
export const getStatusDisplay = (status) => {
  const display = {
    'picked': 'Picked',
    'didnt_pick': "Didn't Pick",
    'call_later': 'Call Later',
    'will_join_later': 'Will Join Later',
    'ghosted': 'Ghosted',
    '5k_pitched': '5K Pitched',
    '20k_pitched': '20K Pitched',
    'booked': 'Booked',
    'rescheduled': 'Rescheduled',
    'wrongly_qualified': 'Wrongly Qualified',
    'wrong_number': 'Wrong Number',
    'paid': 'Paid'
  };
  return display[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    'picked': 'bg-purple-500',
    'didnt_pick': 'bg-red-500',
    'call_later': 'bg-blue-500',
    'will_join_later': 'bg-pink-500',
    'ghosted': 'bg-indigo-500',
    '5k_pitched': 'bg-cyan-500',
    '20k_pitched': 'bg-teal-500',
    'booked': 'bg-orange-400',
    'rescheduled': 'bg-amber-500',
    'wrongly_qualified': 'bg-red-300',
    'wrong_number': 'bg-gray-500',
    'paid': 'bg-green-500'
  };
  return colors[status] || 'bg-gray-400';
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return format(date, 'hh:mm aa');
};

export const createTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 21; hour++) {
    for (let minute of ['00', '30']) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
    }
  }
  return slots;
};

export const countSlotsBetweenTimes = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return Math.floor(totalMinutes / 30);
};

export const calculateSetterStats = (appointments, setter) => {
  const setterAppointments = appointments.filter(app => app.setterName === setter);
  
  return {
    total: setterAppointments.length,
    // Count actual pitch types (including overrides)
    pitch5k: setterAppointments.filter(app => 
      app.status === '5k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '5k_pitched')
    ).length,
    pitch20k: setterAppointments.filter(app => 
      app.status === '20k_pitched' || 
      (app.status === 'paid' && app.pitchedType === '20k_pitched')
    ).length,
    // Initial pitch types set by setter
    initialPitch5k: setterAppointments.filter(app => app.initialPitchType === '5k_pitched').length,
    initialPitch20k: setterAppointments.filter(app => app.initialPitchType === '20k_pitched').length,
    // Other stats
    converted: setterAppointments.filter(app => app.status === 'paid').length,
    converted5k: setterAppointments.filter(app => 
      app.status === 'paid' && 
      app.pitchedType === '5k_pitched' &&
      app.initialPitchType === '5k_pitched'
    ).length,
    converted20k: setterAppointments.filter(app => 
      app.status === 'paid' && 
      app.pitchedType === '20k_pitched' &&
      app.initialPitchType === '20k_pitched'
    ).length,
    didntPick: setterAppointments.filter(app => app.status === 'didnt_pick').length,
    wronglyQualified: setterAppointments.filter(app => app.status === 'wrongly_qualified').length
  };
};

export const calculateSalesPersonStats = (appointments, salesPerson, selectedDate) => {
  const personAppointments = appointments.filter(app => 
    app.salesPerson === salesPerson && 
    app.date.toDateString() === selectedDate.toDateString()
  );

  const booked5k = personAppointments.filter(app => app.initialPitchType === '5k_pitched').length;
  const booked20k = personAppointments.filter(app => app.initialPitchType === '20k_pitched').length;

  const totalPitch5k = personAppointments.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const totalPitch20k = personAppointments.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  const payments = personAppointments.reduce((acc, app) => {
    if (app.paymentType) {
      acc[app.paymentType] = (acc[app.paymentType] || 0) + 1;
    }
    return acc;
  }, {});

  return {
    booked5k,
    booked20k,
    totalPitch5k,
    totalPitch20k,
    payments
  };
};

export const calculateStats = (appointments, salesPeople, selectedDate) => {
  const todayAppointments = appointments.filter(
    app => app.date.toDateString() === selectedDate.toDateString()
  );

  const totalSlots = salesPeople.reduce((acc, person) => {
    if (!person.isPresent) return acc;
    const slots = countSlotsBetweenTimes(person.startTime, person.endTime);
    return acc + slots;
  }, 0);

  const paymentValues = {
    '5k': 5000,
    '4k': 4000,
    '1k_deposit': 1000,
    '5k_deposit': 5000,
    '6k_sub': 6000,
    '10k': 10000,
    '10k_2nd': 10000,
    '20k': 20000
  };

  const payments = todayAppointments.reduce((acc, app) => {
    if (app.paymentType) {
      acc[app.paymentType] = (acc[app.paymentType] || 0) + 1;
    }
    return acc;
  }, {});

  const totalRevenue = Object.entries(payments).reduce((total, [type, count]) => {
    return total + (paymentValues[type] * count);
  }, 0);

  // Calculate setter statistics
  const setterStats = {};
  SETTERS.forEach(setter => {
    setterStats[setter] = calculateSetterStats(todayAppointments, setter);
  });

  // Calculate sales person statistics
  const salesPersonStats = {};
  salesPeople.forEach(person => {
    salesPersonStats[person.name] = calculateSalesPersonStats(todayAppointments, person.name, selectedDate);
  });

  // Count pitch types based on final status or overridden type
  const pitched5k = todayAppointments.filter(app => 
    app.status === '5k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '5k_pitched')
  ).length;

  const pitched20k = todayAppointments.filter(app => 
    app.status === '20k_pitched' || 
    (app.status === 'paid' && app.pitchedType === '20k_pitched')
  ).length;

  return {
    available: totalSlots - todayAppointments.length,
    booked: todayAppointments.length,
    picked: todayAppointments.filter(app => app.status === 'picked').length,
    didntPick: todayAppointments.filter(app => app.status === 'didnt_pick').length,
    callLater: todayAppointments.filter(app => app.status === 'call_later').length,
    willJoinLater: todayAppointments.filter(app => app.status === 'will_join_later').length,
    ghosted: todayAppointments.filter(app => app.status === 'ghosted').length,
    pitched5k,
    pitched20k,
    wronglyQualified: todayAppointments.filter(app => app.status === 'wrongly_qualified').length,
    wrongNumber: todayAppointments.filter(app => app.status === 'wrong_number').length,
    paid: todayAppointments.filter(app => app.status === 'paid').length,
    total: totalSlots,
    payments,
    totalRevenue,
    setterStats,
    salesPersonStats
  };
};
