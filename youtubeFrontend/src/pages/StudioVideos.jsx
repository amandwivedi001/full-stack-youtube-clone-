import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteVideo, togglePublishStatus, updateVideo } from "../api/video.api";
import { getChannelVideos } from "../api/channel.api";
import { useAuth } from "../context/useAuth";

const StudioVideos = () => {
  const { user, loading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", thumbnail: null });
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");

  const fetchVideos = useCallback(async () => {
    if (!user?._id) return;

    try {
      setPageLoading(true);
      const res = await getChannelVideos(user._id);
      setVideos(res?.data?.data || []);
    } finally {
      setPageLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const openEdit = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title || "",
      description: video.description || "",
      thumbnail: null,
    });
  };

  const handleUpdate = async () => {
    if (!editingVideo) return;

    setSaving("update");
    setMessage("");

    try {
      await updateVideo(editingVideo._id, editForm);
      setEditingVideo(null);
      await fetchVideos();
      setMessage("Video updated successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving("");
    }
  };

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm("Delete this video permanently?");
    if (!confirmed) return;

    setSaving(videoId);

    try {
      await deleteVideo(videoId);
      await fetchVideos();
      setMessage("Video deleted successfully.");
    } finally {
      setSaving("");
    }
  };

  const handleTogglePublish = async (videoId) => {
    setSaving(videoId);

    try {
      await togglePublishStatus(videoId);
      await fetchVideos();
      setMessage("Publish status updated.");
    } finally {
      setSaving("");
    }
  };

  if (loading || pageLoading) return <h2>Loading studio...</h2>;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to open Studio</h1>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white">
          Login
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Creator Studio</p>
          <h1 className="text-3xl font-bold">Manage videos</h1>
        </div>

        <Link to="/upload" className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">
          Upload video
        </Link>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white">
        {videos.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-lg font-bold">No videos yet</h2>
            <p className="mt-2 text-sm text-neutral-500">Upload your first video to manage it here.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {videos.map((video) => (
              <div key={video._id} className="grid gap-4 p-4 lg:grid-cols-[160px_1fr_auto] lg:items-center">
                <img src={video.thumbnail} alt={video.title} className="aspect-video w-full rounded-lg object-cover lg:w-[160px]" />

                <div>
                  <h2 className="font-bold">{video.title}</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {video.views || 0} views · {video.likeCount || 0} likes
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/watch/${video._id}`} className="rounded-full border px-4 py-2 text-sm font-semibold">
                    View
                  </Link>
                  <button onClick={() => openEdit(video)} className="rounded-full border px-4 py-2 text-sm font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleTogglePublish(video._id)} className="rounded-full border px-4 py-2 text-sm font-semibold">
                    Toggle publish
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    disabled={saving === video._id}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingVideo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold">Edit video</h2>

            <input
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              className="mt-5 h-12 w-full rounded-lg border px-4"
              placeholder="Title"
            />

            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
              className="mt-4 h-36 w-full rounded-lg border p-4"
              placeholder="Description"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditForm((p) => ({ ...p, thumbnail: e.target.files?.[0] || null }))}
              className="mt-4"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingVideo(null)} className="rounded-full border px-5 py-2.5 text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving === "update"}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {saving === "update" ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudioVideos;