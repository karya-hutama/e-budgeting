import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Department, BudgetLimit } from '../../types';

interface Props {
  depts: Department[];
  limits: BudgetLimit[];
  setLimits: React.Dispatch<React.SetStateAction<BudgetLimit[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const LimitBudgetView: React.FC<Props> = ({ depts, limits, setLimits, showToast }) => {
  const [formData, setFormData] = useState({
    departmentId: '',
    month: new Date().toISOString().substring(0, 7),
    limitAmount: 0
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.limitAmount <= 0) return showToast('Nominal limit tidak valid', 'error');
    if (!formData.departmentId) return showToast('Pilih departemen', 'error');

    const existing = limits.findIndex(l => l.departmentId === formData.departmentId && l.month === formData.month);
    
    if (existing >= 0) {
      setLimits(prev => prev.map((l, i) => i === existing ? { ...l, limitAmount: formData.limitAmount } : l));
    } else {
      setLimits(prev => [...prev, { ...formData, id: `limit-${Date.now()}` }]);
    }
    showToast('Limit budget berhasil diatur.');
    setFormData(prev => ({ ...prev, limitAmount: 0 }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h3 className="text-lg font-bold mb-6">Atur Limit Bulanan</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Departemen</label>
            <select 
              required
              value={formData.departmentId} 
              onChange={e => setFormData({...formData, departmentId: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#f68b1f] outline-none"
            >
              <option value="">Pilih Dept</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Bulan</label>
            <input 
              type="month" 
              required
              value={formData.month} 
              onChange={e => setFormData({...formData, month: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#f68b1f] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Limit Nominal (Rp)</label>
            <input 
              type="number" 
              required
              value={formData.limitAmount === 0 ? '' : formData.limitAmount} 
              onChange={e => setFormData({...formData, limitAmount: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg font-bold text-[#f68b1f] focus:ring-2 focus:ring-[#f68b1f] outline-none" 
              placeholder="0"
            />
          </div>
          <button type="submit" className="w-full bg-[#f68b1f] text-white py-3 rounded-xl font-bold hover:bg-[#d57618] shadow-md transition-all active:scale-95">
            Simpan Limit
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold">History Limit Budget</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Bulan</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Departemen</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Limit</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {limits.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold">{l.month.split('-').reverse().join('-')}</td>
                <td className="px-6 py-4 text-sm">{depts.find(d => d.id === l.departmentId)?.name}</td>
                <td className="px-6 py-4 text-sm font-mono font-bold text-emerald-600">Rp {l.limitAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => {
                    setLimits(limits.filter(item => item.id !== l.id));
                    showToast('Limit budget dihapus', 'warning');
                  }} className="text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {limits.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Belum ada limit yang diatur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LimitBudgetView;
