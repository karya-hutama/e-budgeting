
import React, { useState } from 'react';
import { Check, X as XIcon, AlertCircle, MapPin } from 'lucide-react';
import { BudgetSubmission, BudgetStatus, Department, BudgetLimit } from '../../types';

interface Props {
  submissions: BudgetSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BudgetSubmission[]>>;
  depts: Department[];
  limits: BudgetLimit[];
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const FinanceSubmissionsView: React.FC<Props> = ({ submissions, setSubmissions, depts, limits, showToast }) => {
  const [filterDept, setFilterDept] = useState('');
  const [rejectionModal, setRejectionModal] = useState<{ id: string; note: string } | null>(null);

  const pendingSubmissions = submissions.filter(s => s.status === BudgetStatus.PENDING_FINANCE && (filterDept ? s.departmentId === filterDept : true));

  const handleAction = (id: string, action: 'APPROVE' | 'ESCALATE' | 'REJECT', note?: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        if (action === 'APPROVE') return { ...s, status: BudgetStatus.APPROVED_FINANCE };
        if (action === 'REJECT') return { ...s, status: BudgetStatus.REJECTED_FINANCE, rejectionNote: note };
        if (action === 'ESCALATE') return { ...s, status: BudgetStatus.PENDING_DIREKSI };
      }
      return s;
    }));
    
    if (action === 'APPROVE') showToast('Pengajuan budget disetujui');
    if (action === 'REJECT') showToast('Pengajuan budget ditolak', 'error');
    if (action === 'ESCALATE') showToast('Pengajuan dieskalasi ke Direksi', 'warning');
    
    setRejectionModal(null);
  };

  const getLimitStats = (deptId: string, date: string) => {
    const month = date.substring(0, 7);
    const limit = limits.find(l => l.departmentId === deptId && l.month === month)?.limitAmount || 0;
    const spent = submissions
      .filter(s => s.departmentId === deptId && s.date.startsWith(month) && (s.status === BudgetStatus.APPROVED_FINANCE || s.status === BudgetStatus.APPROVED_DIREKSI))
      .reduce((sum, s) => sum + s.amount, 0);
    return { limit, spent };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="font-bold text-gray-800">Menunggu Konfirmasi</h3>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border rounded-lg p-2 text-sm">
          <option value="">Semua Departemen</option>
          {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {pendingSubmissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400 italic">
            Tidak ada pengajuan budget baru.
          </div>
        )}
        {pendingSubmissions.map(sub => {
          const { limit, spent } = getLimitStats(sub.departmentId, sub.date);
          const exceedsLimit = spent + sub.amount > limit;
          const progress = limit > 0 ? (spent / limit) * 100 : 0;
          const afterProgress = limit > 0 ? ((spent + sub.amount) / limit) * 100 : 0;

          return (
            <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">{sub.business}</span>
                    <span className="text-xs text-gray-400 font-mono">#{sub.id.slice(-6)}</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900">Rp {sub.amount.toLocaleString()}</h4>
                  
                  {/* Info Lokasi */}
                  <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit my-2 text-xs font-bold">
                    <MapPin size={12} /> {sub.location}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 italic">"{sub.note}"</p>
                  <div className="flex gap-4 mt-4 text-[10px] text-gray-400 font-bold uppercase">
                    <span>Oleh: {depts.find(d => d.id === sub.departmentId)?.name}</span>
                    {/* Format DD/MM/YYYY */}
                    <span>Tgl: {sub.date.split('T')[0].split('-').reverse().join('/')}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Limit Bulanan</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
                    <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" style={{ width: `${Math.min(100, progress)}%` }}></div>
                    <div className="absolute top-0 left-0 h-full bg-blue-300 opacity-50" style={{ width: `${Math.min(100, afterProgress)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-gray-700">{progress.toFixed(0)}% Digunakan</span>
                    <span className="text-emerald-600">Sisa Rp {(limit - spent).toLocaleString()}</span>
                  </div>
                  {exceedsLimit && (
                    <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 p-1 rounded animate-pulse uppercase">
                      <AlertCircle size={10} /> Eskalasi Direksi (Over Limit)
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  {exceedsLimit ? (
                    <button 
                      onClick={() => handleAction(sub.id, 'ESCALATE')}
                      className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      Ajukan ke Direksi
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAction(sub.id, 'APPROVE')}
                      className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      Terima
                    </button>
                  )}
                  <button 
                    onClick={() => setRejectionModal({ id: sub.id, note: '' })}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-95 transition-all"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rejectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
            <h4 className="text-lg font-bold mb-4">Alasan Penolakan</h4>
            <textarea 
              autoFocus
              className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-4 focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              rows={4}
              placeholder="Jelaskan alasan penolakan agar dipahami departemen..."
              onChange={e => setRejectionModal({ ...rejectionModal, note: e.target.value })}
            ></textarea>
            <div className="flex gap-3">
              <button onClick={() => setRejectionModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold">Batal</button>
              <button 
                onClick={() => handleAction(rejectionModal.id, 'REJECT', rejectionModal.note)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSubmissionsView;
