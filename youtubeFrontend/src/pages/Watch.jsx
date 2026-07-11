import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getRecommendedVideos, getVideoById } from "../api/video.api";
import { getVideoComments, addComment, deleteComment, updateComment } from "../api/comment.api";
import { toggleVideoLike, toggleCommentLike } from "../api/likes.api";
import { useAuth } from "../context/useAuth";
import { getUserPlaylists, addVideoToPlaylist } from "../api/playlist.api";

const Watch = () => {
    const { videoId } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState(null);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [error, setError] = useState("");

    const [editingCommentId, setEditingCommentId] = useState("");
    const [editingCommentText, setEditingCommentText] = useState("");
    const [commentActionLoading, setCommentActionLoading] = useState("");

    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [playlistMessage, setPlaylistMessage] = useState("");
    const [savingToPlaylist, setSavingToPlaylist] = useState("");

    const fetchAll = useCallback(async () => {
        if (!videoId) return;

        try {
            setError("");
            setLoading(true);

            const [videoRes, commentRes, recommendedRes] = await Promise.all([
                getVideoById(videoId),
                getVideoComments(videoId),
                getRecommendedVideos(videoId, { limit: 8 }),
            ]);
            

            setVideo(videoRes?.data?.data || null);
            setComments(commentRes?.data?.data || []);
            setRecommendedVideos(recommendedRes?.data?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load video");
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            await addComment(videoId, newComment);
            setNewComment("");
            await fetchAll();
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleVideoLike = async () => {
        await toggleVideoLike(videoId);
        await fetchAll();
    };

    const openPlaylistModal = async () => {
        if (!user?._id) {
            setPlaylistMessage("Login to save videos to playlists.");
            setShowPlaylistModal(true);
            return;
        }

        try {
            setPlaylistMessage("");
            const res = await getUserPlaylists(user._id);
            setPlaylists(res?.data?.data || []);
            setShowPlaylistModal(true);
        } catch (err) {
            setPlaylistMessage(err?.response?.data?.message || "Failed to load playlists.");
            setShowPlaylistModal(true);
        }
    };

    const handleSaveToPlaylist = async (playlistId) => {
        try {
            setSavingToPlaylist(playlistId);
            await addVideoToPlaylist(playlistId, videoId);
            setPlaylistMessage("Video saved to playlist.");
        } catch (err) {
            setPlaylistMessage(err?.response?.data?.message || "Failed to save video.");
        } finally {
            setSavingToPlaylist("");
        }
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingCommentText(comment.content || "");
    };

    const cancelEditComment = () => {
        setEditingCommentId("");
        setEditingCommentText("");
    };

    const handleUpdateComment = async (commentId) => {
        if (!editingCommentText.trim()) return;

        try {
            setCommentActionLoading(commentId);
            await updateComment(commentId, editingCommentText);
            cancelEditComment();
            await fetchAll();
        } finally {
            setCommentActionLoading("");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm("Delete this comment?");
        if (!confirmed) return;

        try {
            setCommentActionLoading(commentId);
            await deleteComment(commentId);
            await fetchAll();
        } finally {
            setCommentActionLoading("");
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            setCommentActionLoading(commentId);
            await toggleCommentLike(commentId);
            await fetchAll();
        } finally {
            setCommentActionLoading("");
        }
    };

    if (loading) return <WatchSkeleton />;

    if (error) {
        return (
            <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
            </div>
        );
    }

    if (!video) {
        return (
            <div className="mx-auto max-w-4xl rounded-lg border border-neutral-200 p-10 text-center">
                <h1 className="text-xl font-semibold text-neutral-950">Video not found</h1>
                <p className="mt-2 text-sm text-neutral-500">This video may have been removed.</p>
            </div>
        );
    }

    const owner = video?.owner;
    const views = Number(video?.views || 0).toLocaleString();
    const likes = Number(video?.likeCount || 0).toLocaleString();

    return (
        <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
            <section className="min-w-0">
                <div className="overflow-hidden rounded-xl bg-black shadow-sm">
                    <video
                        src={video.videoFile}
                        controls
                        className="aspect-video w-full bg-black object-contain"
                    />
                </div>

                <div className="mt-4">
                    <h1 className="text-xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-2xl">
                        {video.title}
                    </h1>

                    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            {owner?.avatar ? (
                                <Link to={`/channel/${owner.username}`} className="shrink-0">
                                    <img
                                        src={owner.avatar}
                                        alt={owner.username}
                                        className="h-12 w-12 rounded-full object-cover ring-1 ring-neutral-200"
                                    />
                                </Link>
                            ) : (
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-600">
                                    CH
                                </div>
                            )}

                            <div className="min-w-0">
                                {owner?.username ? (
                                    <Link
                                        to={`/channel/${owner.username}`}
                                        className="block truncate font-semibold text-neutral-950 hover:text-red-700"
                                    >
                                        {owner.username}
                                    </Link>
                                ) : (
                                    <p className="font-semibold text-neutral-950">Creator</p>
                                )}
                                <p className="text-sm text-neutral-500">{views} views</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={handleVideoLike}
                                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                            >
                                Like · {likes}
                            </button>
                            <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100">
                                Share
                            </button>
                            <button
                                onClick={openPlaylistModal}
                                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-neutral-100 p-4">
                        <p className="text-sm font-semibold text-neutral-950">{views} views</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                            {video.description || "No description added."}
                        </p>
                    </div>
                </div>

                <section className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-neutral-950">
                            {comments?.length || 0} Comments
                        </h2>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-4">
                        <div className="flex gap-3">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username || "avatar"}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
                                />
                            ) : (
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
                                    YOU
                                </div>
                            )}

                            <div className="flex-1">
                                <textarea
                                    className="min-h-24 w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm outline-none transition focus:border-neutral-500"
                                    placeholder={user ? "Add a thoughtful comment..." : "Login to add a comment"}
                                    value={newComment}
                                    disabled={!user || submittingComment}
                                    onChange={(event) => setNewComment(event.target.value)}
                                />

                                <div className="mt-3 flex justify-end gap-2">
                                    <button
                                        className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                                        disabled={!newComment.trim() || submittingComment}
                                        onClick={() => setNewComment("")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!user || !newComment.trim() || submittingComment}
                                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                                        onClick={handleAddComment}
                                    >
                                        {submittingComment ? "Posting..." : "Comment"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-5">
                        {comments === null ? (
                            <CommentSkeleton />
                        ) : comments.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center">
                                <h3 className="font-semibold text-neutral-950">No comments yet</h3>
                                <p className="mt-1 text-sm text-neutral-500">Start the conversation.</p>
                            </div>
                        ) : (
                            comments.map((comment) => {
                                const isOwner = user?._id === comment.owner?._id;
                                const isEditing = editingCommentId === comment._id;

                                return (
                                    <article key={comment._id} className="flex gap-3">
                                        {comment.owner?.avatar ? (
                                            <img
                                                src={comment.owner.avatar}
                                                alt={comment.owner.username}
                                                className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-neutral-200" />
                                        )}

                                        <div className="min-w-0 flex-1 rounded-xl bg-neutral-50 px-4 py-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-950">
                                                        {comment.owner?.username || "Viewer"}
                                                    </p>
                                                    {comment.createdAt && (
                                                        <p className="text-xs text-neutral-500">
                                                            {new Date(comment.createdAt).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>

                                                {isOwner && !isEditing && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEditComment(comment)}
                                                            className="text-xs font-semibold text-neutral-600 hover:text-neutral-950"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            disabled={commentActionLoading === comment._id}
                                                            className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <div className="mt-3">
                                                    <textarea
                                                        value={editingCommentText}
                                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                                        className="min-h-24 w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-500"
                                                    />

                                                    <div className="mt-3 flex justify-end gap-2">
                                                        <button
                                                            onClick={cancelEditComment}
                                                            className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateComment(comment._id)}
                                                            disabled={!editingCommentText.trim() || commentActionLoading === comment._id}
                                                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-neutral-300"
                                                        >
                                                            {commentActionLoading === comment._id ? "Saving..." : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                                    {comment.content}
                                                </p>
                                            )}

                                            {!isEditing && (
                                                <div className="mt-3 flex gap-3">
                                                    <button
                                                        onClick={() => handleToggleCommentLike(comment._id)}
                                                        disabled={!user || commentActionLoading === comment._id}
                                                        className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 disabled:opacity-60"
                                                    >
                                                        Like
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </section>
            </section>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
                <h2 className="text-lg font-bold text-neutral-950">Recommended</h2>
                {recommendedVideos.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">
                        More videos will appear here once your feed has content.
                    </div>
                ) : (
                    recommendedVideos.map((item) => <RecommendedVideo key={item._id} video={item} />)
                )}
            </aside>

            {showPlaylistModal && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-950">Save to playlist</h2>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Choose a playlist to organize this video.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowPlaylistModal(false)}
                                className="rounded-full border border-neutral-300 px-3 py-1 text-sm font-semibold hover:bg-neutral-100"
                            >
                                Close
                            </button>
                        </div>

                        {playlistMessage && (
                            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                                {playlistMessage}
                            </div>
                        )}

                        {!user ? (
                            <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-8 text-center">
                                <h3 className="font-bold text-neutral-950">Login required</h3>
                                <p className="mt-2 text-sm text-neutral-500">
                                    You need an account to save videos.
                                </p>
                                <Link
                                    to="/login"
                                    className="mt-5 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
                                >
                                    Login
                                </Link>
                            </div>
                        ) : playlists.length === 0 ? (
                            <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-8 text-center">
                                <h3 className="font-bold text-neutral-950">No playlists yet</h3>
                                <p className="mt-2 text-sm text-neutral-500">
                                    Create a playlist first, then save videos into it.
                                </p>
                                <Link
                                    to="/playlists"
                                    className="mt-5 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
                                >
                                    Create playlist
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {playlists.map((playlist) => (
                                    <button
                                        key={playlist._id}
                                        onClick={() => handleSaveToPlaylist(playlist._id)}
                                        disabled={savingToPlaylist === playlist._id}
                                        className="flex w-full items-center justify-between rounded-xl border border-neutral-200 p-4 text-left transition hover:bg-neutral-50 disabled:opacity-60"
                                    >
                                        <span>
                                            <span className="block font-semibold text-neutral-950">
                                                {playlist.name}
                                            </span>
                                            <span className="mt-1 block text-sm text-neutral-500">
                                                {playlist.discription || "No description"}
                                            </span>
                                        </span>

                                        <span className="text-sm font-semibold text-red-600">
                                            {savingToPlaylist === playlist._id ? "Saving..." : "Save"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const RecommendedVideo = ({ video }) => {
    const owner = Array.isArray(video?.owner) ? video.owner[0] : video?.owner;
    const views = Number(video?.views || 0).toLocaleString();
    const duration = Number(video?.duration || 0);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, "0");

    return (
        <Link to={`/watch/${video._id}`} className="group grid grid-cols-[150px_1fr] gap-3">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {duration > 0 && (
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {minutes}:{seconds}
                    </span>
                )}
            </div>

            <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-950 group-hover:text-red-700">
                    {video.title}
                </h3>
                <p className="mt-1 truncate text-sm text-neutral-600">{owner?.username || "Creator"}</p>
                <p className="text-sm text-neutral-500">{views} views</p>
            </div>
        </Link>
    );
};

const WatchSkeleton = () => (
    <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section>
            <div className="aspect-video animate-pulse rounded-xl bg-neutral-200" />
            <div className="mt-4 h-7 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="mt-4 h-20 animate-pulse rounded-xl bg-neutral-200" />
            <div className="mt-8 h-40 animate-pulse rounded-xl bg-neutral-200" />
        </section>
        <aside className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[150px_1fr] gap-3">
                    <div className="aspect-video animate-pulse rounded-lg bg-neutral-200" />
                    <div>
                        <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                        <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
                    </div>
                </div>
            ))}
        </aside>
    </div>
);

const CommentSkeleton = () => (
    <>
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200" />
                <div className="flex-1 rounded-xl bg-neutral-50 px-4 py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-neutral-200" />
                </div>
            </div>
        ))}
    </>
);

export default Watch;
