import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publishVideo } from "../api/video.api";
import { useAuth } from "../context/useAuth";

const Upload = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const videoPreview = useMemo(
    () => (form.videoFile ? URL.createObjectURL(form.videoFile) : ""),
    [form.videoFile]
  );

  const thumbnailPreview = useMemo(
    () => (form.thumbnail ? URL.createObjectURL(form.thumbnail) : ""),
    [form.thumbnail]
  );

  const isFormReady =
    form.title.trim() &&
    form.description.trim() &&
    form.videoFile &&
    form.thumbnail;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setForm((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormReady || submitting) return;

    try {
      setError("");
      setSubmitting(true);
      const res = await publishVideo(form);
      const uploadedVideo = res?.data?.data;
      navigate(uploadedVideo?._id ? `/watch/${uploadedVideo._id}` : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Video upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <UploadSkeleton />;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-red-600">Creator access</p>
        <h1 className="mt-2 text-2xl font-bold text-neutral-950">Login to upload videos</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Create an account or login to publish content on your channel.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Sign up
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-red-600">Creator Studio</p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Upload a video</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Add the core details viewers will see first: a strong title, clear thumbnail, and useful description.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <label className="text-sm font-semibold text-neutral-950" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              placeholder="Give your video a clear, searchable title"
              className="mt-2 h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-500"
            />
            <p className="mt-2 text-right text-xs text-neutral-500">{form.title.length}/100</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <label className="text-sm font-semibold text-neutral-950" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={9}
              placeholder="Tell viewers what this video is about..."
              className="mt-2 w-full resize-none rounded-lg border border-neutral-300 p-4 text-sm leading-6 outline-none transition focus:border-neutral-500"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FileDrop
              label="Video file"
              name="videoFile"
              accept="video/*"
              file={form.videoFile}
              helper="MP4, WebM, MOV"
              onChange={handleFileChange}
            />
            <FileDrop
              label="Thumbnail"
              name="thumbnail"
              accept="image/*"
              file={form.thumbnail}
              helper="JPG, PNG, WebP"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isFormReady || submitting}
              className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {submitting ? "Uploading..." : "Publish video"}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-neutral-950">Preview</h2>
          <div className="mt-4 overflow-hidden rounded-lg bg-neutral-100">
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Thumbnail preview" className="aspect-video w-full object-cover" />
            ) : (
              <div className="grid aspect-video place-items-center text-sm text-neutral-500">
                Thumbnail preview
              </div>
            )}
          </div>

          <h3 className="mt-4 line-clamp-2 font-semibold text-neutral-950">
            {form.title || "Your video title will appear here"}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{user.username}</p>

          {videoPreview && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-neutral-950">Video check</p>
              <video src={videoPreview} controls className="aspect-video w-full rounded-lg bg-black object-contain" />
            </div>
          )}

          <div className="mt-5 rounded-lg bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
            Tip: thumbnails with clear faces, strong contrast, and readable text usually perform better.
          </div>
        </aside>
      </form>
    </section>
  );
};

const FileDrop = ({ label, name, accept, file, helper, onChange }) => (
  <label className="block rounded-xl border border-dashed border-neutral-300 bg-white p-5 transition hover:border-neutral-500">
    <span className="text-sm font-semibold text-neutral-950">{label}</span>
    <span className="mt-3 grid min-h-36 place-items-center rounded-lg bg-neutral-50 px-4 text-center">
      <span>
        <span className="block text-sm font-semibold text-neutral-800">
          {file ? file.name : "Click to choose a file"}
        </span>
        <span className="mt-1 block text-xs text-neutral-500">{helper}</span>
      </span>
    </span>
    <input name={name} type="file" accept={accept} className="sr-only" onChange={onChange} />
  </label>
);

const UploadSkeleton = () => (
  <section className="mx-auto max-w-6xl">
    <div className="h-8 w-52 animate-pulse rounded bg-neutral-200" />
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <div className="h-28 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-44 animate-pulse rounded-xl bg-neutral-200" />
      </div>
      <div className="h-96 animate-pulse rounded-xl bg-neutral-200" />
    </div>
  </section>
);

export default Upload;
