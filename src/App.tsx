
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Role, 
  User, 
  Department, 
  BudgetSubmission, 
  BudgetLimit, 
  WebSettings,
  Bisnis,
  BudgetStatus
} from './types';
import { api } from './services/api';
import Login from './components/Login';
import Layout from './components/Layout';
import { Toast } from './components/Notification';
import SuperAdminDashboard from './views/SuperAdmin/Dashboard';
import UserManager from './views/SuperAdmin/UserManager';
import DeptManager from './views/SuperAdmin/DeptManager';
import WebSettingsView from './views/SuperAdmin/WebSettings';
import DepartmentDashboard from './views/Department/Dashboard';
import BudgetSubmissionView from './views/Department/BudgetSubmission';
import BudgetHistoryView from './views/Department/BudgetHistory';
import FinanceDashboard from './views/Finance/Dashboard';
import LimitBudgetView from './views/Finance/LimitBudget';
import FinanceSubmissionsView from './views/Finance/Submissions';
import FinanceStatusView from './views/Finance/StatusView';
import ReportsView from './views/Shared/ReportsView';
import AccountingDashboard from './views/Accounting/Dashboard';
import AccountingSubmissionsView from './views/Accounting/Submissions';
import DireksiDashboard from './views/Direksi/Dashboard';
import DireksiSubmissionsView from './views/Direksi/Submissions';

const INITIAL_SETTINGS: WebSettings = {
  logoUrl: 'https://picsum.photos/200/100',
  siteName: 'Katara Budget System',
  databaseId: '',
  backendUrl: ''
};

const DEFAULT_ADMIN: User = {
  id: 'admin-0',
  username: 'admin',
  password: 'password123',
  role: Role.SUPER_ADMIN,
  name: 'Administrator Utama'
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>([DEFAULT_ADMIN]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [bisnis, setBisnis] = useState<Bisnis[]>([]);
  const [submissions, setSubmissions] = useState<BudgetSubmission[]>([]);
  const [limits, setLimits] = useState<BudgetLimit[]>([]);
  const [settings, setSettings] = useState<WebSettings>(() => {
    const saved = localStorage.getItem('katara_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  }, []);

  const loadDataFromDatabase = useCallback(async () => {
    if (!settings.backendUrl) return;
    setIsLoading(true);
    
    // --- UTILITY: Normalisasi Header Kolom ---
    const normalizeRow = (row: any) => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (cleanKey === 'id') newRow.id = row[key];
        else if (cleanKey === 'username' || cleanKey === 'user' || cleanKey === 'pengguna') newRow.username = row[key];
        else if (cleanKey === 'password' || cleanKey === 'pass' || cleanKey === 'sandi' || cleanKey === 'katasandi') newRow.password = row[key];
        else if (cleanKey === 'name' || cleanKey === 'nama' || cleanKey === 'fullname') newRow.name = row[key];
        else if (cleanKey === 'role' || cleanKey === 'peran' || cleanKey === 'jabatan' || cleanKey === 'akses') newRow.role = row[key];
        else if (cleanKey === 'departmentid' || cleanKey === 'deptid' || cleanKey === 'iddept' || cleanKey === 'department') newRow.departmentId = row[key];
        else if (cleanKey === 'business' || cleanKey === 'bisnis' || cleanKey === 'unitbisnis') newRow.business = row[key];
        else if (cleanKey === 'storeaddress' || cleanKey === 'alamat' || cleanKey === 'lokasi') newRow.storeAddress = row[key];
        else newRow[key] = row[key];
      });
      return newRow;
    };

    // --- UTILITY: Mapping Role Cerdas ---
    const mapRoleSmartly = (rawRole: any): Role => {
      const r = String(rawRole || '').toLowerCase().trim();
      if (r.includes('super') || r === 'admin') return Role.SUPER_ADMIN;
      if (r.includes('finance') || r.includes('keuangan') || r.includes('finansial')) return Role.FINANCE;
      if (r.includes('account') || r.includes('akuntansi') || r.includes('pembukuan')) return Role.ACCOUNTING;
      if (r.includes('direk') || r.includes('director') || r.includes('pimpinan') || r.includes('bos') || r.includes('ceo')) return Role.DIREKSI;
      // Default ke Department
      return Role.DEPARTMENT;
    };

    try {
      const data = await api.fetchAllData(settings.backendUrl);
      if (data) {
        // --- PROSES USERS ---
        const fetchedUsers = (data.users || [])
          .map((u: any) => {
            const norm = normalizeRow(u);
            if (!norm.username) return null;

            return {
              ...u, 
              ...norm, 
              // ID fallback ke username jika kosong
              id: norm.id ? String(norm.id) : `manual-${norm.username}`,
              // Ensure empty string if undefined/null
              departmentId: norm.departmentId ? String(norm.departmentId).trim() : '', 
              business: norm.business ? String(norm.business).trim() : '',
              role: mapRoleSmartly(norm.role),
              username: String(norm.username).trim(),
              password: norm.password ? String(norm.password).trim() : ''
            };
          })
          .filter(Boolean);

        // --- PROSES DEPARTMENTS ---
        const fetchedDepts = (data.departments || [])
          .map((d: any) => {
            const norm = normalizeRow(d);
            if (!norm.name) return null;
            return {
              ...d,
              ...norm,
              id: String(norm.id || d.id).trim(),
              name: String(norm.name || d.name).trim()
            };
          })
          .filter(Boolean);

        // --- PROSES BISNIS ---
        const fetchedBisnis = (data.bisnis || [])
          .map((b: any) => {
             const norm = normalizeRow(b);
             if (!norm.name) return null;
             return {
               ...b,
               ...norm,
               id: String(norm.id || b.id).trim(),
               name: String(norm.name || b.name).trim()
             };
          })
          .filter(Boolean);
        
        // --- PROSES LIMITS ---
        const fetchedLimits = (data.limits || []).map((l: any) => {
          const norm = normalizeRow(l);
          
          // Fix format Bulan (Hilangkan ISO time seperti T16:00:00.000Z)
          let cleanMonth = String(norm.month || l.month).trim();
          if (cleanMonth.includes('T')) {
             cleanMonth = cleanMonth.split('T')[0].substring(0, 7); // Ambil YYYY-MM
          }

          return {
             ...l,
             ...norm,
             id: String(norm.id || l.id),
             departmentId: String(norm.departmentId || l.departmentId).trim(),
             month: cleanMonth,
             limitAmount: Number(norm.limitamount || norm.limitAmount || l.limitAmount || 0)
          };
        });
        
        // --- PROSES SUBMISSIONS ---
        const fetchedSubmissions = (data.submissions || []).map((s: any) => {
             const norm = normalizeRow(s);
             
             // Fix format Tanggal (Hilangkan ISO time seperti T16:00:00.000Z)
             let cleanDate = String(norm.date || s.date || '').trim();
             if (cleanDate.includes('T')) {
                 cleanDate = cleanDate.split('T')[0]; // Ambil YYYY-MM-DD
             }

             return {
                 ...s,
                 ...norm,
                 id: String(norm.id || s.id),
                 amount: Number(norm.amount || s.amount),
                 departmentId: String(norm.departmentId || s.departmentId).trim(),
                 date: cleanDate
             };
        });

        setUsers(fetchedUsers.length > 0 ? fetchedUsers : [DEFAULT_ADMIN]);
        setDepartments(fetchedDepts);
        setBisnis(fetchedBisnis);
        setSubmissions(fetchedSubmissions);
        setLimits(fetchedLimits);
        
        if (data.settings && data.settings.backendUrl) {
           setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal sinkronisasi dengan database.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [settings.backendUrl, showToast]);

  useEffect(() => {
    loadDataFromDatabase();
  }, [loadDataFromDatabase]);

  // Sync Handlers
  const handleSetUsers = async (newUsers: React.SetStateAction<User[]>) => {
    const updated = typeof newUsers === 'function' ? (newUsers as any)(users) : newUsers;
    setUsers(updated);
    if (settings.backendUrl) api.saveData(settings.backendUrl, 'Users', updated);
  };

  const handleSetDepartments = async (newDepts: React.SetStateAction<Department[]>) => {
    const updated = typeof newDepts === 'function' ? (newDepts as any)(departments) : newDepts;
    setDepartments(updated);
    if (settings.backendUrl) api.saveData(settings.backendUrl, 'Departments', updated);
  };

  const handleSetSubmissions = async (newSubs: React.SetStateAction<BudgetSubmission[]>) => {
    const updated = typeof newSubs === 'function' ? (newSubs as any)(submissions) : newSubs;
    setSubmissions(updated);
    if (settings.backendUrl) api.saveData(settings.backendUrl, 'Submissions', updated);
  };

  const handleSetLimits = async (newLimits: React.SetStateAction<BudgetLimit[]>) => {
    const updated = typeof newLimits === 'function' ? (newLimits as any)(limits) : newLimits;
    setLimits(updated);
    if (settings.backendUrl) api.saveData(settings.backendUrl, 'Limits', updated);
  };

  const handleSetSettings = async (newSettings: WebSettings) => {
    setSettings(newSettings);
    localStorage.setItem('katara_settings', JSON.stringify(newSettings));
    if (newSettings.backendUrl) {
      api.saveData(newSettings.backendUrl, 'Settings', newSettings);
      showToast('Pengaturan disimpan ke Database');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPath('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPath('dashboard');
  };

  const renderView = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case Role.SUPER_ADMIN:
        if (currentPath === 'dashboard') return <SuperAdminDashboard users={users} depts={departments} />;
        if (currentPath === 'users') return <UserManager users={users} setUsers={handleSetUsers} depts={departments} bisnis={bisnis} showToast={showToast} />;
        if (currentPath === 'departments') return <DeptManager depts={departments} setDepts={handleSetDepartments} showToast={showToast} />;
        if (currentPath === 'settings') return <WebSettingsView settings={settings} setSettings={handleSetSettings} showToast={showToast} />;
        break;

      case Role.DEPARTMENT:
        if (currentPath === 'dashboard') return <DepartmentDashboard submissions={submissions} limits={limits} user={currentUser} />;
        if (currentPath === 'submit') return <BudgetSubmissionView user={currentUser} depts={departments} bisnis={bisnis} setSubmissions={handleSetSubmissions} showToast={showToast} />;
        if (currentPath === 'history') return <BudgetHistoryView user={currentUser} submissions={submissions} setSubmissions={handleSetSubmissions} showToast={showToast} />;
        break;

      case Role.FINANCE:
        if (currentPath === 'dashboard') return <FinanceDashboard submissions={submissions} depts={departments} bisnis={bisnis} />;
        if (currentPath === 'limits') return <LimitBudgetView depts={departments} limits={limits} setLimits={handleSetLimits} showToast={showToast} />;
        if (currentPath === 'submissions') return <FinanceSubmissionsView submissions={submissions} setSubmissions={handleSetSubmissions} depts={departments} limits={limits} showToast={showToast} />;
        if (currentPath === 'status') return <FinanceStatusView submissions={submissions} depts={departments} setSubmissions={handleSetSubmissions} showToast={showToast} />;
        if (currentPath === 'reports') return <ReportsView submissions={submissions} depts={departments} />;
        break;

      case Role.ACCOUNTING:
        if (currentPath === 'dashboard') return <AccountingDashboard submissions={submissions} user={currentUser} />;
        if (currentPath === 'submissions') return <AccountingSubmissionsView submissions={submissions} user={currentUser} depts={departments} />;
        if (currentPath === 'reports') return <ReportsView submissions={submissions} depts={departments} filterBusiness={currentUser.business} />;
        break;

      case Role.DIREKSI:
        if (currentPath === 'dashboard') return <DireksiDashboard submissions={submissions} limits={limits} />;
        if (currentPath === 'submissions') return <DireksiSubmissionsView submissions={submissions} setSubmissions={handleSetSubmissions} depts={departments} showToast={showToast} />;
        break;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <div className="fixed inset-0 bg-white/80 z-[200] flex flex-col items-center justify-center backdrop-blur-sm"><div className="w-12 h-12 border-4 border-[#f68b1f] border-t-transparent rounded-full animate-spin mb-4"></div></div>}
      {!currentUser ? <Login users={users} depts={departments} bisnis={bisnis} settings={settings} onLogin={handleLogin} /> : <Layout user={currentUser} settings={settings} currentPath={currentPath} onPathChange={setCurrentPath} onLogout={handleLogout}>{renderView()}</Layout>}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
