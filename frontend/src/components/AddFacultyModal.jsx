import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { createProfessor } from "../api/axios"; 

const AddFacultyModal = ({ open, onClose, onSuccess, showToast }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = showToast || (() => {});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    department: 'ccs',
  });

  useEffect(() => {
    if (isAdmin) {
      setFormData(prev => ({ ...prev, department: 'ADMIN' }));
    } else {
      setFormData(prev => ({ ...prev, department: 'ccs' }));
    }
  }, [isAdmin]);

  const isPasswordValid = formData.password.length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast("Password must be at least 10 characters", "error");
      return;
    }

    setLoading(true);

    try {
      await createProfessor(formData);

      toast("Account created successfully", "success");
      onSuccess();
      onClose();

      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        department: 'ccs'
      });
      setIsAdmin(false);

    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "";

      if (status === 409) {
        toast(message, "error");
      } else if (status === 400) {
        toast(message || "Invalid input", "error");
      } else {
        toast("Server error. Please try again.", "error");
      }

    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">

        <div className="p-6 pb-0 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-600" />
          </button>

          <div className="flex flex-col items-center">
            <div className="bg-blue-50 p-3 rounded-2xl mb-2">
              <UserPlus className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="w-10" />
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">
            New User Account
          </h2>

          <p className="text-slate-500 text-center text-sm mb-8">
            Fill in the credentials for the new faculty member.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">


            <div className="flex gap-3">

              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input
                    className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  Last Name
                </label>
                <input
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>

            </div>

          
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Username
              </label>
              <input
                className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

           
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="email"
                  className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

          
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Password (min 10 chars)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="password"
                  className={`w-full pl-11 p-4 rounded-2xl outline-none border transition-all ${
                    formData.password.length > 0 && !isPasswordValid
                      ? 'border-red-300 bg-red-50'
                      : 'border-transparent bg-slate-50 focus:border-blue-500 focus:bg-white'
                  }`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

           
            <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <div className={`w-10 h-5 rounded-full ${isAdmin ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full ${isAdmin ? 'translate-x-5' : ''}`}></div>
                </div>

                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ShieldCheck size={16} className={isAdmin ? 'text-blue-600' : 'text-slate-400'} />
                  Assign as Administrator
                </span>
              </label>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  Department
                </label>

                <select
                  className={`w-full p-3 rounded-xl border ${
                    isAdmin
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={isAdmin}
                >
                  {!isAdmin ? (
                    <>
                      <option value="ccs">College of Computer Studies</option>
                      <option value="engineering">College of Engineering</option>
                      <option value="arts_sciences">College of Arts & Sciences</option>
                      <option value="medicine">School of Medicine</option>
                      <option value="nursing">College of Nursing</option>
                      <option value="agriculture">College of Agriculture</option>
                      <option value="education">College of Education</option>
                      <option value="law">School of Law</option>
                    </>
                  ) : (
                    <option value="ADMIN">ADMIN</option>
                  )}
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={!isPasswordValid || loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                isPasswordValid && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyModal;