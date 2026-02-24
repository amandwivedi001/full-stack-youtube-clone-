import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b dark:border-gray-700">
      <Link to="/" className="text-xl font-semibold">
        YouTubeClone
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link to="/signup" className="text-sm hover:underline">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="text-sm font-medium">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
            <Link to="/logout" className="text-sm font-medium">
              logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
