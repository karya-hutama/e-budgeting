
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
// Changed Business to Bisnis and added it to imports
import { User, Role, Department, Bisnis } from '../../types';
import { ROLE_LABELS } from '../../constants';
import { ConfirmModal } from '../../components/Notification';

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  depts: Department[];
  // Added bisnis prop to interface
  bisnis: Bisnis[];
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

// Destructured bisnis from props
const UserManager: React.FC<Props> = ({ users, setUsers, depts, bisnis, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    password: '',
    name: '',
    role: Role.DEPARTMENT,
    departmentId: '',
    // Use first item from bisnis list or empty string instead of Business enum
    business: bisnis[0]?.name || '',
    storeAddress: ''
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        role: Role.DEPARTMENT,
        departmentId: depts[0]?.id || '',
        // Use first item from bisnis list or empty string instead of Business enum
        business: bisnis[0]?.name || '',
        storeAddress: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData as User } : u));
      showToast('Data user berhasil diperbarui');
    } else {
      const newUser: User = {
        ...formData as User,
        id: `user-${Date.now()}`,
      };
      setUsers([...users, newUser]);
      showToast('User baru berhasil ditambahkan');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setUsers(users.filter(u => u.id !== deleteId));
      showToast('User berhasil dihapus', 'warning');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Manajemen Akun</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#f68b1f] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#d57618] shadow-md transition-all active:scale-95 text-sm font-bold"
        >
          <Plus size={18} /> Tambah Akun
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nama</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Username</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Peran</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{depts.find(d => d.id === user.departmentId)?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.username}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-[#fef3e7] text-[#f68b1f] text-[10px] rounded-full font-bold uppercase tracking-wider">
                    {ROLE_LABELS[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleOpenModal(user)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(user.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-scale-in">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800">{editingUser ? 'Edit Akun' : 'Tambah Akun'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nama Lengkap</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Username</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Password</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Peran</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all">
                    {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Departemen</label>
                  <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all">
                    <option value="">- Tanpa Dept -</option>
                    {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              
              {formData.role === Role.ACCOUNTING && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Fokus Bisnis</label>
                  <select value={formData.business} onChange={e => setFormData({...formData, business: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f68b1f] focus:bg-white outline-none transition-all">
                    {/* Map over bisnis prop instead of constants */}
                    {bisnis.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#f68b1f] text-white rounded-xl hover:bg-[#d57618] font-bold shadow-lg shadow-[#f68b1f]/20 transition-all active:scale-95">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default UserManager;
