import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sampleEvents = [
  { id: 1, time: "9:24 AM", title: "Order Reschedule Test 2", day: 0 },
  { id: 2, time: "5:35 PM", title: "Test Private Event 7", day: 1 },
  { id: 3, time: "1:05 AM", title: "Agrofood Ethiopia 2024", day: 2 },
  { id: 4, time: "10:57 AM", title: "hhj", day: 3 },
  { id: 5, time: "10:05 AM", title: "Private 2.0", day: 4 },
  { id: 6, time: "7:43 AM", title: "private event", day: 5 },
  { id: 7, time: "9:08 PM", title: "Visit Axum", day: 6 },
];

function App() {
  const [events, setEvents] = useState(sampleEvents);

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData("eventId", eventId);
  };

  const handleDrop = (e, dayIdx) => {
    const eventId = e.dataTransfer.getData("eventId");
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === parseInt(eventId) ? { ...event, day: dayIdx } : event
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">April 2025</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 text-white rounded">
            today
          </button>
          <button className="px-3 py-2 bg-gray-600 text-white rounded">
            &lt;
          </button>
          <button className="px-3 py-2 bg-gray-600 text-white rounded">
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500 border-b border-slate-200 pb-2">
        {days.map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {Array.from({ length: 7 }).map((_, dayIdx) => (
          <div
            key={dayIdx}
            className="flex flex-col gap-2 border border-slate-200 p-2"
            onDrop={(e) => handleDrop(e, dayIdx)}
            onDragOver={handleDragOver}
          >
            {events
              .filter((event) => event.day === dayIdx)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex bg-black text-white p-2 rounded text-left"
                  draggable
                  onDragStart={(e) => handleDragStart(e, event.id)}
                >
                  <div className="text-yellow-400 font-bold">
                    {event.time}{" "}
                    <span className="text-md font-bold text-white">{event.title}</span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
