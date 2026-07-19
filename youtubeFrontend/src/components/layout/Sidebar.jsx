import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/notifications", label: "Notifications" },
  { to: "/studio/videos", label: "Studio" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
  { to: "/playlists", label: "Playlists" },
  { to: "/library", label: "Library" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    [
      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
      isActive ? "bg-neutral-950 text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950",
    ].join(" ");

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-neutral-200 bg-white px-3 py-4 md:block">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-bold text-neutral-950">Creator mode</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Upload, watch, learn what people enjoy, repeat.
        </p>
      </div>
    </aside>
  );
};

export const MobileNav = () => {
  const mobileLinkClass = ({ isActive }) =>
    [
      "flex flex-1 flex-col items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold transition",
      isActive ? "bg-neutral-950 text-white" : "text-neutral-600 hover:bg-neutral-100",
    ].join(" ");

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex gap-1 rounded-2xl border border-neutral-200 bg-white/95 p-1.5 shadow-lg backdrop-blur md:hidden">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={mobileLinkClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
