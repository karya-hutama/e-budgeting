
import React from 'react';
import { BudgetSubmission, User, Department, BudgetStatus } from '../../types';
import { Building, Calendar, MapPin } from 'lucide-react';

interface Props {
  submissions: BudgetSubmission[];
  user: User;
  depts: Department[];
}

const AccountingSubmissionsView: React.FC<Props> = ({ submissions, user, depts }) => {
  const businessSubmissions = submissions.filter(s => s.business === user.business);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800">Monitoring - {user.business}</h3>
          <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Disetujui
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-100">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Menunggu
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Ditolak
            </div>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="space-y-4 md:hidden">
          {businessSubmissions.map(s => (
            <div key={s.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div className="text-sm font-black text-gray-900">Rp {s.amount.toLocaleString()}</div>
                <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
                  s.status.includes('Disetujui') ? 'bg-emerald-100 text-emerald-700' :
                  s.status.includes('Ditolak') ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600">
                <MapPin size={10} /> {s.location}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 italic font-medium">"{s.note}"</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Building size={10} /> {depts.find(d => d.id === s.departmentId)?.name}
                </div>
                <div className="flex items-center gap-1">
                  {/* Format DD/MM/YYYY */}
                  <Calendar size={10} /> {s.date.split('T')[0].split('-').reverse().join('/')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tgl / Dept</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lokasi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Keterangan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nominal</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {businessSubmissions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {/* Format DD/MM/YYYY */}
                    <div className="text-sm font-bold text-gray-900">{s.date.split('T')[0].split('-').reverse().join('/')}</div>
                    <div className="text-xs text-gray-500 uppercase font-bold">{depts.find(d => d.id === s.departmentId)?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                      <MapPin size={14} /> {s.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-[200px] truncate" title={s.note}>{s.note}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-800">
                    Rp {s.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                      s.status.includes('Disetujui') ? 'bg-emerald-100 text-emerald-700' :
                      s.status.includes('Ditolak') ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {businessSubmissions.length === 0 && (
          <div className="py-12 text-center text-gray-400 italic text-sm">
            Belum ada pengajuan untuk bisnis ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingSubmissionsView;
