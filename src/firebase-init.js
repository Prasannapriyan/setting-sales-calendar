import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  update, 
  remove, 
  onValue, 
  set, 
  get,
  connectDatabaseEmulator,
  enableIndexedDbPersistence 
} from 'firebase/database';
import { getPerformance } from 'firebase/performance';

let app;
let database;
let performance;

try {
  console.log('Initializing Firebase...');
  
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
  };

  // Log config presence in development
  if (import.meta.env.DEV) {
    Object.entries(firebaseConfig).forEach(([key, value]) => {
      console.log(`${key}: ${value ? '[PRESENT]' : '[MISSING]'}`);
    });
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);

  // Initialize Performance Monitoring in production
  if (import.meta.env.PROD) {
    performance = getPerformance(app);
  }

  // Use emulator in development
  if (import.meta.env.DEV) {
    connectDatabaseEmulator(database, 'localhost', 9000);
    console.log('Connected to Firebase emulator');
  } else {
    // Enable offline persistence in production
    enableIndexedDbPersistence(database).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, offline persistence unavailable');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support offline persistence');
      }
    });
  }

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error('Failed to initialize Firebase. Check your configuration.');
}

// Validate database connection
const validateDatabaseConnection = async () => {
  try {
    const testRef = ref(database, '.info/connected');
    await get(testRef);
    console.log('Database connection validated');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Appointments functions
export const saveAppointment = async (appointment) => {
  try {
    console.log('Saving appointment:', { ...appointment, id: appointment.id || 'new' });
    if (appointment.id) {
      const updates = {};
      updates[`/appointments/${appointment.id}`] = appointment;
      await update(ref(database), updates);
      console.log('Updated existing appointment:', appointment.id);
    } else {
      const result = await push(ref(database, 'appointments'), appointment);
      console.log('Created new appointment:', result.key);
    }
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    console.log('Deleting appointment:', appointmentId);
    await remove(ref(database, `appointments/${appointmentId}`));
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

export const subscribeToAppointments = (callback) => {
  try {
    console.log('Setting up appointments subscription');
    const appointmentsRef = ref(database, 'appointments');
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const appointments = [];
      snapshot.forEach((childSnapshot) => {
        const appointment = childSnapshot.val();
        appointment.id = childSnapshot.key;
        // Convert date string to Date object
        appointment.date = new Date(appointment.date);
        appointments.push(appointment);
      });
      console.log('Received appointments update:', appointments.length, 'appointments');
      callback(appointments);
    }, (error) => {
      console.error('Error in appointments subscription:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up appointments subscription:', error);
    return () => {};
  }
};

// Sales People Attendance functions
export const saveSalesPeopleStatus = async (salesPeople) => {
  try {
    console.log('Saving sales people status:', salesPeople.length, 'people');
    await set(ref(database, 'salesPeople'), salesPeople);
    console.log('Sales people status saved successfully');
  } catch (error) {
    console.error('Error saving sales people status:', error);
    throw error;
  }
};

export const getSalesPeopleStatus = async () => {
  try {
    console.log('Fetching sales people status');
    const snapshot = await get(ref(database, 'salesPeople'));
    if (snapshot.exists()) {
      const status = snapshot.val();
      console.log('Retrieved sales people status:', status.length, 'people');
      return status;
    }
    console.log('No sales people status found');
    return null;
  } catch (error) {
    console.error('Error getting sales people status:', error);
    throw error;
  }
};

export const subscribeToSalesPeopleStatus = (callback) => {
  try {
    console.log('Setting up sales people status subscription');
    const salesPeopleRef = ref(database, 'salesPeople');
    const unsubscribe = onValue(salesPeopleRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        console.log('Received sales people status update:', status.length, 'people');
        callback(status);
      }
    }, (error) => {
      console.error('Error in sales people status subscription:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up sales people status subscription:', error);
    return () => {};
  }
};

// Initial connection validation
validateDatabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Failed to establish database connection. Check your Firebase configuration and network connection.');
  }
});

// Export initialized instances and functions
export { app, database, performance };
