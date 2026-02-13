
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  ClipboardList, 
  History, 
  Wallet, 
  FileText,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Role } from './types';

export const BUSINESS_LIST = [
  'Mbah Man',
  'Warung Bakso',
  'Katara Frozen Mart',
  'Katara GO'
];

export const ROLE_LABELS = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.DEPARTMENT]: 'Department',
  [Role.FINANCE]: 'Finance',
  [Role.ACCOUNTING]: 'Accounting',
  [Role.DIREKSI]: 'Direksi'
};

export const MENU_ITEMS = {
  [Role.SUPER_ADMIN]: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { label: 'Manajemen User', icon: <Users className="w-5 h-5" />, path: 'users' },
    { label: 'Manajemen Departemen', icon: <Building2 className="w-5 h-5" />, path: 'departments' },
    { label: 'Manajemen Website', icon: <Settings className="w-5 h-5" />, path: 'settings' },
  ],
  [Role.DEPARTMENT]: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { label: 'Pengajuan Budget', icon: <ClipboardList className="w-5 h-5" />, path: 'submit' },
    { label: 'History Pengajuan', icon: <History className="w-5 h-5" />, path: 'history' },
  ],
  [Role.FINANCE]: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { label: 'Limit Budget', icon: <Wallet className="w-5 h-5" />, path: 'limits' },
    { label: 'Daftar Pengajuan', icon: <ClipboardList className="w-5 h-5" />, path: 'submissions' },
    { label: 'Status Pengajuan', icon: <CheckCircle2 className="w-5 h-5" />, path: 'status' },
    { label: 'Laporan Budget', icon: <FileText className="w-5 h-5" />, path: 'reports' },
  ],
  [Role.ACCOUNTING]: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { label: 'Pengajuan Budget', icon: <ClipboardList className="w-5 h-5" />, path: 'submissions' },
    { label: 'Laporan Budget', icon: <FileText className="w-5 h-5" />, path: 'reports' },
  ],
  [Role.DIREKSI]: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: 'dashboard' },
    { label: 'Pengajuan Budget', icon: <ClipboardList className="w-5 h-5" />, path: 'submissions' },
  ]
};
