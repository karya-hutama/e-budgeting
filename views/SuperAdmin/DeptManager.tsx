
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Department } from '../../types';
import { ConfirmModal } from '../../components/Notification';

interface Props {
  depts: Department[];
  setDepts: React.Dispatch<React.SetStateAction<Department[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const DeptManager: React.FC<Props> = ({ depts, setDepts, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setName(dept.name);
    } else {
      setEditingDept(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      setDepts(depts.map(d => d.id === editingDept.id ? { ...d, name } : d));
      showToast('Data departemen berhasil diperbarui');
    } else {
      setDepts([...depts, { id: `dept-${Date.now()}`, name }]);
      showToast('Departemen baru berhasil ditambahkan');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setDepts(depts.filter(item => item.id !== deleteId));
      showToast('Departemen berhasil dihapus', 'warning');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Daftar Departemen</h3>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-[#f68b1f] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#d57618] transition-all active:scale-95 shadow-md font-bold text-sm"
        >
          <Plus size={18} /> Tambah Departemen
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nama Departemen</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {depts.map(d => (
              <tr key={d.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-800">{d.name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => handleOpenModal(d)} 
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteId(d.id)} 
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
             <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800">{editingDept ? 'Edit Departemen' : 'Tambah Departemen'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nama Departemen</label>
                <input 
                  required 
                  autoFocus
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all" 
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#f68b1f] text-white rounded-xl hover:bg-[#d57618] font-bold shadow-lg shadow-[#f68b1f]/20 active:scale-95 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Hapus Departemen"
        message="Menghapus departemen ini akan berdampak pada user yang terhubung. Lanjutkan?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default DeptManager;
