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

/**
 * PENTING: Masukkan URL Web App Google Apps Script Anda di sini!
 * Ini akan memastikan semua user otomatis terhubung ke database yang sama.
 */
const MASTER_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzEFtvomi_6ULoWMfkTYDxjqjw50kcSCW9r12KYj9HFRzqblk19ZlYODl2kOrkVZRDe/exec'; // GANTI DENGAN URL ANDA

const INITIAL_SETTINGS: WebSettings = {
  logoUrl: 'https://img.icons8.com/?size=100&id=7991&format=png&color=f68b1f',
  siteName: 'E-Budgeting System',
  databaseId: '',
  backendUrl: MASTER_BACKEND_URL 
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
    const parsed = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    // Selalu paksa gunakan MASTER_BACKEND_URL jika tersedia
    if (MASTER_BACKEND_URL) {
      parsed.backendUrl = MASTER_BACKEND_URL;
    }
    return parsed;
  });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
  }, []);

  const loadDataFromDatabase = useCallback(async () => {
    const targetUrl = settings.backendUrl || MASTER_BACKEND_URL;
    if (!targetUrl) return;

    setIsLoading(true);
    
    const normalizeRow = (row: any) => {
      const newRow: any = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanKey === 'id') newRow.id = row[key];
        else if (cleanKey === 'username' || cleanKey === 'user') newRow.username = row[key];
        else if (cleanKey === 'password' || cleanKey === 'pass') newRow.password = row[key];
        else if (cleanKey === 'name' || cleanKey === 'nama') newRow.name = row[key];
        else if (cleanKey === 'role' || cleanKey === 'peran') newRow.role = row[key];
        else if (cleanKey === 'departmentid' || cleanKey === 'deptid') newRow.departmentId = row[key];
        else if (cleanKey === 'business' || cleanKey === 'bisnis') newRow.business = row[key];
        else if (cleanKey === 'storeaddress' || cleanKey === 'alamat') newRow.storeAddress = row[key];
        else newRow[key] = row[key];
      });
      return newRow;
    };

    const mapRoleSmartly = (rawRole: any): Role => {
      const r = String(rawRole || '').toLowerCase().trim();
      if (r.includes('super') || r === 'admin') return Role.SUPER_ADMIN;
      if (r.includes('finance') || r.includes('keuangan')) return Role.FINANCE;
      if (r.includes('account') || r.includes('akuntansi')) return Role.ACCOUNTING;
      if (r.includes('direk') || r.includes('ceo')) return Role.DIREKSI;
      return Role.DEPARTMENT;
    };

    try {
      const data = await api.fetchAllData(targetUrl);
      if (data) {
        // UPDATE SETTINGS DULU (LOGO & SITE NAME)
        if (data.settings) {
          const dbSettings = { 
            ...settings, 
            ...data.settings, 
            backendUrl: targetUrl // Jangan biarkan backendUrl dari DB kosong
          };
          setSettings(dbSettings);
          localStorage.setItem('katara_settings', JSON.stringify(dbSettings));
        }

        const fetchedUsers = (data.users || []).map((u: any) => {
          const norm = normalizeRow(u);
          return { ...u, ...norm, role: mapRoleSmartly(norm.role) };
        }).filter((u: any) => u.username);

        setUsers(fetchedUsers.length > 0 ? fetchedUsers : [DEFAULT_ADMIN]);
        setDepartments((data.departments || []).map(normalizeRow));
        setBisnis((data.bisnis || []).map(normalizeRow));
        setSubmissions((data.submissions || []).map(normalizeRow));
        setLimits((data.limits || []).map(normalizeRow));
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      showToast('Koneksi database gagal. Periksa URL Apps Script.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [settings.backendUrl, showToast]);

  useEffect(() => {
    loadDataFromDatabase();
  }, [loadDataFromDatabase]);

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
      showToast('Pengaturan disimpan secara Global');
      loadDataFromDatabase();
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
      {isLoading && !currentUser && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#f68b1f] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#f68b1f] font-bold animate-pulse uppercase tracking-widest text-xs">Memuat Database...</p>
        </div>
      )}
      {!currentUser ? (
        <Login users={users} depts={departments} bisnis={bisnis} settings={settings} onLogin={handleLogin} />
      ) : (
        <Layout user={currentUser} settings={settings} currentPath={currentPath} onPathChange={setCurrentPath} onLogout={handleLogout}>
          {renderView()}
        </Layout>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
