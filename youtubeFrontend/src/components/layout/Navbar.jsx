import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>YouTubeClone</h2>
      </Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/profile">{user?.username || "Profile"}</Link>
            <Link to="/logout">logout</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
