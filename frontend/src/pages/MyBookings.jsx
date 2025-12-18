import { useEffect, useState } from "react";
import api from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">My Bookings</h1>
      <p className="text-gray-600 mb-8">View and manage your court bookings.</p>

      {bookings.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-12 border border-gray-100 text-center">
          <p className="text-gray-500 text-lg">No bookings yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start by booking your first court!</p>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {b.court.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(b.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{b.totalPrice}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-medium text-gray-900">
                  {b.startTime}:00 – {b.endTime}:00
                </p>
              </div>
              {b.coach && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Coach</p>
                  <p className="font-medium text-gray-900">{b.coach.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
