import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-56 min-h-screen border-r dark:border-gray-700 p-4 hidden md:block">
      <div className="flex flex-col gap-3">
        <Link to="/" className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">
          Home
        </Link>
        <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">
          My Profile
        </Link>
        <Link to="/upload" className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded">
          Upload
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
