import { useEffect, useState } from "react";
import api from "../api/axios";

// Helper function to get initial tab from localStorage
function getInitialTab() {
  try {
    const savedTab = localStorage.getItem("adminTab");
    const validTabs = ["bookings", "courts", "equipment", "coaches"];
    return savedTab && validTabs.includes(savedTab) ? savedTab : "bookings";
  } catch {
    return "bookings";
  }
}

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState(getInitialTab);
  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachAvailability, setCoachAvailability] = useState([]);
  const [availabilityCoachName, setAvailabilityCoachName] = useState("");
  const [availabilityForm, setAvailabilityForm] = useState({
    coachId: "",
    date: "",
    startTime: 6,
    endTime: 22,
  });

  useEffect(() => {
    api.get("/bookings/admin/all").then((res) => setBookings(res.data));
    api.get("/courts/admin/all").then((res) => setCourts(res.data));
    api.get("/equipment").then((res) => setEquipment(res.data));
    api.get("/coaches/admin/all").then((res) => setCoaches(res.data));
  }, []);

  useEffect(() => {
    localStorage.setItem("adminTab", tab);
  }, [tab]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage bookings, courts, equipment, and coaches.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {["bookings", "courts", "equipment", "coaches"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings */}
      {tab === "bookings" && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {b.court.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {b.user.name} ({b.user.email})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">₹{b.totalPrice}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
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
      )}

      {/* Courts */}
      {tab === "courts" && (
        <div className="space-y-4">
          {courts.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">{c.name}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {c.type} · ₹{c.basePrice}/hr
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      c.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </p>
              </div>

              <button
                onClick={async () => {
                  await api.patch(`/courts/${c.id}/toggle`);
                  const updated = await api.get("/courts/admin/all");
                  setCourts(updated.data);
                }}
                className={`px-5 py-2.5 text-sm rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all ${
                  c.isActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {c.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Equipment */}
      {tab === "equipment" && (
        <div className="space-y-4">
          {equipment.map((e) => (
            <div
              key={e.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 mb-4">{e.name}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 w-24">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={e.totalQuantity}
                      onChange={(ev) => {
                        const updated = equipment.map((x) =>
                          x.id === e.id
                            ? { ...x, totalQuantity: +ev.target.value }
                            : x
                        );
                        setEquipment(updated);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 w-24">
                      Price/hr:
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">₹</span>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={e.pricePerHour}
                        onChange={(ev) => {
                          const updated = equipment.map((x) =>
                            x.id === e.id
                              ? { ...x, pricePerHour: +ev.target.value }
                              : x
                          );
                          setEquipment(updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  await api.patch(`/equipment/${e.id}`, {
                    totalQuantity: e.totalQuantity,
                    pricePerHour: e.pricePerHour,
                  });
                  alert("Equipment updated");
                }}
                className="ml-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-sm hover:shadow-md transition-all"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coaches */}
      {tab === "coaches" && (
        <div className="space-y-6">
          {/* Coaches list */}
          <div className="space-y-4">
            {coaches.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-1">{c.name}</p>
                  <p className="text-sm text-gray-600 mb-2">₹{c.pricePerHour}/hr</p>
                  <p className="text-sm mb-3">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        c.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </p>
                  <button
                    onClick={async () => {
                      const res = await api.get(
                        `/coaches/${c.id}/availability/all`
                      );
                      setCoachAvailability(res.data);
                      setAvailabilityCoachName(c.name);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    View Availability
                  </button>
                </div>

                <button
                  onClick={async () => {
                    await api.patch(`/coaches/${c.id}/toggle`);
                    const updated = await api.get("/coaches/admin/all");
                    setCoaches(updated.data);
                  }}
                  className={`ml-4 px-5 py-2.5 text-sm rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all ${
                    c.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {c.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            ))}
          </div>

          {/* Add availability */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Coach Availability</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coach</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={availabilityForm.coachId}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      coachId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Coach</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={availabilityForm.date}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="number"
                  min="6"
                  max="22"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={availabilityForm.startTime}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      startTime: +e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="number"
                  min="6"
                  max="22"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={availabilityForm.endTime}
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      endTime: +e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              onClick={async () => {
                await api.post(
                  `/coaches/${availabilityForm.coachId}/availability`,
                  {
                    date: availabilityForm.date,
                    startTime: availabilityForm.startTime,
                    endTime: availabilityForm.endTime,
                  }
                );
                alert("Availability added");
                setAvailabilityForm({
                  coachId: "",
                  date: "",
                  startTime: 6,
                  endTime: 22,
                });
              }}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-sm hover:shadow-md transition-all"
            >
              Add Availability
            </button>
          </div>

          {coachAvailability.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Availability – {availabilityCoachName}
              </h3>

              <div className="space-y-2">
                {coachAvailability.map((a) => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                      {" · "}
                      <span>{a.startTime}:00 – {a.endTime}:00</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
