import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChannelVideos, getUserChannel, toggleSubscription } from "../api/channel.api";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/useAuth";

const Channel = () => {
    const { username } = useParams();
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [error, setError] = useState("");

    const fetchChannelData = useCallback(async () => {
        try {
            setError("");
            setLoading(true);

            const channelRes = await getUserChannel(username);
            const channel = channelRes?.data?.data || null;
            setChannelData(channel);

            if (channel?._id) {
                const videoRes = await getChannelVideos(channel._id);
                setVideos(videoRes?.data?.data || []);
            } else {
                setVideos([]);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load channel");
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchChannelData();
    }, [fetchChannelData]);

    const handleToggleSubscribe = async () => {
        if (!channelData?._id || subscribing) return;

        try {
            setSubscribing(true);
            await toggleSubscription(channelData._id);
            await fetchChannelData();
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) return <ChannelSkeleton />;

    if (error) {
        return (
            <section className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-8 text-red-700">
                {error}
            </section>
        );
    }

    if (!channelData) {
        return (
            <section className="mx-auto max-w-5xl rounded-xl border border-neutral-200 p-10 text-center">
                <h1 className="text-xl font-bold text-neutral-950">Channel not found</h1>
                <p className="mt-2 text-sm text-neutral-500">This creator does not exist yet.</p>
            </section>
        );
    }

    const isOwnChannel = user?._id === channelData._id;
    const subscriberCount = Number(channelData.subscriberCount || 0).toLocaleString();
    const subscribedCount = Number(channelData.subscribedChannelsCount || 0).toLocaleString();

    return (
        <section
    className="max-w-7xl"
    style={{
        margin: "0 auto",
    }}
>
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="relative h-44 bg-neutral-950 sm:h-56" style={{marginBottom: "3.5rem"}}>
            {channelData.coverImage ? (
                <img
                    src={channelData.coverImage}
                    alt={`${channelData.username} cover`}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#ef4444,transparent_28%),linear-gradient(135deg,#111827,#171717_45%,#dc2626)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        <div
            style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingBottom: "24px",
            }}
        >
            <div
                className="flex items-end justify-between gap-5"
                style={{
                    marginTop: "-56px",
                }}
            >
                <div className="flex items-end gap-5">
                    <img
                        src={channelData.avatar}
                        alt={channelData.username}
                        className="h-32 w-32 rounded-full border-4 border-white bg-neutral-100 object-cover shadow-sm"
                    />

                    <div style={{ paddingBottom: "4px" }}>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
                            {channelData.fullname || channelData.username}
                        </h1>

                        <p
                            className="text-sm font-medium text-neutral-600"
                            style={{ marginTop: "4px" }}
                        >
                            @{channelData.username}
                        </p>

                        <div
                            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500"
                            style={{ marginTop: "12px" }}
                        >
                            <span>{subscriberCount} subscribers</span>
                            <span>{subscribedCount} subscribed</span>
                            <span>{videos.length.toLocaleString()} videos</span>
                        </div>
                    </div>
                </div>

                <div
                    className="flex items-end"
                    style={{ paddingBottom: "8px" }}
                >
                    {isOwnChannel ? (
                        <Link
                            to="/upload"
                            className="rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
                            style={{
                                padding: "10px 20px",
                            }}
                        >
                            Upload video
                        </Link>
                    ) : user ? (
                        <button
                            onClick={handleToggleSubscribe}
                            disabled={subscribing}
                            className={[
                                "rounded-full text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
                                channelData.isSubscribed
                                    ? "border border-neutral-300 text-neutral-800 hover:bg-neutral-100"
                                    : "bg-red-600 text-white hover:bg-red-700",
                            ].join(" ")}
                            style={{
                                padding: "10px 20px",
                            }}
                        >
                            {subscribing
                                ? "Updating..."
                                : channelData.isSubscribed
                                ? "Subscribed"
                                : "Subscribe"}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-full bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700"
                            style={{
                                padding: "10px 20px",
                            }}
                        >
                            Login to subscribe
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </div>

    <div
        className="border-b border-neutral-200"
        style={{ marginTop: "24px" }}
    >
        <div className="flex gap-6">
            <button
                className="border-b-2 border-neutral-950 text-sm font-bold text-neutral-950"
                style={{
                    padding: "0 4px 12px",
                }}
            >
                Videos
            </button>

            <button
                className="text-sm font-semibold text-neutral-500"
                style={{
                    padding: "0 4px 12px",
                }}
            >
                Playlists
            </button>

            <button
                className="text-sm font-semibold text-neutral-500"
                style={{
                    padding: "0 4px 12px",
                }}
            >
                About
            </button>
        </div>
    </div>

    <div style={{ marginTop: "24px" }}>
        {videos.length === 0 ? (
            <div
                className="rounded-xl border border-dashed border-neutral-300 text-center"
                style={{ padding: "48px" }}
            >
                <h2 className="text-lg font-bold text-neutral-950">
                    No videos uploaded
                </h2>

                <p
                    className="text-sm text-neutral-500"
                    style={{ marginTop: "8px" }}
                >
                    {isOwnChannel
                        ? "Upload your first video and start building your channel."
                        : "This creator has not published videos yet."}
                </p>

                {isOwnChannel && (
                    <Link
                        to="/upload"
                        className="inline-flex rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                        }}
                    >
                        Upload video
                    </Link>
                )}
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

const ChannelSkeleton = () => (
    <section
    className="max-w-7xl"
    style={{ margin: "0 auto" }}
>
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="h-44 animate-pulse bg-neutral-200 sm:h-56" />

        <div
            style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingBottom: "24px",
            }}
        >
            <div
                className="flex items-end gap-5"
                style={{ marginTop: "-56px" }}
            >
                <div className="h-32 w-32 animate-pulse rounded-full border-4 border-white bg-neutral-300" />

                <div style={{ paddingBottom: "12px" }}>
                    <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />

                    <div
                        className="h-4 w-36 animate-pulse rounded bg-neutral-200"
                        style={{ marginTop: "12px" }}
                    />
                </div>
            </div>
        </div>
    </div>

    <div
        className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        style={{ marginTop: "32px" }}
    >
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
                <div className="aspect-video animate-pulse rounded-lg bg-neutral-200" />

                <div
                    className="h-4 w-4/5 animate-pulse rounded bg-neutral-200"
                    style={{ marginTop: "12px" }}
                />

                <div
                    className="h-3 w-1/2 animate-pulse rounded bg-neutral-200"
                    style={{ marginTop: "8px" }}
                />
            </div>
        ))}
    </div>
</section>
);

export default Channel;
