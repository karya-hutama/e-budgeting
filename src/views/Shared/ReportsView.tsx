
import React, { useState, useMemo } from 'react';
import { Download, Filter, Search, Calendar, MapPin } from 'lucide-react';
// Removed Business from imports as it doesn't exist in types
import { BudgetSubmission, Department, BudgetStatus } from '../../types';

interface Props {
  submissions: BudgetSubmission[];
  depts: Department[];
  // Changed filterBusiness type from Business to string
  filterBusiness?: string;
}

const ReportsView: React.FC<Props> = ({ submissions, depts, filterBusiness }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return submissions.filter(s => {
      const matchBusiness = filterBusiness ? s.business === filterBusiness : true;
      const matchDate = (!startDate || s.date >= startDate) && (!endDate || s.date <= endDate);
      const matchSearch = s.note.toLowerCase().includes(search.toLowerCase()) || 
                          s.location.toLowerCase().includes(search.toLowerCase()) ||
                          depts.find(d => d.id === s.departmentId)?.name.toLowerCase().includes(search.toLowerCase());
      return matchBusiness && matchDate && matchSearch;
    });
  }, [submissions, filterBusiness, startDate, endDate, search, depts]);

  const handleDownload = () => {
    const headers = ['ID', 'Tanggal', 'Departemen', 'Bisnis', 'Lokasi', 'Nominal', 'Catatan', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(s => [
        s.id,
        // Format to DD/MM/YYYY for CSV
        `"${s.date.split('T')[0].split('-').reverse().join('/')}"`,
        `"${depts.find(d => d.id === s.departmentId)?.name || 'N/A'}"`,
        `"${s.business}"`,
        `"${s.location.replace(/"/g, '""')}"`,
        s.amount,
        `"${s.note.replace(/"/g, '""')}"`,
        s.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Budget_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                <Calendar size={12} /> Dari Tanggal
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f68b1f] outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                <Calendar size={12} /> Sampai Tanggal
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f68b1f] outline-none transition-all" 
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                <Search size={12} /> Pencarian Cepat
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari catatan, lokasi atau dept..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f68b1f] outline-none transition-all"
                />
                <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            className="w-full sm:w-fit self-end flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold transition-all active:scale-95 text-sm"
          >
            <Download size={18} /> Export Data (.CSV)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Tgl</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Dept</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Lokasi</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Bisnis</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Nominal</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {/* Format DD/MM/YYYY */}
                    {s.date.split('T')[0].split('-').reverse().join('/')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{depts.find(d => d.id === s.departmentId)?.name}</td>
                  <td className="px-6 py-4 text-sm text-orange-600 font-bold">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} /> {s.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">{s.business}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-bold">Rp {s.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-tighter ${
                      s.status.includes('Disetujui') ? 'bg-emerald-100 text-emerald-700' :
                      s.status.includes('Ditolak') ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
