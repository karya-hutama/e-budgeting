
import React, { useState, useMemo } from 'react';
import { Send, MapPin, Building } from 'lucide-react';
import { User, Bisnis, BudgetStatus, BudgetSubmission, Department } from '../../types';

interface Props {
  user: User;
  depts: Department[];
  bisnis: Bisnis[];
  setSubmissions: React.Dispatch<React.SetStateAction<BudgetSubmission[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const BudgetSubmissionView: React.FC<Props> = ({ user, depts, bisnis, setSubmissions, showToast }) => {
  const userDeptName = useMemo(() => depts.find(d => d.id === user.departmentId)?.name || '', [depts, user.departmentId]);
  const isKepalaToko = userDeptName === 'Kepala Toko';

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    business: bisnis[0]?.name || '',
    amount: 0,
    location: user.storeAddress || '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isKepalaToko && !formData.location.trim()) return showToast('Lokasi toko wajib diisi', 'error');
    if (formData.amount <= 0) return showToast('Nominal tidak valid', 'error');

    const newSub: BudgetSubmission = {
      id: `sub-${Date.now()}`,
      date: formData.date,
      departmentId: user.departmentId!,
      business: formData.business,
      amount: formData.amount,
      location: isKepalaToko ? formData.location : userDeptName,
      note: formData.note,
      status: BudgetStatus.PENDING_FINANCE,
      userId: user.id
    };

    setSubmissions(prev => [...prev, newSub]);
    setFormData(prev => ({ ...prev, amount: 0, note: '' }));
    showToast('Pengajuan berhasil dikirim.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-scale-in">
        <div className="bg-gradient-to-r from-[#f68b1f] to-[#d57618] p-8 text-white relative">
          <h3 className="text-2xl font-black">Formulir Pengajuan</h3>
          <p className="text-white/80 text-sm mt-1">{userDeptName}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {isKepalaToko && (
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
              <label className="block text-xs font-black text-[#f68b1f] uppercase mb-2">Lokasi Toko *</label>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3.5 border-2 border-orange-100 rounded-xl outline-none" placeholder="Alamat cabang..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3.5 border rounded-xl" />
            <select value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} className="w-full p-3.5 border rounded-xl">
              {bisnis.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full p-4 border rounded-xl text-2xl font-black text-[#f68b1f]" />
          <textarea required rows={4} value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full p-3.5 border rounded-xl" placeholder="Catatan..."></textarea>
          <button type="submit" className="w-full bg-[#f68b1f] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2">Kirim Pengajuan</button>
        </form>
      </div>
    </div>
  );
};

export default BudgetSubmissionView;
