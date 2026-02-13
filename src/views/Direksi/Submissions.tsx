
import React, { useState } from 'react';
import { BudgetSubmission, BudgetStatus, Department } from '../../types';
import { Check, X as XIcon, MessageSquare, Building, Calendar, Wallet } from 'lucide-react';

interface Props {
  submissions: BudgetSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BudgetSubmission[]>>;
  depts: Department[];
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const DireksiSubmissionsView: React.FC<Props> = ({ submissions, setSubmissions, depts, showToast }) => {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const pendingSubmissions = submissions.filter(s => s.status === BudgetStatus.PENDING_DIREKSI);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          status: action === 'APPROVE' ? BudgetStatus.APPROVED_DIREKSI : BudgetStatus.REJECTED_DIREKSI,
          rejectionNote: action === 'REJECT' ? note : undefined
        };
      }
      return s;
    }));

    if (action === 'APPROVE') showToast('Pengajuan budget disetujui oleh Direksi');
    if (action === 'REJECT') showToast('Pengajuan budget ditolak oleh Direksi', 'error');

    setRejectId(null);
    setNote('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800">Persetujuan Direksi</h3>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {pendingSubmissions.length} Perlu Tindakan
        </span>
      </div>

      {pendingSubmissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Check size={32} />
          </div>
          <p className="text-gray-400 italic">Tidak ada pengajuan yang memerlukan persetujuan direksi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
          {pendingSubmissions.map(s => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info Utama */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase">
                        {s.business}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">#{s.id.slice(-6)}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-black text-gray-900">
                        Rp {s.amount.toLocaleString()}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {s.note}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Building size={14} className="text-gray-400" />
                        <span className="font-bold">{depts.find(d => d.id === s.departmentId)?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} className="text-gray-400" />
                        {/* Format DD/MM/YYYY */}
                        <span>{s.date.split('T')[0].split('-').reverse().join('/')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex flex-row lg:flex-col gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <button 
                      onClick={() => handleAction(s.id, 'APPROVE')} 
                      className="flex-1 lg:w-32 bg-emerald-500 text-white py-3 lg:py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Terima
                    </button>
                    <button 
                      onClick={() => setRejectId(s.id)} 
                      className="flex-1 lg:w-32 bg-red-50 text-red-600 py-3 lg:py-2 rounded-xl font-bold text-sm hover:bg-red-100 border border-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <XIcon size={18} /> Tolak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Penolakan */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-scale-in shadow-2xl">
            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-bold text-red-900">Alasan Penolakan</h4>
            </div>
            <div className="p-6">
              <textarea 
                autoFocus
                onChange={e => setNote(e.target.value)} 
                className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                rows={4}
                placeholder="Tulis alasan penolakan untuk departemen terkait..."
              ></textarea>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setRejectId(null)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleAction(rejectId, 'REJECT')} 
                  disabled={!note.trim()}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 transition-all"
                >
                  Simpan Penolakan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DireksiSubmissionsView;
