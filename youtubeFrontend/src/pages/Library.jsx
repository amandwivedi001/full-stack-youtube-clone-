import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Library = () => {
  const { user, loading } = useAuth();

  if (loading) return <h2>Loading library...</h2>;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to view your library</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Your history, liked videos, and playlists live here.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Personal library</p>
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Quickly return to the videos and collections that matter to you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LibraryCard
          to="/library/history"
          title="Watch History"
          description="Videos you recently watched."
        />
        <LibraryCard
          to="/library/liked"
          title="Liked Videos"
          description="Videos you have liked."
        />
        <LibraryCard
          to="/playlists"
          title="Playlists"
          description="Your saved collections."
        />
        <LibraryCard
          to="/profile"
          title="Your Videos"
          description="Videos uploaded by you."
        />
      </div>
    </section>
  );
};

const LibraryCard = ({ to, title, description }) => (
  <Link
    to={to}
    className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:bg-neutral-50"
  >
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="mt-2 text-sm text-neutral-500">{description}</p>
  </Link>
);

export default Library;