import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { clearToken, clearUser, getUser } from "../utils/auth";
import useSchedules from "../hooks/useSchedules";
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  Plus,
  LogOut,
} from "lucide-react";
import ScheduleModal from "../components/ScheduleModal";
import ScheduleEditModal from "../components/ScheduleEditModal";
import { formatScheduleTimeRange, parseScheduleTimeRange } from "../utils/scheduleTime";

const formatDepartment = (department = "") =>
  String(department)
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeScheduleType = (type = "") => (String(type).trim().toLowerCase() === "lab" ? "lab" : "lecture");
const formatScheduleType = (type = "") => (normalizeScheduleType(type) === "lab" ? "Lab" : "Lecture");

const DAY_SEQUENCE = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_ORDER_MAP = DAY_SEQUENCE.reduce((map, day, index) => {
  map[day] = index;
  return map;
}, {});

const getDayOrder = (day = "") => {
  const normalizedDay = String(day).trim().toLowerCase();
  return DAY_ORDER_MAP[normalizedDay] ?? DAY_SEQUENCE.length;
};

const getScheduleStartMinutes = (time = "") => {
  const { startTime } = parseScheduleTimeRange(time);
  if (!startTime) return Number.MAX_SAFE_INTEGER;

  const [hourStr = "0", minuteStr = "0"] = startTime.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return Number.MAX_SAFE_INTEGER;
  return (hour * 60) + minute;
};

const ProfessorPage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const { schedules, loading, refresh } = useSchedules();
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", { username: user?.username });
    } catch {
      // ignore server errors on logout
    } finally {
      clearToken();
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Professor";
  const welcomeName = user?.firstName || user?.username || "there";
  const departmentName = formatDepartment(user?.department || "Sciences");
  const sortedSchedules = useMemo(
    () => [...schedules].sort((a, b) => {
      const dayOrderDiff = getDayOrder(a?.day) - getDayOrder(b?.day);
      if (dayOrderDiff !== 0) return dayOrderDiff;

      const startTimeDiff = getScheduleStartMinutes(a?.time) - getScheduleStartMinutes(b?.time);
      if (startTimeDiff !== 0) return startTimeDiff;

      return String(a?.subject || "").localeCompare(String(b?.subject || ""));
    }),
    [schedules],
  );
  const typeTotals = useMemo(
    () => schedules.reduce(
      (totals, item) => {
        const normalizedType = normalizeScheduleType(item?.type);
        totals[normalizedType] += 1;
        return totals;
      },
      { lab: 0, lecture: 0 },
    ),
    [schedules],
  );

  return (
    <div className="min-h-screen bg-[#eef1f8] p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center border border-gray-50">
          <div className="flex items-center gap-6">

            <div>
              <h1 className="text-3xl font-bold text-[#14234b]">{displayName}</h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1 mb-2 text-sm">
                <Building2 size={16} />
                <span>Department of {departmentName}</span>
              </div>
              <span className="bg-[#e4ebfa] text-[#4a6bdf] px-3 py-1 rounded-full text-xs font-semibold">
                Tenured Professor
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end mt-4 md:mt-0">
            <div className="bg-gray-100/80 rounded-full p-1.5 flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 tracking-wider pl-3">STATUS</span>
              <div className="bg-[#e2f5ea] text-[#1f9254] px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#1f9254]"></div>
                On Campus
              </div>
            </div>
            <span className="text-[11px] text-gray-400 italic mt-2 pr-2">Last sync: 2 minutes ago</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-bold text-[#14234b] mb-2 font-serif tracking-tight">
              Welcome Back, {welcomeName}!
            </h2>
            <p className="text-gray-600 text-sm">
              It's a bright day at the Xavier Main Campus. Here is your overview for today.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white hover:bg-red-50 text-[#14234b] hover:text-red-600 px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 transition-all font-semibold text-sm"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#14234b]">My Schedule</h3>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar size={18} />
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>

            <div className="space-y-0 relative">
              {!loading && sortedSchedules.length > 0 && (
                <div className="absolute left-[39px] top-2 bottom-6 w-px bg-gray-200"></div>
              )}

              {loading ? (
                <p className="text-gray-400 text-sm text-center py-8">Loading schedules...</p>
              ) : sortedSchedules.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No schedules yet. Add one to get started.</p>
              ) : (
                sortedSchedules.map((item, index) => (
                  <div key={item._id || index} className="flex gap-8 relative pb-8 last:pb-0">
                    <div className="w-16 pt-3 text-sm font-bold text-gray-600 shrink-0 bg-white z-10">
                      {formatScheduleTimeRange(item.time)}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSchedule(item)}
                      className="flex-1 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-100 bg-white transition-all text-left hover:border-[#14234b]/30 hover:shadow-sm"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-[#14234b] mb-2">{item.subject}</h4>
                        <div className="flex gap-5 text-gray-500 text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-gray-400" />
                            {item.room}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            {item.day} | {formatScheduleType(item.type)}
                          </span>
                        </div>
                      </div>

                      <span className="mt-3 md:mt-0 text-[10px] font-bold px-2.5 py-1 rounded tracking-wide bg-gray-100 text-gray-500">
                        SCHEDULED
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {schedules.length > 3 && (
              <button className="w-full mt-6 pt-6 flex items-center justify-center gap-1 text-[#14234b] font-bold text-sm hover:text-blue-700 transition-colors">
                Expand Full Schedule
                <ChevronDown size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center justify-center gap-3 text-[#14234b] font-bold text-lg hover:shadow-md transition-shadow"
            >
              <Calendar size={22} className="text-[#14234b]" />
              Add Schedule
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 flex relative">
              <div className="flex-1 p-6 text-center border-r border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">LABS</p>
                <p className="text-4xl font-bold text-[#14234b]">{String(typeTotals.lab).padStart(2, "0")}</p>
              </div>
              <div className="flex-1 p-6 text-center">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2">LECTURE</p>
                <p className="text-4xl font-bold text-[#14234b]">{String(typeTotals.lecture).padStart(2, "0")}</p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="absolute -bottom-4 -right-4 bg-[#fdbd21] hover:bg-[#eeb11d] text-white p-4 rounded-2xl shadow-lg transition-transform hover:scale-105 border-4 border-[#eef1f8]"
              >
                <Plus size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ScheduleModal
          onClose={() => setShowModal(false)}
          onSuccess={refresh}
        />
      )}

      {selectedSchedule && (
        <ScheduleEditModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
};

export default ProfessorPage;
