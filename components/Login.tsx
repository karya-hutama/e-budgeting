
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon, Building, Briefcase } from 'lucide-react';
import { Role, User, Department, WebSettings, Bisnis } from '../types';
import { ROLE_LABELS } from '../constants';

interface LoginProps {
  users: User[];
  depts: Department[];
  bisnis: Bisnis[];
  settings: WebSettings;
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, depts, bisnis, settings, onLogin }) => {
  const [role, setRole] = useState<Role>(Role.DEPARTMENT);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi input form awal
    if (role === Role.DEPARTMENT && !selectedDept) {
      setError('Silakan pilih departemen.');
      return;
    }
    if (role === Role.ACCOUNTING && !selectedBusiness) {
      setError('Silakan pilih bisnis.');
      return;
    }

    const foundUser = users.find(u => {
      // 1. Cek Username dan Password (Case-insensitive user, case-sensitive pass)
      const matchUsername = u.username.toLowerCase().trim() === username.toLowerCase().trim();
      const matchPassword = u.password === password;
      // 2. Cek Role
      const matchRole = u.role === role;
      
      let matchContext = true;
      
      // 3. Cek Konteks (Departemen / Bisnis) dengan logika "Pemaaf"
      if (role === Role.DEPARTMENT) {
        const selectedDeptObj = depts.find(d => String(d.id) === selectedDept);
        const selectedDeptName = selectedDeptObj ? selectedDeptObj.name.toLowerCase().trim() : '';
        const userDeptValue = String(u.departmentId || '').toLowerCase().trim();

        // Logika Pemaaf:
        // Jika data di spreadsheet kosong (userDeptValue === ''), izinkan login (matchContext = true).
        // Jika ada datanya, baru cek apakah cocok dengan ID atau Nama Departemen.
        const isEmptyInDb = userDeptValue === '' || userDeptValue === 'undefined' || userDeptValue === 'null';
        const matchId = userDeptValue === String(selectedDept).toLowerCase().trim();
        const matchName = userDeptValue === selectedDeptName;
        
        matchContext = isEmptyInDb || matchId || matchName;
      }
      
      if (role === Role.ACCOUNTING) {
        const selectedBizName = selectedBusiness.toLowerCase().trim();
        const userBizValue = String(u.business || '').toLowerCase().trim();
        const isEmptyInDb = userBizValue === '' || userBizValue === 'undefined';
        
        matchContext = isEmptyInDb || userBizValue === selectedBizName;
      }

      return matchUsername && matchPassword && matchRole && matchContext;
    });

    if (foundUser) {
      // Jika user di DB tidak punya Dept ID (karena kosong), kita "pinjamkan" ID dari pilihan dropdown
      // agar dashboard bisa menampilkan data yang benar untuk sesi ini.
      let finalUser = { ...foundUser };

      if (role === Role.DEPARTMENT && (!foundUser.departmentId || foundUser.departmentId !== selectedDept)) {
        finalUser.departmentId = selectedDept;
      }
      
      if (role === Role.ACCOUNTING && (!foundUser.business || foundUser.business !== selectedBusiness)) {
        finalUser.business = selectedBusiness;
      }

      onLogin(finalUser);
    } else {
      setError('Username, password, atau pilihan departemen/bisnis tidak sesuai.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f68b1f] to-[#d57618] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#f68b1f] animate-scale-in">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={settings.logoUrl} alt="Logo" className="h-16 mb-4 rounded-lg object-contain" />
            <h1 className="text-2xl font-bold text-gray-800 text-center">{settings.siteName}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Peran</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#f68b1f]">
                {Object.entries(ROLE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>

            {role === Role.DEPARTMENT && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Departemen</label>
                <select required value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#f68b1f]">
                  <option value="">-- Pilih Departemen --</option>
                  {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            )}

            {role === Role.ACCOUNTING && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Bisnis</label>
                <select required value={selectedBusiness} onChange={(e) => setSelectedBusiness(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#f68b1f]">
                  <option value="">-- Pilih Bisnis --</option>
                  {bisnis.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#f68b1f]" 
                  placeholder="Masukkan username"
                />
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-12 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#f68b1f]" 
                  placeholder="Masukkan password"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-[#f68b1f] transition-colors"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm font-bold animate-shake bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            <button type="submit" className="w-full bg-[#f68b1f] text-white py-3 rounded-xl font-bold hover:bg-[#d57618] transition shadow-lg active:scale-95">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
