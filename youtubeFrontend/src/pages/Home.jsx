import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VideoCard from "../components/common/VideoCard";
import { getAllVideos } from "../api/video.api";
import { useAuth } from "../context/useAuth";

const Home = () => {
  const { loading } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "newest";
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchVideos = useCallback(async () => {
    setErrMsg("");
    setLoader(true);

    try {
      const selectedSort = sortOptions[sort] || sortOptions.newest;

      const res = await getAllVideos({
        ...(query ? { query } : {}),
        ...selectedSort,
      });

      setVideos(res?.data?.data || []);
    } catch (error) {
      setErrMsg(error?.response?.data?.message || "Failed to load videos");
    } finally {
      setLoader(false);
    }
  }, [query, sort]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const sortOptions = {
    newest: { sortBy: "createdAt", sortType: "desc" },
    oldest: { sortBy: "createdAt", sortType: "asc" },
    mostViewed: { sortBy: "views", sortType: "desc" },
    mostLiked: { sortBy: "likeCount", sortType: "desc" },
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">{query ? "Search results" : "Discover"}</p>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            {query ? `Results for "${query}"` : "Home Feed"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SortLink current={sort} value="newest" label="Newest" query={query} />
          <SortLink current={sort} value="oldest" label="Oldest" query={query} />
          <SortLink current={sort} value="mostViewed" label="Most viewed" query={query} />
          <SortLink current={sort} value="mostLiked" label="Most liked" query={query} />

          {query && (
            <Link
              to="/"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Clear
            </Link>
          )}
        </div>
      </div>

      {loader ? (
        <HomeSkeleton />
      ) : errMsg ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errMsg}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="text-lg font-semibold text-neutral-950">No videos found</h2>
          <p className="mt-2 text-sm text-neutral-500">
            {query ? "Try another search term." : "Upload the first video and start shaping the feed."}
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

const HomeSkeleton = () => (
  <section className="mx-auto max-w-7xl">
    <div className="mb-6">
      <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
      <div className="mt-2 h-8 w-48 animate-pulse rounded bg-neutral-200" />
    </div>

    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-video animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-3 flex gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1">
              <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SortLink = ({ current, value, label, query }) => {
  const params = new URLSearchParams();

  if (query) params.set("query", query);
  params.set("sort", value);

  const isActive = current === value;

  return (
    <Link
      to={`/?${params.toString()}`}
      className={[
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        isActive
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
};

export default Home;
