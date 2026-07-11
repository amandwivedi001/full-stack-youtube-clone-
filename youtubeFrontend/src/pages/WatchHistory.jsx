import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchHistory } from "../api/library.api";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/useAuth";

const WatchHistory = () => {
  const { user, loading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        setPageLoading(true);
        const res = await getWatchHistory();
        setVideos(res?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load history.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading || pageLoading) return <h2>Loading history...</h2>;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to view history</h1>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white">
          Login
        </Link>
      </section>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Library</p>
        <h1 className="text-3xl font-bold">Watch History</h1>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="font-bold">No watch history yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Videos you watch will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
};

export default WatchHistory;