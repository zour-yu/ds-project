import React, { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../../auth/services/authService';
import { 
  Users, 
  UserCog, 
  Calendar, 
  Activity, 
  TrendingUp, 
  FileText,
  Search,
  Plus,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((data) => {
      setUser(data?.user || null);
    });
    return () => unsub();
  }, []);

  const stats = [
    { label: 'Total Patients', value: '1,245', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500', trend: '+5.2%' },
    { label: 'Active Doctors', value: '48', icon: <UserCog className="w-5 h-5" />, color: 'bg-emerald-500', trend: '+2.1%' },
    { label: 'Total Appointments', value: '3,892', icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-500', trend: '+12.3%' },
    { label: 'System Alerts', value: '02', icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-rose-500', trend: '-1.5%' },
  ];

  const recentRegistrations = [
    { name: 'Michael Johnson', type: 'Patient', time: '10:30 AM', date: 'Today' },
    { name: 'Dr. Emily Carter', type: 'Doctor', time: '09:15 AM', date: 'Today' },
    { name: 'Sarah Williams', type: 'Patient', time: '04:45 PM', date: 'Yesterday' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.displayName || 'Administrator'}! System overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users, IDs..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <ShieldCheck className="w-4 h-4" /> <span>Manage Access</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                </div>
              </div>
              <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} w-[60%] opacity-80`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Activity/Registrations */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">Recent Registrations</h2>
            <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-700">View All</button>
          </div>
          <div className="p-4">
            {recentRegistrations.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold ${user.type === 'Doctor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.name.split(' ')[0].charAt(0)}{user.name.split(' ').length > 1 ? user.name.split(' ')[1].charAt(0) : ''}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{user.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{user.type} Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm justify-end">
                      <Clock className="w-3.5 h-3.5 text-blue-500" /> {user.time}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.date}</div>
                  </div>
                  <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: System Health Snapshot */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black italic tracking-tighter">System Logs</h2>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold">LIVE</span>
          </div>
          <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            <SystemLog 
              title="Database Backup" 
              time="1 hour ago" 
              desc="Automated backup completed successfully." 
              completed 
            />
            <SystemLog 
              title="New Doctor Verification" 
              time="3 hours ago" 
              desc="Dr. Carter uploaded verification documents." 
            />
            <SystemLog 
              title="Server Maintenance" 
              time="Yesterday" 
              desc="Routine cleanup and index optimization." 
              completed
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Mini component for System Logs timeline */
const SystemLog = ({ title, time, desc, completed }) => (
  <div className="relative pl-10">
    <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full border-4 border-slate-900 flex items-center justify-center
      ${completed ? 'bg-emerald-500' : 'bg-blue-500'}`}>
      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
    <h4 className="font-bold text-sm tracking-tight text-white mb-0.5">{title}</h4>
    <p className="text-[11px] font-medium text-slate-400 leading-tight">{desc}</p>
    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-2 block">{time}</span>
  </div>
);

export default AdminDashboard;