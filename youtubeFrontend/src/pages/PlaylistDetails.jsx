import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlaylistById, removeVideoFromPlaylist } from "../api/playlist.api";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPlaylist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPlaylistById(playlistId);
      const data = res?.data?.data;

      const normalized = Array.isArray(data) ? data[0] : data;

      setPlaylist(normalized || null);
      setVideos(normalized?.videoInfo || normalized?.video || []);
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const handleRemove = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlistId, videoId);
      await fetchPlaylist();
      setMessage("Video removed from playlist.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to remove video.");
    }
  };

  if (loading) return <h2>Loading playlist...</h2>;

  if (!playlist) {
    return <h2>Playlist not found</h2>;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Playlist</p>
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {playlist.discription || "No description"}
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
          {message}
        </div>
      )}

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="font-bold">No videos in this playlist</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Add videos from video actions later.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {videos.map((video) => (
            <div key={video._id} className="grid gap-4 p-4 sm:grid-cols-[160px_1fr_auto] sm:items-center">
              <Link to={`/watch/${video._id}`}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video w-full rounded-lg object-cover sm:w-[160px]"
                />
              </Link>

              <div>
                <Link to={`/watch/${video._id}`}>
                  <h2 className="font-bold">{video.title}</h2>
                </Link>
                <p className="mt-1 text-sm text-neutral-500">
                  {video.views || 0} views
                </p>
              </div>

              <button
                onClick={() => handleRemove(video._id)}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PlaylistDetails;