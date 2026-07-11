import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, getDashboardVideos } from "../api/dashboard.api";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        if (!user) return;

        try {
            setError("");
            setPageLoading(true);
            const [statsRes, videosRes] = await Promise.all([
                getDashboardStats(),
                getDashboardVideos(),
            ]);
            setStats(statsRes?.data?.data || {});
            setVideos(videosRes?.data?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load dashboard");
        } finally {
            setPageLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const topVideo = useMemo(() => {
        return [...videos].sort((a, b) => Number(b.views || 0) - Number(a.views || 0))[0];
    }, [videos]);

    if (loading || pageLoading) return <DashboardSkeleton />;

    if (!user) {
        return (
            <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-red-600">Creator analytics</p>
                <h1 className="mt-2 text-2xl font-bold text-neutral-950">Login to view your dashboard</h1>
                <p className="mt-3 text-sm text-neutral-500">
                    Track uploads, views, likes, and channel growth from your creator dashboard.
                </p>
                <Link
                    to="/login"
                    className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                    Login
                </Link>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-8 text-red-700">
                {error}
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-red-600">Creator analytics</p>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Dashboard</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                        Understand your channel at a glance: uploads, audience response, and top-performing videos.
                    </p>
                </div>

                <Link
                    to="/upload"
                    className="rounded-full bg-red-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-700"
                >
                    Upload video
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total videos" value={stats?.totalVideos || 0} helper="Published on your channel" />
                <MetricCard label="Total views" value={stats?.totalViews || 0} helper="All-time video views" />
                <MetricCard label="Total likes" value={stats?.totalLikes || 0} helper="Audience appreciation" />
                <MetricCard label="Subscribers" value={stats?.totalSubscribes || 0} helper="People following your channel" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-950">Recent video performance</h2>
                            <p className="mt-1 text-sm text-neutral-500">Your uploaded videos sorted by latest first.</p>
                        </div>
                        <Link to="/profile" className="text-sm font-semibold text-neutral-700 hover:text-red-700">
                            View profile
                        </Link>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
                        {videos.length === 0 ? (
                            <div className="p-10 text-center">
                                <h3 className="font-bold text-neutral-950">No analytics yet</h3>
                                <p className="mt-2 text-sm text-neutral-500">
                                    Upload videos to start seeing performance data here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-200">
                                {videos.map((video) => (
                                    <VideoPerformanceRow key={video._id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-5 text-white">
                        <p className="text-sm font-semibold text-red-300">Top video</p>
                        <h2 className="mt-2 text-xl font-bold">
                            {topVideo?.title || "Publish your first standout video"}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-neutral-300">
                            {topVideo
                                ? `${Number(topVideo.views || 0).toLocaleString()} views so far. Use this as a signal for what your audience enjoys.`
                                : "Once a video gets views, your best performer will appear here."}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                        <h2 className="text-lg font-bold text-neutral-950">Next actions</h2>
                        <div className="mt-4 space-y-3">
                            <ActionLink to="/upload" title="Upload a new video" description="Keep your channel active." />
                            <ActionLink to="/settings" title="Customize channel media" description="Update avatar and cover image." />
                            <ActionLink to={`/channel/${user.username}`} title="Review public channel" description="See what viewers see." />
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};

const MetricCard = ({ label, value, helper }) => (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-sm font-semibold text-neutral-500">{label}</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-neutral-950">
            {Number(value || 0).toLocaleString()}
        </p>
        <p className="mt-2 text-xs leading-5 text-neutral-500">{helper}</p>
    </div>
);

const VideoPerformanceRow = ({ video }) => (
    <Link to={`/watch/${video._id}`} className="grid gap-4 p-4 transition hover:bg-neutral-50 sm:grid-cols-[120px_1fr_auto] sm:items-center">
        <img
            src={video.thumbnail}
            alt={video.title}
            className="aspect-video w-full rounded-lg object-cover sm:w-[120px]"
        />
        <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold text-neutral-950">{video.title}</h3>
            <p className="mt-1 text-xs text-neutral-500">
                {new Date(video.createdAt).toLocaleDateString()}
            </p>
        </div>
        <div className="flex gap-4 text-sm sm:text-right">
            <div>
                <p className="font-bold text-neutral-950">{Number(video.views || 0).toLocaleString()}</p>
                <p className="text-xs text-neutral-500">views</p>
            </div>
            <div>
                <p className="font-bold text-neutral-950">{Number(video.likeCount || 0).toLocaleString()}</p>
                <p className="text-xs text-neutral-500">likes</p>
            </div>
        </div>
    </Link>
);

const ActionLink = ({ to, title, description }) => (
    <Link to={to} className="block rounded-xl border border-neutral-200 p-4 transition hover:bg-neutral-50">
        <p className="text-sm font-bold text-neutral-950">{title}</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
    </Link>
);

const DashboardSkeleton = () => (
    <section className="mx-auto max-w-7xl">
        <div className="h-10 w-52 animate-pulse rounded bg-neutral-200" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl bg-neutral-200" />
            ))}
        </div>
        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-neutral-200" />
    </section>
);

export default Dashboard;
