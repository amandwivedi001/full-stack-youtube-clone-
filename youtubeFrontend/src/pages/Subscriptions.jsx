import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscribedVideos } from "../api/channel.api";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/useAuth";

const Subscriptions = () => {
  const { user, loading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      if (!user) return;

      try {
        setPageLoading(true);
        setError("");
        const res = await getSubscribedVideos();
        setVideos(res?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load subscriptions.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchFeed();
  }, [user]);

  if (loading || pageLoading) return <h2>Loading subscriptions...</h2>;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to view subscriptions</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Videos from channels you subscribe to will appear here.
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

  if (error) {
    return (
      <section className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Personal feed</p>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Latest videos from channels you follow.
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="font-bold">No subscription videos yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Subscribe to creators to build your personal feed.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Explore videos
          </Link>
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

export default Subscriptions;