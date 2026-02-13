
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, BudgetSubmission, BudgetStatus } from '../../types';

interface Props {
  user: User;
  submissions: BudgetSubmission[];
}

const AccountingDashboard: React.FC<Props> = ({ user, submissions }) => {
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const availableYears = useMemo(() => {
    const years = new Set(submissions.map(s => s.date.substring(0, 4)));
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort().reverse();
  }, [submissions]);

  const monthlyData = useMemo(() => {
    const daysInMonth = new Date(Number(filterYear), Number(filterMonth), 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));

    return daysArray.map(day => {
      const dateStr = `${filterYear}-${filterMonth}-${day}`;
      const dailySubs = submissions.filter(s => 
        s.business === user.business && 
        s.date === dateStr &&
        (s.status === BudgetStatus.APPROVED_FINANCE || s.status === BudgetStatus.APPROVED_DIREKSI)
      );

      return {
        name: day,
        Nominal: dailySubs.reduce((sum, s) => sum + s.amount, 0)
      };
    });
  }, [submissions, user.business, filterYear, filterMonth]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-1">
          <h3 className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-xs">Filter Visualisasi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Pilih Tahun</label>
              <select 
                value={filterYear} 
                onChange={e => setFilterYear(e.target.value)} 
                className="w-full border p-2.5 rounded-lg bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-[#f68b1f]"
              >
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Pilih Bulan</label>
              <select 
                value={filterMonth} 
                onChange={e => setFilterMonth(e.target.value)} 
                className="w-full border p-2.5 rounded-lg bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-[#f68b1f]"
              >
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{new Date(2000, Number(m)-1).toLocaleString('id-ID', { month: 'long' })}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-[10px] font-bold text-blue-400 uppercase">Fokus Bisnis</div>
            <div className="text-xl font-black text-blue-700">{user.business}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="text-lg font-bold mb-6">Realisasi Budget Harian (Disetujui)</h3>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`} 
                />
                <Bar dataKey="Nominal" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;
