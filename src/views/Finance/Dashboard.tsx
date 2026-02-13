
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BudgetSubmission, Department, BudgetStatus, Bisnis } from '../../types';
import { Filter, Calendar } from 'lucide-react';

interface Props {
  submissions: BudgetSubmission[];
  depts: Department[];
  bisnis: Bisnis[];
}

const BRAND_COLORS = ['#f68b1f', '#d57618', '#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];

const FinanceDashboard: React.FC<Props> = ({ submissions, depts, bisnis }) => {
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState('ALL');

  const availableYears = useMemo(() => {
    const years = new Set(submissions.map(s => s.date.substring(0, 4)));
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort().reverse();
  }, [submissions]);

  const months = [
    { value: 'ALL', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      const sYear = s.date.substring(0, 4);
      const sMonth = s.date.substring(5, 7);
      
      const matchYear = sYear === filterYear;
      const matchMonth = filterMonth === 'ALL' || sMonth === filterMonth;
      
      return matchYear && matchMonth;
    });
  }, [submissions, filterYear, filterMonth]);

  const deptData = useMemo(() => {
    return depts.map(d => {
      const total = filteredSubmissions
        .filter(s => s.departmentId === d.id)
        .reduce((sum, s) => sum + s.amount, 0);
      return { name: d.name, amount: total };
    }).filter(d => d.amount > 0);
  }, [filteredSubmissions, depts]);

  const businessData = useMemo(() => {
    return bisnis.map(b => {
      const total = filteredSubmissions
        .filter(s => s.business === b.name)
        .reduce((sum, s) => sum + s.amount, 0);
      return { name: b.name, amount: total };
    }).filter(b => b.amount > 0);
  }, [filteredSubmissions, bisnis]);

  const totalBudget = useMemo(() => {
    return filteredSubmissions.reduce((sum, s) => sum + s.amount, 0);
  }, [filteredSubmissions]);

  const approvedBudget = useMemo(() => {
    return filteredSubmissions
      .filter(s => s.status === BudgetStatus.APPROVED_FINANCE || s.status === BudgetStatus.APPROVED_DIREKSI)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [filteredSubmissions]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-bold">
          <Filter size={18} className="text-[#f68b1f]" />
          <span>Filter Laporan</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Tahun</span>
            <select 
              value={filterYear} 
              onChange={e => setFilterYear(e.target.value)}
              className="border border-gray-200 rounded-xl p-2 text-sm bg-gray-50 font-bold focus:ring-2 focus:ring-[#f68b1f] outline-none min-w-[100px]"
            >
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Bulan</span>
            <select 
              value={filterMonth} 
              onChange={e => setFilterMonth(e.target.value)}
              className="border border-gray-200 rounded-xl p-2 text-sm bg-gray-50 font-bold focus:ring-2 focus:ring-[#f68b1f] outline-none min-w-[140px]"
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#f68b1f]">
             <Calendar size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pengajuan</div>
            <div className="text-xl font-bold text-gray-800">Rp {totalBudget.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
             <Filter size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disetujui</div>
            <div className="text-xl font-bold text-emerald-600">Rp {approvedBudget.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
             <Filter size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Menunggu Konfirmasi</div>
            <div className="text-xl font-bold text-amber-600">
              Rp {(totalBudget - approvedBudget).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-[#f68b1f] rounded-full"></div>
            Budget per Departemen
          </h3>
          <div className="h-72 w-full min-w-0">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={deptData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#fef3e7' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#f68b1f" radius={[0, 8, 8, 0]} barSize={30}>
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                Tidak ada data pada periode ini.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            Budget per Bisnis
          </h3>
          <div className="h-72 w-full min-w-0">
            {businessData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={businessData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f0fdf4' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} barSize={50}>
                    {businessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[(index + 3) % BRAND_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                Tidak ada data pada periode ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
