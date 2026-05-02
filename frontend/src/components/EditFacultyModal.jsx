import React, { useState, useEffect } from 'react';
import { updateProfessor } from "../api/axios";
import { ArrowLeft, Edit3, User, Briefcase, Mail } from "lucide-react";

const EditFacultyModal = ({ open, onClose, onSuccess, selectedProf, showToast }) => {
  const [loading, setLoading] = useState(false);

  const toast = showToast || (() => {});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    if (selectedProf) {
      setFormData({
        firstName: selectedProf.firstName || '',
        lastName: selectedProf.lastName || '',
        username: selectedProf.username || '',
        email: selectedProf.email || '',              
        department: selectedProf.department || ''
      });
    }
  }, [selectedProf]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department) {
      toast("Please select a department", "error");
      return;
    }

    if (
      formData.firstName === selectedProf.firstName &&
      formData.lastName === selectedProf.lastName &&
      formData.username === selectedProf.username &&
      formData.email === selectedProf.email &&         
      formData.department === selectedProf.department
    ) {
      toast("No changes made", "info");
      return;
    }

    setLoading(true);

    try {
      await updateProfessor(selectedProf._id, formData);

      toast("Faculty updated successfully", "success");
      onSuccess();
      onClose();

    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "";

      if (status === 409) {
        toast(message, "error");
      } else if (status === 400) {
        toast(message || "Invalid input", "error");
      } else {
        toast("Update failed. Please try again.", "error");
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

          <div className="bg-amber-50 p-3 rounded-2xl">
            <Edit3 className="text-amber-600" size={24} />
          </div>

          <div className="w-10" />
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">
            Edit Faculty Member
          </h2>

          <p className="text-slate-500 text-center text-sm mb-8">
            Update the profile information below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

        
            <div className="flex gap-3">

              <div className="flex-1">
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input
                    className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white outline-none transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Last Name
                </label>
                <input
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white outline-none transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

         
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white outline-none transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

        
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="email"
                  className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

        
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Department
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 text-slate-400" size={18} />
                <select
                  className="w-full pl-11 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="ccs">College of Computer Studies</option>
                  <option value="engineering">College of Engineering</option>
                  <option value="arts_sciences">College of Arts & Sciences</option>
                  <option value="medicine">School of Medicine</option>
                  <option value="nursing">College of Nursing</option>
                  <option value="agriculture">College of Agriculture</option>
                  <option value="education">College of Education</option>
                  <option value="law">School of Law</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] py-4 rounded-2xl font-bold text-white transition-all ${
                  loading
                    ? "bg-amber-300 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-100 active:scale-[0.98]"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyModal;