
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BudgetSubmission, BudgetLimit, BudgetStatus } from '../../types';

interface Props {
  submissions: BudgetSubmission[];
  limits: BudgetLimit[];
}

const DireksiDashboard: React.FC<Props> = ({ submissions, limits }) => {
  const pendingDireksi = submissions.filter(s => s.status === BudgetStatus.PENDING_DIREKSI);
  const totalPending = pendingDireksi.reduce((sum, s) => sum + s.amount, 0);

  const chartData = [
    { name: 'Pending Direksi', amount: totalPending },
    { name: 'Total Limit Aktif', amount: limits.reduce((sum, l) => sum + l.limitAmount, 0) }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-amber-500 uppercase mb-2">Perlu Persetujuan Direksi</div>
          <div className="text-4xl font-extrabold text-gray-900">Rp {totalPending.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2">{pendingDireksi.length} Pengajuan menunggu</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DireksiDashboard;
