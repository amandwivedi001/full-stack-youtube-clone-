import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/?query=${encodeURIComponent(trimmedQuery)}` : "/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="StreamHub home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-600 text-sm font-black text-white">
            VT
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            VideoTube
          </span>
        </Link>

        <form onSubmit={handleSearch} className="mx-auto hidden w-full max-w-2xl md:flex">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos"
            className="h-10 min-w-0 flex-1 rounded-l-full border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-500"
          />
          <button
            type="submit"
            className="h-10 rounded-r-full border border-l-0 border-neutral-300 bg-neutral-50 px-5 text-sm font-medium transition hover:bg-neutral-100"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {user && (
            <Link
              to="/upload"
              className="hidden rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:inline-flex"
            >
              Upload
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-950 xs:inline">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-sm font-medium" title={user.username}>
                <img
                  src={user.avatar}
                  alt={user.username || "avatar"}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-neutral-200"
                />
              </Link>
              <Link to="/logout" className="text-sm font-medium text-neutral-600 hover:text-neutral-950">
                Logout
              </Link>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="border-t border-neutral-100 px-4 py-3 md:hidden">
        <div className="flex">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos"
            className="h-10 min-w-0 flex-1 rounded-l-full border border-neutral-300 px-4 text-sm outline-none"
          />
          <button
            type="submit"
            className="h-10 rounded-r-full border border-l-0 border-neutral-300 bg-neutral-50 px-4 text-sm font-medium"
          >
            Go
          </button>
        </div>
      </form>
    </header>
  );
};

export default Navbar;
