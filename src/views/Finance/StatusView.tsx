
import React, { useState } from 'react';
import { Undo2, Search } from 'lucide-react';
import { BudgetSubmission, Department, BudgetStatus } from '../../types';

interface Props {
  submissions: BudgetSubmission[];
  depts: Department[];
  setSubmissions: React.Dispatch<React.SetStateAction<BudgetSubmission[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const FinanceStatusView: React.FC<Props> = ({ submissions, depts, setSubmissions, showToast }) => {
  const [filterStatus, setFilterStatus] = useState<BudgetStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filteredSubmissions = submissions.filter(s => {
    // Gunakan normalisasi saat membandingkan untuk keamanan ekstra
    const submissionStatus = String(s.status || '').trim();
    const matchStatus = filterStatus === 'ALL' || submissionStatus === filterStatus;
    
    const matchSearch = (s.note || '').toLowerCase().includes(search.toLowerCase()) || 
                       (s.location || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancelAction = (id: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          status: BudgetStatus.PENDING_FINANCE,
          rejectionNote: undefined 
        };
      }
      return s;
    }));
    showToast('Keputusan dibatalkan. Pengajuan kembali ke daftar Tunggu.', 'warning');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 w-full md:w-auto custom-scrollbar">
          <button 
            onClick={() => setFilterStatus('ALL')}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${filterStatus === 'ALL' ? 'bg-[#f68b1f] text-white shadow-lg' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            Semua Data
          </button>
          {Object.values(BudgetStatus).map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${filterStatus === status ? 'bg-[#f68b1f] text-white shadow-lg' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Cari pengajuan..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-[#f68b1f] outline-none"
          />
          <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Tgl / Dept</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Bisnis</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">Nominal</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Catatan</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{s.date.split('T')[0].split('-').reverse().join('/')}</div>
                    <div className="text-[10px] text-[#f68b1f] font-black uppercase">
                      {depts.find(d => d.id === s.departmentId)?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">{s.business}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900 text-right">
                    Rp {s.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs truncate" title={s.note}>{s.note}</p>
                    {s.rejectionNote && <p className="text-[10px] text-red-500 font-bold italic">Alasan: {s.rejectionNote}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-tighter ${
                      s.status.includes('Disetujui') ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      s.status.includes('Ditolak') ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {s.status !== BudgetStatus.PENDING_FINANCE && (
                      <button 
                        onClick={() => handleCancelAction(s.id)}
                        title="Batalkan Keputusan"
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <Undo2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceStatusView;
