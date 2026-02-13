
import React, { useState } from 'react';
import { Edit2, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { User, BudgetSubmission, BudgetStatus } from '../../types';
import { ConfirmModal } from '../../components/Notification';

interface Props {
  user: User;
  submissions: BudgetSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BudgetSubmission[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const BudgetHistoryView: React.FC<Props> = ({ user, submissions, setSubmissions, showToast }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter(s => {
    const isOwner = s.departmentId === user.departmentId;
    if (!isOwner) return false;

    if (activeTab === 'PENDING') return s.status === BudgetStatus.PENDING_FINANCE || s.status === BudgetStatus.PENDING_DIREKSI;
    if (activeTab === 'APPROVED') return s.status === BudgetStatus.APPROVED_FINANCE || s.status === BudgetStatus.APPROVED_DIREKSI;
    if (activeTab === 'REJECTED') return s.status === BudgetStatus.REJECTED_FINANCE || s.status === BudgetStatus.REJECTED_DIREKSI;
    return false;
  });

  const handleDelete = () => {
    if (deleteId) {
      setSubmissions(prev => prev.filter(s => s.id !== deleteId));
      showToast('Pengajuan budget berhasil dihapus', 'warning');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex p-1.5 bg-gray-200 rounded-2xl w-full sm:w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'PENDING' ? 'bg-white text-[#f68b1f] shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Clock size={16} /> Menunggu
        </button>
        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'APPROVED' ? 'bg-emerald-500 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <CheckCircle size={16} /> Disetujui
        </button>
        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'REJECTED' ? 'bg-red-500 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <XCircle size={16} /> Ditolak
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Tgl / Bisnis</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Keterangan</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Nominal</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
              {activeTab === 'PENDING' && <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubmissions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/80 group transition-colors">
                <td className="px-6 py-4">
                  {/* Format DD/MM/YYYY */}
                  <div className="text-sm font-bold text-gray-900">{s.date.split('T')[0].split('-').reverse().join('/')}</div>
                  <div className="text-[10px] text-[#f68b1f] font-bold uppercase tracking-wider">{s.business}</div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{s.note}</p>
                  {s.rejectionNote && (
                    <div className="mt-2 text-[10px] p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-1">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      <span><b>Alasan:</b> {s.rejectionNote}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-gray-800 text-center">
                  Rp {s.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-tighter ${
                    s.status.includes('Disetujui') ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    s.status.includes('Ditolak') ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {s.status}
                  </span>
                </td>
                {activeTab === 'PENDING' && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteId(s.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400 italic">
                  Tidak ada data untuk kategori ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Hapus Pengajuan"
        message="Anda akan menghapus draf pengajuan ini. Lanjutkan?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default BudgetHistoryView;
