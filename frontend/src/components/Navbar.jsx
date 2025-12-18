import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link 
        to="/" 
        className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        Badminton Booking
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <>
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
            >
              Book
            </Link>
            <Link 
              to="/bookings" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
            >
              My Bookings
            </Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <Link 
            to="/admin" 
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
          >
            Admin
          </Link>
        )}

        {user ? (
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login" 
            className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
