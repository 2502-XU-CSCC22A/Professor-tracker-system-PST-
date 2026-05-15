import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers";
import AddFacultyModal from "../components/AddFacultyModal";
import EditFacultyModal from "../components/EditFacultyModal";
import Toast from "../components/Toast";
import api, { deleteProfessor } from "../api/axios";
import { clearToken, clearUser, getUser } from "../utils/auth";
import { Trash2, Pencil, LogOut, Search, Filter, ChevronDown } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const { professors, loading, refresh } = useUsers();

  const [open, setOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toast, setToast] = useState(null);

  
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const departmentMap = {
    ccs: "College of Computer Studies",
    engineering: "College of Engineering",
    arts_sciences: "College of Arts & Sciences",
    medicine: "School of Medicine",
    nursing: "College of Nursing",
    agriculture: "College of Agriculture",
    education: "College of Education",
    law: "School of Law",
    ADMIN: "ADMIN"
  };

  const departmentColorMap = {
  ccs: { bg: "bg-blue-100", text: "text-blue-700" },
  engineering: { bg: "bg-orange-100", text: "text-orange-700" },
  arts_sciences: { bg: "bg-purple-100", text: "text-purple-700" },
  medicine: { bg: "bg-red-100", text: "text-red-700" },
  nursing: { bg: "bg-pink-100", text: "text-pink-700" },
  agriculture: { bg: "bg-green-100", text: "text-green-700" },
  education: { bg: "bg-yellow-100", text: "text-yellow-700" },
  law: { bg: "bg-indigo-100", text: "text-indigo-700" },
  ADMIN: { bg: "bg-gray-700", text: "text-white" }
};

  const filteredProfessors = professors.filter((prof) => {
    const fullName = `${prof.firstName} ${prof.lastName}`.toLowerCase();
    const username = prof.username?.toLowerCase() || "";

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      username.includes(search.toLowerCase());

    const matchesDept =
      deptFilter === "all" || prof.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  useEffect(() => {
    if (!user || user.department?.toUpperCase() !== "ADMIN") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", { username: user?.username });
    } finally {
      clearToken();
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  const handleRemove = async () => {
    try {
      await deleteProfessor(selectedProf._id);
      showToast("Faculty deleted successfully");
      refresh();
      setIsRemoveOpen(false);
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const welcomeName = `${user?.firstName} ${user?.lastName}` || "Admin";

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="p-6 max-w-7xl mx-auto space-y-10 min-h-screen">

     
        <header className="bg-white rounded-[25px] p-4 flex justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center font-black text-[var(--color-primary)] bg-gray-100 rounded-full">
              {welcomeName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-primary)]">{welcomeName}</h1>
              <span className="text-[10px] font-bold text-gray-400">Administrator</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-red-600">
              <LogOut size={24} />
            </button>
          </div>
        </header>

       
        <div className="flex justify-between items-end">
          <div>
            <p className="font-bold opacity-80 uppercase text-[var(--color-primary)]">Faculty Management</p>
            <h2 className="text-5xl font-black text-[var(--color-primary)] mt-2">
              Welcome, {user?.firstName}
            </h2>
          </div>
        </div>

      
        <div className="flex flex-col md:flex-row gap-3 items-center">

        
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-[var(--color-surface)] border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

      
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="appearance-none pl-10 pr-12 py-3 rounded-full bg-[var(--color-surface)] border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium"
            >
              <option value="all">All Departments</option>
              <option value="ccs">College of Computer Studies</option>
              <option value="engineering">College of Engineering</option>
              <option value="arts_sciences">College of Arts & Sciences</option>
              <option value="medicine">School of Medicine</option>
              <option value="nursing">College of Nursing</option>
              <option value="agriculture">College of Agriculture</option>
              <option value="education">College of Education</option>
              <option value="law">School of Law</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

        </div>

    
        <section className="bg-white rounded-[35px] p-8 shadow-2xl overflow-hidden border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-2xl text-[var(--color-primary)]">
              Active Faculty Accounts
            </h3>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-gray-400">
                  Total Accounts
                </p>
                <p className="text-3xl font-black text-[var(--color-primary)]">
                  {loading ? "..." : professors.length}
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg font-bold"
              >
                Add Faculty
              </button>
            </div>
          </div>
          

          <table className="w-full">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b">
                <th className="text-left pb-4">Username</th>
                <th className="text-left pb-4">Full Name</th>
                <th className="text-center pb-4">Department</th>
                <th className="text-right pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredProfessors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    No faculty found
                  </td>
                </tr>
              ) : (
                filteredProfessors.map((prof) => (
                  <tr key={prof._id} className="hover:bg-gray-50">
                    <td className="py-5 text-blue-600 font-bold">{prof.username}</td>

                    <td className="py-5 font-bold">
                      {prof.firstName} {prof.lastName}
                    </td>

                    <td className="py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase font-semibold ${departmentColorMap[prof.department]?.bg || 'bg-gray-100'} ${departmentColorMap[prof.department]?.text || 'text-gray-700'}`}>
                        {departmentMap[prof.department] || prof.department}
                      </span>
                    </td>

                    <td className="py-5 text-right space-x-3">
                      <button onClick={() => { setSelectedProf(prof); setIsEditOpen(true); }}>
                        <Pencil size={18} />
                      </button>

                      <button onClick={() => { setSelectedProf(prof); setIsRemoveOpen(true); }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

   
      <AddFacultyModal open={open} onClose={() => setOpen(false)} onSuccess={refresh} showToast={showToast} />
      <EditFacultyModal open={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={refresh} selectedProf={selectedProf} showToast={showToast} />

    
      {isRemoveOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold">Delete Faculty?</h3>
            <p className="text-gray-500 mt-2">
              This will remove {selectedProf?.firstName} {selectedProf?.lastName}
            </p>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setIsRemoveOpen(false)} className="flex-1 py-2 bg-gray-200 rounded-xl">
                Cancel
              </button>
              <button onClick={handleRemove} className="flex-1 py-2 bg-red-500 text-white rounded-xl">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
