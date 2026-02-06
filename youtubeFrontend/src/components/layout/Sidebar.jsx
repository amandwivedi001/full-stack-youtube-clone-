import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        borderRight: "1px solid #ddd",
        padding: "12px",
        height: "calc(100vh - 60px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/upload">Upload</Link>
      </div>
    </div>
  );
};

export default Sidebar;
