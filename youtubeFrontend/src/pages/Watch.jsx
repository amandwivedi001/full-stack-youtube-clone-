import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { useState, useEffect } from "react";
import { getVideoComments, addComment } from "../api/comment.api";
import { toggleVideoLike } from "../api/likes.api";
import { useAuth } from "../context/AuthContext"
const Watch = () => {
    const { videoId } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loader, setLoader] = useState(true);
    const [videoComment, setVideoComment] = useState(null)
    const [newComment, setNewComment] = useState("");

    const fetchAll = async () => {
        if (!videoId) return;

        try {
            setLoader(true);
            const [Vidres, Commres] = await Promise.all([
                getVideoById(videoId),
                getVideoComments(videoId),
            ]);

            setVideo(Vidres?.data?.data || null);
            setVideoComment(Commres?.data?.data || [])
        } catch (error) {
            console.log(error?.response?.data?.message || "Failed to load videos")
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [videoId]);


    const handleAddComment = async () => {
        if (!newComment.trim()) { return }

        await addComment(videoId, newComment);
        setNewComment("");
        fetchAll();
    }

    const handleVideoLike = async () => {
        await toggleVideoLike(videoId);
        fetchAll();
    }
    if (loader) {
        return (
            <div className="w-full animate-pulse">
                <div className="h-105 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

                <div className="mt-4 h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>

                <div className="mt-2 h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!video) return <h2>Video not found</h2>;

    const CommentSkeleton = () => (
        <div className="mt-4 border-b pb-3 animate-pulse">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="mt-2 h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="mt-2 h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">

            <div className="w-full rounded-lg overflow-hidden bg-black">
                <video
                    src={video?.videoFile}
                    controls
                    // autoPlay
                    className="w-full max-h-105 object-cover"
                />
            </div>



            <div className="mt-4">
                <h2 className="text-lg font-semibold">{video.title}</h2>

                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    {/* Views */}
                    <span>{video.views} views</span>

                    {/* Like section */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleVideoLike}
                            className="flex items-center gap-1 px-3 py-1 border rounded-full 
                 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            👍
                            <span>Like</span>
                        </button>

                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {video.likeCount}
                        </span>
                    </div>
                </div>


                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    {video.description}
                </p>
            </div>


            <div className="mt-6">
                <textarea
                    className="w-full border rounded p-2 text-sm dark:bg-gray-900"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <div className="flex justify-end mt-2">
                    <button
                        disabled={!newComment.trim()}
                        className="px-4 py-1 text-sm border rounded disabled:opacity-50"
                        onClick={handleAddComment}
                    >
                        Comment
                    </button>
                </div>
            </div>

            {
                videoComment === null ? (
                    <>
                        <CommentSkeleton />
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </>
                ) : videoComment.length === 0 ? (
                    <p>No comments yet</p>
                ) : (
                    videoComment.map((c) => (
                        <div key={c._id} className="mt-4 border-b pb-3">
                            <p className="text-sm font-medium">{c.owner?.username}</p>
                            <p className="text-sm text-gray-950 dark:text-gray-300 mt-1">
                                {c.content}
                            </p>
                        </div>
                    ))
                )
            }

        </div >
    );
};

export default Watch;
