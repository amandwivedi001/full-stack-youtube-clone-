import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPlaylist, deletePlaylist, getUserPlaylists } from "../api/playlist.api";
import { useAuth } from "../context/useAuth";

const Playlists = () => {
  const { user, loading } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [form, setForm] = useState({ name: "", discription: "" });
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPlaylists = useCallback(async () => {
    if (!user?._id) return;

    try {
      setPageLoading(true);
      const res = await getUserPlaylists(user._id);
      setPlaylists(res?.data?.data || []);
    } finally {
      setPageLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setMessage("");

    try {
      await createPlaylist({
        name: form.name.trim(),
        discription: form.discription.trim() || "No description",
      });
      setForm({ name: "", discription: "" });
      await fetchPlaylists();
      setMessage("Playlist created successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to create playlist.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (playlistId) => {
    const confirmed = window.confirm("Delete this playlist?");
    if (!confirmed) return;

    try {
      await deletePlaylist(playlistId);
      await fetchPlaylists();
      setMessage("Playlist deleted.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to delete playlist.");
    }
  };

  if (loading || pageLoading) return <h2>Loading playlists...</h2>;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Login to manage playlists</h1>
        <Link to="/login" className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Library</p>
        <h1 className="text-3xl font-bold">Playlists</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Organize your videos into collections viewers can explore.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleCreate} className="h-fit rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-bold">Create playlist</h2>

          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Playlist name"
            className="mt-5 h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm"
          />

          <textarea
            value={form.discription}
            onChange={(e) => setForm((p) => ({ ...p, discription: e.target.value }))}
            placeholder="Description"
            className="mt-4 h-28 w-full rounded-lg border border-neutral-300 p-4 text-sm"
          />

          <button
            disabled={saving || !form.name.trim()}
            className="mt-5 w-full rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-neutral-300"
          >
            {saving ? "Creating..." : "Create playlist"}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {playlists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center sm:col-span-2 xl:col-span-3">
              <h2 className="font-bold">No playlists yet</h2>
              <p className="mt-2 text-sm text-neutral-500">
                Create your first playlist to organize content.
              </p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <article key={playlist._id} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h2 className="text-lg font-bold">{playlist.name}</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {playlist.discription || "No description"}
                </p>

                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/playlists/${playlist._id}`}
                    className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDelete(playlist._id)}
                    className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Playlists;