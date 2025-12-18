import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={user ? <Booking /> : <Navigate to="/login" />}
        />

        <Route
          path="/bookings"
          element={user ? <MyBookings /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={
            user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
