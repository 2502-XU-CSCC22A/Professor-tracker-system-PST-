import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SearchIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const MicIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
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
    const times = [
        "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
        "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
    ];
    
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    
    const scheduleData = [
        { day: "WEDNESDAY", time: "9:00 AM", professor: "Mr. Spongebob", timeRange: "9:00 am - 10:00 am", room: "SMB201 (LEC)", color: "bg-[#2c3b5e]", text: "text-white" },
        { day: "SATURDAY", time: "1:00 PM", professor: "Mr. Spongebob", timeRange: "1:00 pm - 2:00 pm", room: "SBM 304 (LEC)", color: "bg-[#2c3b5e]", text: "text-white" },
        
        // Added a few extra classes using our color scheme to make the calendar look complete
        { day: "MONDAY", time: "8:00 AM", professor: "Dr. Patrick", timeRange: "8:00 am - 9:00 am", room: "IT 301 (LAB)", color: "bg-[#ffb627]", text: "text-gray-900" },
        { day: "TUESDAY", time: "10:00 AM", professor: "Mrs. Puff", timeRange: "10:00 am - 11:00 am", room: "CS 202 (LEC)", color: "bg-[#ffb627]", text: "text-gray-900" },
        { day: "FRIDAY", time: "2:00 PM", professor: "Mr. Krabs", timeRange: "2:00 pm - 3:00 pm", room: "BUS 101 (LEC)", color: "bg-[#2c3b5e]", text: "text-white" },
    ];

    const getScheduleItem = (day, time) => {
        return scheduleData.find(item => item.day === day && item.time === time);
    };

    const handleSearch = () => {
        const normalized = searchName.trim().replace(/\s+/g, " ");
        if (!normalized) return;
        navigate(`/search-professor?name=${encodeURIComponent(normalized)}`);
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] font-sans text-gray-800 flex flex-col">
            
            {}
            <header className="w-full px-6 py-6 md:px-10 flex items-start justify-between">
                {}
                <div className="hidden md:block flex-1"></div>
                
                {}
                <div className="flex-1 flex justify-center w-full max-w-2xl px-4">
                    <div className="w-full flex items-center gap-3">
                        <div className="bg-white rounded-full flex items-center w-full px-4 py-2.5 shadow-sm border border-gray-200 focus-within:border-[#2c3b5e] focus-within:ring-1 focus-within:ring-[#2c3b5e] transition-all">
                            <SearchIcon className="w-5 h-5 text-gray-400 ml-2" />
                            <input 
                                type="text" 
                                placeholder="FirstName  LastName" 
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-gray-700 placeholder-gray-400"
                            />
                            <button className="text-gray-400 hover:text-[#2c3b5e] transition-colors pr-2">
                                <MicIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-[#2c3b5e] hover:bg-[#23314f] text-white border border-[#2c3b5e] font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-colors whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {}
                <div className="flex-1 flex flex-col items-end justify-start">
                    <span className="text-sm font-medium text-gray-600 mb-1.5 pr-1">A professor?</span>
                    <button onClick={() => navigate('/login')} className="bg-[#e4e9f0] hover:bg-[#d1d8e4] text-[#2c3b5e] border border-[#cbd5e1] font-semibold text-sm px-5 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-2">
                        Login 
                    </button>
                </div>
            </header>

            {}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-10 pb-12 flex flex-col">
                
                {}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 mt-4">
                    <h1 className="text-2xl md:text-3xl font-black text-[#1a2542] uppercase tracking-tight">
                        THIS WEEK'S SCHEDULES
                    </h1>
                    <button className="bg-[#b3c0d6] hover:bg-[#a0b0cb] text-[#1a2542] border border-[#9caecb] px-4 py-1.5 rounded-md font-bold text-sm flex items-center gap-2 shadow-sm transition-colors w-fit">
                        AGGIES DEPT.
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>

                {}
                <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto flex-1 relative">
                    <div className="min-w-[1000px]">
                        
                        {/* Header Row */}
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-white border-b-2 border-gray-200 sticky top-0 z-20">
                            <div className="p-4 flex items-center justify-center text-sm font-bold text-gray-800 border-r border-gray-200 uppercase tracking-wide">
                                TIME
                            </div>
                            {days.map(day => (
                                <div key={day} className="p-4 text-center text-sm font-bold text-gray-800 border-r border-gray-200 last:border-r-0 uppercase tracking-wide">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {}
                        <div className="flex flex-col bg-gray-50/30">
                            {times.map((time) => (
                                <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-200 last:border-b-0 group">
                                    
                                    {}
                                    <div className="p-3 flex items-center justify-center text-[13px] font-bold text-gray-600 border-r border-gray-200 bg-white group-hover:bg-gray-50 transition-colors">
                                        {time}
                                    </div>

                                    {}
                                    {days.map((day) => {
                                        const item = getScheduleItem(day, time);
                                        return (
                                            <div 
                                                key={`${day}-${time}`} 
                                                className="border-r border-gray-200 last:border-r-0 p-1.5 min-h-[90px] relative transition-colors hover:bg-gray-100/50"
                                            >
                                                {item && (
                                                    <div className={`
                                                        ${item.color} ${item.text} 
                                                        w-full h-full rounded-lg p-3 shadow-sm 
                                                        flex flex-col justify-center
                                                        cursor-pointer transition-transform hover:scale-[1.03] hover:shadow-md
                                                    `}>
                                                        <div className="font-bold text-[13px] leading-tight mb-1 text-center">
                                                            {item.professor}
                                                        </div>
                                                        <div className={`text-[11px] font-medium text-center mb-1 ${item.text === 'text-white' ? 'text-blue-200' : 'text-amber-900'}`}>
                                                            {item.timeRange}
                                                        </div>
                                                        <div className={`text-[11px] font-semibold text-center mt-auto ${item.text === 'text-white' ? 'text-gray-100' : 'text-gray-700'}`}>
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
            </main>
        </div>
    );
}
