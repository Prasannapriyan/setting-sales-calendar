import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import './index.css';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => window.location.reload()}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept();
}
