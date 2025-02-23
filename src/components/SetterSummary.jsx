import React from 'react';
import PropTypes from 'prop-types';
import { SETTERS } from './calendar-utils';

const SetterSummary = ({ setterStats }) => {
  const totalSetterAppointments = SETTERS.reduce((total, setter) => 
    total + (setterStats[setter]?.total || 0), 0
  );

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Setter Performance</h2>
      
      {/* Overall Stats */}
      <div className="mb-6 bg-blue-50 p-4 rounded">
        <div className="text-xl font-bold">
          Total Appointments Set: {totalSetterAppointments}
        </div>
      </div>

      {/* Setter Stats Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left border">Setter</th>
              <th className="px-4 py-3 text-center border">Total Set</th>
              <th className="px-4 py-3 text-center border">5K Initial</th>
              <th className="px-4 py-3 text-center border">20K Initial</th>
              <th className="px-4 py-3 text-center border">5K Final</th>
              <th className="px-4 py-3 text-center border">20K Final</th>
              <th className="px-4 py-3 text-center border">Converted</th>
              <th className="px-4 py-3 text-center border">Didn't Pick</th>
              <th className="px-4 py-3 text-center border">Wrong Qual.</th>
              <th className="px-4 py-3 text-center border">Conv. Rate</th>
            </tr>
          </thead>
          <tbody>
            {SETTERS.map(setter => {
              const stats = setterStats[setter] || {
                total: 0,
                pitch5k: 0,
                pitch20k: 0,
                initialPitch5k: 0,
                initialPitch20k: 0,
                converted: 0,
                didntPick: 0,
                wronglyQualified: 0
              };

              const conversionRate = stats.total > 0 
                ? ((stats.converted / stats.total) * 100).toFixed(1)
                : '0.0';

              return (
                <tr key={setter} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border font-medium">{setter}</td>
                  <td className="px-4 py-3 text-center border">{stats.total}</td>
                  <td className="px-4 py-3 text-center border bg-cyan-50">{stats.initialPitch5k}</td>
                  <td className="px-4 py-3 text-center border bg-teal-50">{stats.initialPitch20k}</td>
                  <td className="px-4 py-3 text-center border bg-cyan-100">{stats.pitch5k}</td>
                  <td className="px-4 py-3 text-center border bg-teal-100">{stats.pitch20k}</td>
                  <td className="px-4 py-3 text-center border bg-green-50">{stats.converted}</td>
                  <td className="px-4 py-3 text-center border bg-red-50">{stats.didntPick}</td>
                  <td className="px-4 py-3 text-center border bg-orange-50">{stats.wronglyQualified}</td>
                  <td className="px-4 py-3 text-center border bg-blue-50">{conversionRate}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-3 border font-bold">Total</td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.total || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.initialPitch5k || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.initialPitch20k || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.pitch5k || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.pitch20k || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.converted || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.didntPick || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.wronglyQualified || 0), 0)}
              </td>
              <td className="px-4 py-3 text-center border font-bold">
                {(SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.converted || 0), 0) / 
                  Math.max(1, SETTERS.reduce((acc, setter) => acc + (setterStats[setter]?.total || 0), 0)) * 100).toFixed(1)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

SetterSummary.propTypes = {
  setterStats: PropTypes.objectOf(PropTypes.shape({
    total: PropTypes.number.isRequired,
    pitch5k: PropTypes.number.isRequired,
    pitch20k: PropTypes.number.isRequired,
    initialPitch5k: PropTypes.number.isRequired,
    initialPitch20k: PropTypes.number.isRequired,
    converted: PropTypes.number.isRequired,
    didntPick: PropTypes.number.isRequired,
    wronglyQualified: PropTypes.number.isRequired
  })).isRequired
};

export default SetterSummary;