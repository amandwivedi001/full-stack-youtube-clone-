import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api";
import { useState, useEffect } from "react";
import { getVideoComments, addComment } from "../api/comment.api";
import { toggleVideoLike } from "../api/likes.api";

const Watch = () => {
    const { videoId } = useParams();

    const [video, setVideo] = useState(null);
    const [loader, setLoader] = useState(true);
    const [videoComment, setVideoComment] = useState([])
    const [newComment, setNewComment] = useState("");
    useEffect(() => {
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

                await video.findByIdAndUpdate(
                    videoId,
                    { $inc: { views: 1 } },
                    { new: true }
                );
            } catch (error) {
                setErrmsg(error?.response?.data?.message || "Failed to load video");
            } finally {
                setLoader(false);
            }
        };

        fetchAll();
    }, [videoId]);


    const handleAddComment = async () => {
        if (!newComment.trim()) { return }

        await addComment({ videoId, content: newComment });
        setNewComment("");
        fetchAll();
    }

    const handleVideoLike = async () => {
        toggleVideoLike(videoId);
        fetchAll();
    }
    if (loader) return <h2>Loading video...</h2>;
    if (!video) return <h2>Video not found</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>{video?.title}</h2>

            <video
                controls
                autoPlay
                style={{ width: "100%", maxWidth: "900px" }}
            >
                <source src={video?.videoFile} type="video/mp4" />
            </video>


            <p>{video?.description}</p>

            <button onClick={handleVideoLike}>
                👍 Like ({video.likeCount || 0})
            </button>

            <p>Views: {video?.views}</p>

            <hr />

            <h3>Comments</h3>

            {user && (
                <div>
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={handleAddComment}>Comment</button>
                </div>
            )}

            {videoComment.length === 0 ? (
                <p>No comments yet</p>
            ) : (
                comments.map((c) => (
                    <div key={c._id} style={{ marginTop: "10px" }}>
                        <b>{c.owner?.username}</b>
                        <p>{c.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Watch;
