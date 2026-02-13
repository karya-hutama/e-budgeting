
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, BudgetSubmission, BudgetLimit, BudgetStatus } from '../../types';

interface Props {
  user: User;
  submissions: BudgetSubmission[];
  limits: BudgetLimit[];
}

const DepartmentDashboard: React.FC<Props> = ({ user, submissions, limits }) => {
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const availableYears = useMemo(() => {
    const years = new Set(submissions.map(s => s.date.substring(0, 4)));
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort().reverse();
  }, [submissions]);

  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return months.map((m, i) => {
      const monthStr = (i + 1).toString().padStart(2, '0');
      const monthKey = `${filterYear}-${monthStr}`;
      
      const limit = limits.find(l => l.departmentId === user.departmentId && l.month === monthKey)?.limitAmount || 0;
      
      const monthlySubs = submissions.filter(s => 
        s.departmentId === user.departmentId && 
        s.date.startsWith(monthKey)
      );

      const approved = monthlySubs
        .filter(s => s.status === BudgetStatus.APPROVED_FINANCE || s.status === BudgetStatus.APPROVED_DIREKSI)
        .reduce((sum, s) => sum + s.amount, 0);
      
      const rejected = monthlySubs
        .filter(s => s.status === BudgetStatus.REJECTED_FINANCE || s.status === BudgetStatus.REJECTED_DIREKSI)
        .reduce((sum, s) => sum + s.amount, 0);

      return {
        name: m,
        Limit: limit,
        Disetujui: approved,
        Ditolak: rejected
      };
    });
  }, [submissions, limits, user.departmentId, filterYear]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="font-bold text-gray-800">Analisa Budget Tahunan</h3>
        <select 
          value={filterYear} 
          onChange={e => setFilterYear(e.target.value)}
          className="border rounded-lg p-2 text-sm bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-[#f68b1f]"
        >
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="Limit" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Disetujui" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ditolak" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
