import React from 'react';
import PropTypes from 'prop-types';

const SalesPersonSummary = ({ salesPersonStats }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Sales Person Performance</h2>
      
      <div>
        <table className="w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-2 text-left border">Sales Person</th>
              <th className="px-2 py-2 text-center border">5K Booked</th>
              <th className="px-2 py-2 text-center border">5K Pitched</th>
              <th className="px-2 py-2 text-center border">5K Paid</th>
              <th className="px-2 py-2 text-center border">4K Paid</th>
              <th className="px-2 py-2 text-center border">1K Deposit</th>
              <th className="px-2 py-2 text-center border">5K ARP</th>
              <th className="px-2 py-2 text-center border">20K Booked</th>
              <th className="px-2 py-2 text-center border">20K Pitched</th>
              <th className="px-2 py-2 text-center border">20K Paid</th>
              <th className="px-2 py-2 text-center border">15K Paid</th>
              <th className="px-2 py-2 text-center border">10K Paid</th>
              <th className="px-2 py-2 text-center border">10K 2nd Ins</th>
              <th className="px-2 py-2 text-center border">5K Deposit</th>
              <th className="px-2 py-2 text-center border">6K Sub</th>
              <th className="px-2 py-2 text-center border">20K ARP</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(salesPersonStats).map(([person, stats]) => {
              const fiveKRevenue = (stats.payments?.['5k'] || 0) * 5000 + 
                                 (stats.payments?.['4k'] || 0) * 4000;
              
              const twentyKRevenue = (stats.payments?.['20k'] || 0) * 20000 + 
                                   (stats.payments?.['15k'] || 0) * 15000 + 
                                   (stats.payments?.['10k'] || 0) * 10000 + 
                                   (stats.payments?.['6k_sub'] || 0) * 6000;

              const fiveKARP = stats.totalPitch5k > 0
                ? (fiveKRevenue / stats.totalPitch5k).toFixed(0)
                : '0';

              const twentyKARP = stats.totalPitch20k > 0
                ? (twentyKRevenue / stats.totalPitch20k).toFixed(0)
                : '0';

              return (
                <tr key={person} className="hover:bg-gray-50">
                  <td className="px-2 py-2 border font-medium">{person}</td>
                  <td className="px-2 py-2 text-center border bg-cyan-50">{stats.booked5k}</td>
                  <td className="px-2 py-2 text-center border bg-cyan-100">{stats.totalPitch5k}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['5k'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['4k'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['1k_deposit'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-blue-50">₹{fiveKARP}</td>
                  <td className="px-2 py-2 text-center border bg-teal-50">{stats.booked20k}</td>
                  <td className="px-2 py-2 text-center border bg-teal-100">{stats.totalPitch20k}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['20k'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['15k'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['10k'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['10k_2nd'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['5k_deposit'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-green-100">{stats.payments['6k_sub'] || 0}</td>
                  <td className="px-2 py-2 text-center border bg-blue-50">₹{twentyKARP}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-2 py-2 border font-bold">Total</td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.booked5k || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.totalPitch5k || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['5k'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['4k'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['1k_deposit'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">-</td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.booked20k || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.totalPitch20k || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['20k'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['15k'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['10k'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['10k_2nd'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['5k_deposit'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">
                {Object.values(salesPersonStats).reduce((acc, stats) => acc + (stats.payments['6k_sub'] || 0), 0)}
              </td>
              <td className="px-2 py-2 text-center border font-bold">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

SalesPersonSummary.propTypes = {
  salesPersonStats: PropTypes.objectOf(PropTypes.shape({
    booked5k: PropTypes.number.isRequired,
    booked20k: PropTypes.number.isRequired,
    totalPitch5k: PropTypes.number.isRequired,
    totalPitch20k: PropTypes.number.isRequired,
    payments: PropTypes.objectOf(PropTypes.number).isRequired
  })).isRequired
};

export default SalesPersonSummary;
