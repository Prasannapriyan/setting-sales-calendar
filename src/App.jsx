import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SalesCalendar from './components/SalesCalendar';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600 text-xl font-bold mb-4">
          Something went wrong
        </div>
        <div className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </div>
        <pre className="text-sm bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-48">
          {error.stack}
        </pre>
        <div className="flex justify-end">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function logError(error, info) {
  console.error('Error caught by error boundary:', error, info);
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a short delay to ensure Firebase is initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-blue-600">Loading application...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              FITX120 Sales Calendar
            </h1>
            <div className="text-sm text-gray-500">
              {import.meta.env.DEV ? 'Development Mode' : 'Production Mode'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={logError}
          onReset={() => window.location.reload()}
        >
          <SalesCalendar />
        </ErrorBoundary>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FITX120 Sales Calendar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
