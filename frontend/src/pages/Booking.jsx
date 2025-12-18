import { useEffect, useState } from "react";
import api from "../api/axios";

function Booking() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(18);
  const [endTime, setEndTime] = useState(20);

  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [equipmentQty, setEquipmentQty] = useState({});

  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/courts").then((res) => setCourts(res.data));
    api.get("/equipment").then((res) => setEquipment(res.data));
    api.get("/coaches").then((res) => setCoaches(res.data));
  }, []);

  const buildBookingPayload = () => {
  return {
    courtId: selectedCourt,
    date,
    startTime,
    endTime,
    equipment: Object.entries(equipmentQty)
      .filter(([_, qty]) => qty > 0)
      .map(([equipmentId, quantity]) => ({
        equipmentId,
        quantity,
      })),
    coachId: selectedCoach || null,
  };
};

const handleBooking = async () => {
  setError("");
  setPricing(null);

  if (!date || !selectedCourt) {
    setError("Please select date and court");
    return;
  }

  try {
    setLoading(true);
    const res = await api.post("/bookings", buildBookingPayload());
    setPricing(res.data.pricing);
    alert("Booking confirmed!");
  } catch (err) {
    setError(err.response?.data?.message || "Booking failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Book a Court</h1>
      <p className="text-gray-600 mb-8">Select your preferred date, time, and court to make a booking.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left panel */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 space-y-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="number"
                min="6"
                max="22"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={startTime}
                onChange={(e) => setStartTime(+e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="number"
                min="6"
                max="22"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={endTime}
                onChange={(e) => setEndTime(+e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
            >
              <option value="">Select court</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type}) – ₹{c.basePrice}/hr
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coach (optional)</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
            >
              <option value="">No coach</option>
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} – ₹{c.pricePerHour}/hr
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Equipment</h2>

          <div className="space-y-4">
            {equipment.map((e) => (
              <div key={e.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-medium text-gray-900">{e.name}</span>
                  <span className="text-sm text-gray-600 ml-2">₹{e.pricePerHour}/hr</span>
                </div>
                <input
                  type="number"
                  min="0"
                  className="border border-gray-300 rounded-lg px-3 py-1.5 w-20 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={equipmentQty[e.id] || 0}
                  onChange={(ev) =>
                    setEquipmentQty({
                      ...equipmentQty,
                      [e.id]: +ev.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm mb-4 p-4 rounded-lg">
          {error}
        </div>
      )}

      {pricing && (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Price Breakdown</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Court Price:</span>
              <span className="font-medium">₹{Math.round(pricing.basePrice * pricing.multiplier)}</span>
            </div>
            <div className="flex justify-between">
              <span>Equipment Cost:</span>
              <span className="font-medium">₹{pricing.equipmentCost}</span>
            </div>
            <div className="flex justify-between">
              <span>Coach Cost:</span>
              <span className="font-medium">₹{pricing.coachCost}</span>
            </div>
            <div className="border-t border-green-300 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-indigo-600">₹{pricing.totalPrice}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading}
        className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}

export default Booking;
