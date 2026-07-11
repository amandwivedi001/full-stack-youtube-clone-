import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar, { MobileNav } from "../components/layout/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 md:pb-8 lg:px-8">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default Layout;
