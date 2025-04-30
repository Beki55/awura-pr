import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

const daysGregorian = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysEthiopian = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
const sampleEvents = [
  { id: 1, time: "9:24 AM", title: "Order Reschedule Test 2", date: "2025-04-01" },
  { id: 2, time: "5:35 PM", title: "Test Private Event 7", date: "2025-04-15" },
  { id: 3, time: "1:05 AM", title: "Agrofood Ethiopia 2024", date: "2025-04-03" },
  { id: 4, time: "10:57 AM", title: "hhj", date: "2025-04-10" },
  { id: 5, time: "10:05 AM", title: "Private 2.0", date: "2025-04-20" },
  { id: 6, time: "7:43 AM", title: "private event", date: "2025-04-30" },
  { id: 7, time: "9:08 PM", title: "Visit Axum", date: "2025-04-06" },
];

// Ethiopian date conversion functions
const gregorianToEthiopian = (date) => {
  const gregDate = new Date(date);
  const year = gregDate.getFullYear();
  const month = gregDate.getMonth();
  const day = gregDate.getDate();
  
  // Simple conversion (approximation)
  const ethYear = year - 8;
  const ethMonth = month + 1; // Ethiopian months are 1-12
  const ethDay = day;
  
  return { year: ethYear, month: ethMonth, day: ethDay };
};

function App() {
  const [events, setEvents] = useState(sampleEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3)); // April 2025
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ time: "", title: "" });
  const [useEthiopian, setUseEthiopian] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const toggleCalendarSystem = (system) => {
    setUseEthiopian(system === 'ethiopian');
    // setEvents(convertEvents(system === 'ethiopian'));
    setShowCalendarOptions(false);
  };
  // const toggleCalendarSystem = () => {
  //   setUseEthiopian(!useEthiopian);
  // };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMonthName = (month, isEthiopian = false) => {
    if (isEthiopian) {
      const ethMonths = [
        "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", 
        "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", 
        "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
      ];
      return ethMonths[month - 1] || month;
    }
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  };

  const handleDoubleClick = (event) => {
    setEditingEvent(event.id);
    setEditForm({ time: event.time, title: event.title });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === editingEvent
          ? { ...event, time: editForm.time, title: editForm.title }
          : event
      )
    );
    setEditingEvent(null);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const handleDragStart = (e, eventId) => {
    if (editingEvent) return;
    e.dataTransfer.setData("eventId", eventId);
  };

  const handleDrop = (e, day) => {
    if (!day || editingEvent) return;
    
    const eventId = e.dataTransfer.getData("eventId");
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDate(newDate);
    
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === parseInt(eventId) ? { ...event, date: dateString } : event
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const navigateMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    
    return daysArray;
  };

  const calendarDays = renderCalendarDays();

  // Get current display values
  const displayMonth = useEthiopian 
    ? gregorianToEthiopian(currentMonth).month 
    : currentMonth.getMonth() + 1;
  
  const displayYear = useEthiopian 
    ? gregorianToEthiopian(currentMonth).year 
    : currentMonth.getFullYear();

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {getMonthName(displayMonth, useEthiopian)} {displayYear}
        </h2>
        <div className="flex gap-2">
        <div className="relative">
            <button 
              className="px-4 py-2 bg-gray-700 text-white rounded flex items-center gap-1"
              onClick={() => setShowCalendarOptions(!showCalendarOptions)}
            >
              <FiCalendar />
              {/* <span>{useEthiopian ? "Ethiopian" : "Gregorian"}</span> */}
            </button>
            
            {showCalendarOptions && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${!useEthiopian ? 'bg-blue-100' : ''}`}
                  onClick={() => toggleCalendarSystem('gregorian')}
                >
                  Gregorian
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${useEthiopian ? 'bg-blue-100' : ''}`}
                  onClick={() => toggleCalendarSystem('ethiopian')}
                >
                  Ethiopian
                </button>
              </div>
            )}
          </div>
          <button 
            className="px-4 py-2 bg-gray-700 text-white rounded"
            onClick={goToToday}
          >
            today
          </button>
          <button 
            className="px-3 py-2 bg-gray-600 text-white rounded"
            onClick={() => navigateMonth(-1)}
          >
            &lt;
          </button>
          <button 
            className="px-3 py-2 bg-gray-600 text-white rounded"
            onClick={() => navigateMonth(1)}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500 border-b border-slate-200 pb-2">
        {(useEthiopian ? daysEthiopian : daysGregorian).map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={idx}
                className="bg-gray-100 min-h-24"
              />
            );
          }
          
          const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateString = formatDate(currentDate);
          const dayEvents = events.filter(event => event.date === dateString);
          
          return (
            <div
              key={idx}
              className="flex flex-col gap-2 border border-slate-200 p-2 min-h-24"
              onDrop={(e) => handleDrop(e, day)}
              onDragOver={handleDragOver}
            >
              <div className="text-sm font-semibold">
                {useEthiopian ? (
                  <div>
                    <div className="text-md text-center text-gray-400">{gregorianToEthiopian(currentDate).day}</div>
                    {/* <div className="text-xs text-gray-400">{day}</div> */}
                  </div>
                ) : (
                  <div className="text-md text-center text-gray-400">{day}</div>
                )}
              </div>
              {dayEvents.map((event) => (
                editingEvent === event.id ? (
                  <div key={event.id} className="flex flex-col bg-black text-white p-2 rounded text-left text-sm">
                    <input
                      type="text"
                      name="time"
                      value={editForm.time}
                      onChange={handleEditChange}
                      className="bg-gray-800 text-yellow-400 mb-1 p-1"
                    />
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="bg-gray-800 text-white p-1"
                    />
                    <div className="flex justify-end mt-2 gap-2">
                      <button 
                        onClick={saveEdit}
                        className="px-2 py-1 bg-green-600 text-xs rounded"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-red-600 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={event.id}
                    className="flex bg-black text-white p-2 rounded text-left text-sm cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onDoubleClick={() => handleDoubleClick(event)}
                  >
                    <div className="text-yellow-400 font-bold">
                      {event.time}{" "}
                      <span className="text-md font-bold text-white">{event.title}</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;