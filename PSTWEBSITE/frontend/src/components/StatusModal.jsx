import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import { getUser } from "../utils/auth";
const STATUSES = [
  { value: "ON", label: "On Campus", bg: "bg-[#e2f5ea]", text: "text-[#1f9254]", dot: "bg-[#1f9254]" },
  { value: "OFF", label: "Off Campus", bg: "bg-[#fef3c7]", text: "text-[#d97706]", dot: "bg-[#d97706]" },
  { value: "CLASS", label: "In Class", bg: "bg-[#e0e7ff]", text: "text-[#4f46e5]", dot: "bg-[#4f46e5]" },
];

const StatusModal = ({ onClose, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#14234b]">Change Status</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-3">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`w-full p-4 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                selectedStatus === status.value? `${status.bg} ${status.text} border-current`: "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              <div className={`w-3 h-3 rounded-full ${selectedStatus === status.value ? status.dot : "bg-gray-300"}`}></div>
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;