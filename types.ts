
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEPARTMENT = 'DEPARTMENT',
  FINANCE = 'FINANCE',
  ACCOUNTING = 'ACCOUNTING',
  DIREKSI = 'DIREKSI'
}

// Business sekarang menjadi interface karena diambil dari DB
export interface Bisnis {
  id: string;
  name: string;
}

export enum BudgetStatus {
  PENDING_FINANCE = 'Menunggu Finance',
  PENDING_DIREKSI = 'Menunggu Direksi',
  APPROVED_FINANCE = 'Disetujui Finance',
  APPROVED_DIREKSI = 'Disetujui Direksi',
  REJECTED_FINANCE = 'Ditolak Finance',
  REJECTED_DIREKSI = 'Ditolak Direksi'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  departmentId?: string;
  business?: string; // Menggunakan string nama bisnis
  storeAddress?: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface BudgetSubmission {
  id: string;
  date: string;
  departmentId: string;
  business: string; // Nama bisnis
  amount: number;
  note: string;
  location: string;
  status: BudgetStatus;
  rejectionNote?: string;
  userId: string;
}

export interface BudgetLimit {
  id: string;
  departmentId: string;
  month: string; // YYYY-MM
  limitAmount: number;
}

export interface WebSettings {
  logoUrl: string;
  siteName: string;
  databaseId: string;
  backendUrl: string;
}
