import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const AdminPage = () => {
  const stats = [
    { label: 'TOTAL FACULTY', value: '342', detail: '+12% from last sem', detailColor: 'text-green-500', icon: true },
    { label: 'ACTIVE RESEARCH', value: '87', progress: 87, detail: null },
    { label: 'DEPARTMENTS', value: '14', detail: 'Across 4 Colleges', detailColor: 'text-gray-400' },
    { label: 'PENDING REVIEWS', value: '08', detail: 'Priority: High', detailColor: 'text-red-600', borderLeft: 'border-l-4 border-red-800' },
  ];

  const faculty = [
    { id: 'XU-2023-0042', name: 'Dr. Julianne Alvarez', email: 'julianne.alvarez@xavier.edu.ph', dept: 'Computer Science', status: 'PERMANENT', initial: 'JA', color: 'bg-blue-100 text-blue-600' },
    { id: 'XU-2018-0115', name: 'Prof. Ricardo Mercado', email: 'r.mercado@xavier.edu.ph', dept: 'Humanities', status: 'ON LEAVE', initial: 'RM', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'XU-2020-0089', name: 'Dr. Elena Lopez-Tan', email: 'etan@xavier.edu.ph', dept: 'School of Medicine', status: 'PERMANENT', initial: 'EL', color: 'bg-red-100 text-red-600' },
    { id: 'XU-2022-0312', name: 'Engr. Mateo Bautista', email: 'mbautista@xavier.edu.ph', dept: 'Engineering', status: 'PROBATIONARY', initial: 'MB', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {}
      <nav className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-[#1a2b56] tracking-tight">Xavier Scholastica</h1>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <button className="text-[#1a2b56] border-b-2 border-yellow-500 pb-1">Overview</button>
            <button className="hover:text-slate-600">Faculty</button>
            <button className="hover:text-slate-600">Departments</button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty records..." 
              className="bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-4 text-slate-500 border-l pl-6">
            <Bell size={20} className="cursor-pointer hover:text-slate-800" />
            <Settings size={20} className="cursor-pointer hover:text-slate-800" />
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden cursor-pointer">
              <img src="/api/placeholder/32/32" alt="Admin" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-bold text-[#1a2b56] mb-2">Admin Dashboard</h2>
            <p className="text-slate-500">Welcome Back, @Admin. Here is the latest faculty overview.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#e2e6f0] text-[#1a2b56] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-300 transition-colors uppercase tracking-wider">
              Download Report
            </button>
            <button className="bg-[#fdbd21] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors uppercase tracking-wider">
              Add New Professor
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 ${stat.borderLeft || 'border-l-4 border-l-[#1a2b56]'}`}>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-3 uppercase">{stat.label}</p>
              <h3 className="text-4xl font-bold text-[#1a2b56] mb-2">{stat.value}</h3>
              {stat.icon && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-green-500">
                  <TrendingUp size={14} /> {stat.detail}
                </div>
              )}
              {stat.progress && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-yellow-500 h-full w-[87%]"></div>
                </div>
              )}
              {stat.detail && !stat.icon && (
                <p className={`text-[11px] font-bold ${stat.detailColor}`}>{stat.detail}</p>
              )}
            </div>
          ))}
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold text-[#1a2b56]">Active Faculty Accounts</h4>
              <p className="text-slate-400 text-sm">Managing current active academic personnel</p>
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              FILTER BY DEPARTMENT <ChevronDown size={16} />
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faculty.map((person, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${person.color}`}>
                        {person.initial}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2b56]">{person.name}</p>
                        <p className="text-xs text-slate-400">{person.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium tabular-nums">
                    {person.id}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">
                    {person.dept}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                      person.status === 'PERMANENT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      person.status === 'ON LEAVE' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-10">
                    <div className="flex justify-end gap-3 text-slate-400">
                      <button className="hover:text-blue-600 transition-colors"><Pencil size={18} /></button>
                      <button className="hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {}
          <div className="px-6 py-6 border-t border-slate-100 flex justify-between items-center bg-white">
            <p className="text-sm text-slate-400 font-medium">Showing 1 to 4 of 342 entries</p>
            <div className="flex gap-1">
              <button className="p-2 border rounded hover:bg-slate-50 text-slate-400 transition-colors"><ChevronLeft size={16}/></button>
              <button className="w-10 h-10 bg-[#1a2b56] text-white rounded font-bold text-sm">1</button>
              <button className="w-10 h-10 hover:bg-slate-50 text-slate-600 rounded font-bold text-sm">2</button>
              <button className="w-10 h-10 hover:bg-slate-50 text-slate-600 rounded font-bold text-sm">3</button>
              <button className="p-2 border rounded hover:bg-slate-50 text-slate-400 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;