import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";

const SearchIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


const ChevronDownIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export default function MainPage() {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ccs");
  const [professorList, setProfessorList] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [allProfessors, setAllProfessors] = useState([]);

  const ROW_HEIGHT = 80;

  const times = [
    "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
    "7:00 PM", "8:00 PM",
  ];

  const days = [
    "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
  ];

  const timeToMinutes = (time = "") => {
     const clean = time.trim().toLowerCase();
     const match = clean.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
     if (!match) return 0;
      let hour = Number(match[1]);
      const minute = Number(match[2]);
       const suffix = match[3];

    if (suffix === "pm" && hour !== 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;
    return hour * 60 + minute;
};

  const formatTime = (time) => {
   let [hour, minute] = time.split(":").map(Number);
   const suffix = hour >= 12 ? "PM" : "AM";
   hour = hour % 12 || 12;
   return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
  };

  const formatTimeRange = (range) => {
   const [start, end] = range.split("-").map((t) => t.trim());
   return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const gridTimeToMinutes = (time) => {
    const [hourPart, suffix] = time.split(" ");
    let hour = Number(hourPart.split(":")[0]);

    if (suffix === "PM" && hour !== 12) hour += 12;
    if (suffix === "AM" && hour === 12) hour = 0;

    return hour * 60;
  };

  const getCardStyle = (item) => {
   const scheduleStart = timeToMinutes(item.startTime);
   const scheduleEnd = timeToMinutes(item.endTime);
   const startHour = Math.floor(scheduleStart / 60) * 60;
   const minutesFromHourStart = scheduleStart - startHour;
   const duration = scheduleEnd - scheduleStart;
   return {
     top: `${(minutesFromHourStart / 60) * ROW_HEIGHT + 6}px`,
     height: `${Math.max((duration / 60) * ROW_HEIGHT - 12, 70)}px`,
   };
  };

  const fetchAllProfessors = async () => {
    if (allProfessors.length > 0) return;

   try {
     const departments = [
       "ccs",
       "engineering",
       "arts_sciences",
       "medicine",
       "nursing",
       "agriculture",
       "education",
       "law",
     ];

    const responses = await Promise.all(
      departments.map((dept) => api.get(`/users/department/${dept}`))
    );

    const formatted = responses.flatMap((res) =>
      res.data.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
      }))
    );

    setAllProfessors(formatted);

  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await api.get(`/users/department/${selectedDepartment}`);

        const formatted = res.data.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
        }));

        setProfessorList(formatted);


        if (formatted.length > 0) {
           setSelectedProfessor(formatted[0].name);
        } else {
          setSelectedProfessor("");
          setScheduleData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfessors();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchProfessorSchedule = async () => {
      if (!selectedProfessor) return;

      try {
        const res = await api.get(`/schedules/public/search?name=${encodeURIComponent(selectedProfessor)}`);
        const formatted = res.data.schedules.map((item) => ({
          day: item.day.toUpperCase(),
          startTime: item.time.split("-")[0].trim(),
          endTime: item.time.split("-")[1].trim(),
          professor: selectedProfessor,
          subject: item.subject,
          timeRange: formatTimeRange(item.time),
          room: `${item.room} (${item.type.toUpperCase()})`,
          color: item.type === "lab" ? "bg-[#4F8CFF]" : "bg-[#5667A6]",
          text: "text-white",
        }));

        setScheduleData(formatted);
      } catch (error) {
        console.log(error);
        setScheduleData([]);
      }
    };

    fetchProfessorSchedule();
  }, [selectedProfessor]);


  const getScheduleItem = (day, time) => {
    const slotStart = gridTimeToMinutes(time);
    const slotEnd = slotStart + 60;

    return scheduleData.find((item) => {
      if (item.day !== day) return false;

      const scheduleStart = timeToMinutes(item.startTime);

      return scheduleStart >= slotStart && scheduleStart < slotEnd;
    });
  };

  const searchSuggestions = allProfessors.filter((professor) =>
  professor.name.toLowerCase().includes(searchName.toLowerCase().trim())
);

  const handleSearch = () => {
    const normalized = searchName.trim().replace(/\s+/g, " ");
    if (!normalized) return;
    navigate(`/search-professor?name=${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 flex flex-col">
       <header className="w-full bg-white/95 backdrop-blur border-b border-[#D8E2F0] shadow-sm relative z-[9999]">
  <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-2">
    <div className="flex items-center gap-6">
      <div className="shrink-0 min-w-[140px]" />
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="flex items-center w-full bg-white rounded-2xl border border-[#D8E2F0] shadow-sm overflow-hidden">
            <div className="flex items-center flex-1 px-4 py-3">
              <SearchIcon className="w-5 h-5 text-[#667085]" />
              <input
                type="text"
                placeholder="FirstName LastName"
                value={searchName}
                onChange={(e) => {setSearchName(e.target.value);fetchAllProfessors();}}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-[#1F2937] placeholder-[#667085]"/>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="self-stretch bg-[var(--color-primary)] hover:bg-[#274B78] text-white font-semibold text-sm px-7 border-l border-[#D8E2F0]">
              Search
            </button>
          </div>
          {searchName && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#D8E2F0] rounded-xl shadow-lg z-[9999] max-h-40 overflow-y-auto">
              {searchSuggestions.map((professor) => (
                <button
                  key={professor.username}
                  type="button"
                  onClick={() => {
                    setSearchName(professor.name);
                    navigate(`/search-professor?name=${encodeURIComponent(professor.name)}`);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                  {professor.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end justify-center min-w-[140px]">
        <span className="text-sm font-medium text-[#667085] mb-1">
          A professor?
        </span>
        <button
          onClick={() => navigate("/login")}
          className="bg-white hover:bg-[#F0F4FA] text-[var(--color-primary)] border border-[#D8E2F0] font-semibold text-sm px-5 py-2 rounded-xl shadow-sm"
        >
          Login
        </button>

      </div>

    </div>
  </div>
</header>
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-10 pt-6 pb-12 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] uppercase tracking-tight">
            THIS WEEK&apos;S SCHEDULES
          </h1>

          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none bg-white text-[var(--color-primary)] border border-[#9caecb] px-4 py-1.5 pr-10 rounded-md font-bold text-sm shadow-sm w-full"
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
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
              className="appearance-none bg-white hover:bg-gray-50 text-[var(--color-primary)] border border-gray-300 pl-4 pr-10 py-1.5 rounded-md font-bold text-sm shadow-sm min-w-[140px] max-w-[260px] truncate"
            >
              {professorList.length === 0 ? (
                <option value="">No Professors</option>
              ) : (
                professorList.map((professor) => (
                  <option key={professor.username} value={professor.name}>
                     {professor.name}
                   </option>
                ))
              )}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="rounded-xl shadow-md border border-gray-300 overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-[var(--color-primary)] border-b-2 border-[#2A4D78]">
              <div className="p-4 flex items-center justify-center text-sm font-bold text-[#FBFBFB] border-r border-[#2A4D78] uppercase">
                TIME
              </div>

              {days.map((day) => (
                <div
                  key={day}
                  className="p-4 text-center text-sm font-bold text-[#FBFBFB] border-r border-[#2A4D78] last:border-r-0 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex flex-col bg-gray-50/30">
              {times.map((time) => (
                <div
                  key={time}
                  className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-[#D8E2F0] bg-[#FBFBFB] last:border-b-0"
                  style={{ minHeight: `${ROW_HEIGHT}px` }}
                >
                  <div className="p-3 flex items-center justify-center text-[13px] font-bold text-gray-600 border-r border-[#D8E2F0] ">
                    {time}
                  </div>

                  {days.map((day) => {
                    const item = getScheduleItem(day, time);

                    return (
                      <div
                        key={`${day}-${time}`}
                        className="border-r border-[#D8E2F0] last:border-r-0 p-1.5 relative overflow-visible bg-[#EEF4FF] hover:bg-[#E0EBFF]"
                        style={{ minHeight: `${ROW_HEIGHT}px` }}
                      >
                        {item && (
                          <div
                            style={getCardStyle(item)}
                            onClick={() => setSelectedSchedule(item)}
                            className={`
                              ${item.color} ${item.text}
                              absolute left-1.5 right-1.5 rounded-lg px-2 py-1 shadow-sm z-10
                              flex flex-col items-center justify-center text-center gap-1 cursor-pointer`}>

                            <div className="font-bold text-[12px] leading-tight truncate w-full">
                              {item.professor}
                            </div>

                            <div className="text-[10px] leading-tight truncate w-full">
                              {item.timeRange}
                            </div>

                            <div className="text-[10px] font-semibold leading-tight truncate w-full">
                              {item.subject}
                            </div>

                            <div className="text-[10px] font-semibold leading-tight truncate w-full">
                              {item.room}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-xl relative">
            <button
             onClick={() => setSelectedSchedule(null)}
             className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>
          <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">Schedule Detail</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Professor:</strong> {selectedSchedule.professor}</p>
          <p><strong>Subject:</strong> {selectedSchedule.subject}</p>
          <p><strong>Time:</strong> {selectedSchedule.timeRange}</p>
          <p><strong>Room:</strong> {selectedSchedule.room}</p>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}
