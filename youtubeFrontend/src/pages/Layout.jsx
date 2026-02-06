import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const Layout = () => {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "16px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
