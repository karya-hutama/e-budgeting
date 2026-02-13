
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { User, Department } from '../../types';

interface Props {
  users: User[];
  depts: Department[];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const SuperAdminDashboard: React.FC<Props> = ({ users, depts }) => {
  const userStats = React.useMemo(() => {
    const roles = users.reduce((acc: any, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Statistik Peran User</h3>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={userStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 p-6 rounded-xl shadow-md text-white">
            <div className="text-3xl font-bold">{users.length}</div>
            <div className="text-indigo-100 text-sm">Total User</div>
          </div>
          <div className="bg-emerald-600 p-6 rounded-xl shadow-md text-white">
            <div className="text-3xl font-bold">{depts.length}</div>
            <div className="text-emerald-100 text-sm">Total Departemen</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
            <h4 className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Aktivitas Terbaru</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Admin login baru saja</span>
                <span className="text-gray-400 ml-auto">1m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Departemen baru ditambahkan: HR</span>
                <span className="text-gray-400 ml-auto">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
