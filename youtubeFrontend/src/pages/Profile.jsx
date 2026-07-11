import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChannelVideos } from "../api/channel.api";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/useAuth";

const Profile = () => {
    const { user, loading } = useAuth();
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyVideos = useCallback(async () => {
        if (!user?._id) return;

        try {
            setError("");
            setVideosLoading(true);
            const res = await getChannelVideos(user._id);
            setVideos(res?.data?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load your videos");
        } finally {
            setVideosLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchMyVideos();
    }, [fetchMyVideos]);

    if (loading) return <ProfileSkeleton />;

    if (!user) {
        return (
            <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-red-600">Creator profile</p>
                <h1 className="mt-2 text-2xl font-bold text-neutral-950">Login to view your profile</h1>
                <p className="mt-3 text-sm text-neutral-500">
                    Your creator dashboard, uploads, and channel shortcuts live here.
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

    const totalViews = videos.reduce((sum, video) => sum + Number(video.views || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + Number(video.likeCount || 0), 0);

    return (
        <section className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="relative h-56 overflow-hidden rounded-t-2xl" style={{marginBottom: "3.5rem"}}>
                    {user.coverImage ? (
                        <img
                            src={user.coverImage}
                            alt="Cover"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-red-900 to-red-600">
                            <div
                                className="absolute h-72 w-72 rounded-full bg-red-500/20 blur-3xl"
                                style={{ left: "-4rem", top: "-5rem" }}
                            ></div>
                            <div
                                className="absolute h-64 w-64 rounded-full bg-red-400/20 blur-3xl"
                                style={{ right: 0, top: 0 }}
                            ></div>
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>
                    )}
                </div>

                <div className="sm:px-8" style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingBottom: "1.5rem" }}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div
                                className="shrink-0"
                                style={{ marginTop: "-4rem" }}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="h-32 w-32 rounded-full border-[5px] border-white bg-neutral-100 object-cover shadow-xl sm:h-36 sm:w-36"
                                />
                            </div>

                            <div style={{ paddingBottom: "0.5rem" }}>
                                <p className="text-sm font-semibold text-red-600">
                                    Creator dashboard
                                </p>

                                <h1
                                    className="text-3xl font-bold tracking-tight text-neutral-950"
                                    style={{ marginTop: "0.25rem" }}
                                >
                                    {user.fullname || user.username}
                                </h1>

                                <p className="text-sm text-neutral-500">
                                    @{user.username}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2" style={{ paddingBottom: "0.25rem" }}>
                            <Link
                                to="/upload"
                                className="rounded-full bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700"
                                style={{ padding: "0.625rem 1.25rem" }}
                            >
                                Upload video
                            </Link>

                            <Link
                                to={`/channel/${user.username}`}
                                className="rounded-full border border-neutral-300 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
                                style={{ padding: "0.625rem 1.25rem" }}
                            >
                                View channel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatCard label="Published videos" value={videos.length.toLocaleString()} />
                <StatCard label="Total views" value={totalViews.toLocaleString()} />
                <StatCard label="Total likes" value={totalLikes.toLocaleString()} />
            </div>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-red-600">Your library</p>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-950">Uploaded videos</h2>
                </div>
            </div>

            <div className="mt-5">
                {videosLoading ? (
                    <VideoGridSkeleton />
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                ) : videos.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center">
                        <h3 className="text-lg font-bold text-neutral-950">No uploads yet</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            Upload your first video and your creator dashboard starts filling up.
                        </p>
                        <Link
                            to="/upload"
                            className="mt-5 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Upload video
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const StatCard = ({ label, value }) => (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-neutral-950">{value}</p>
    </div>
);

const ProfileSkeleton = () => (
    <section className="mx-auto max-w-7xl">
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-xl bg-neutral-200" />
            ))}
        </div>
    </section>
);

const VideoGridSkeleton = () => (
    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
                <div className="aspect-video animate-pulse rounded-lg bg-neutral-200" />
                <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
        ))}
    </div>
);

export default Profile;
