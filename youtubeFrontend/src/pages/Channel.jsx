import { getUserChannel, toggleSubscription, getChannelVideos } from "../api/channel.api";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useParams } from "react-router-dom";
import VideoCard from "../components/common/VideoCard";

const Channel = () => {
    const [videos, setVideos] = useState([]);
    const [channelData, setChannelData] = useState({});
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchChannelData = async () => {
        setLoading(true);
        try {
            const channres = await getUserChannel(username);
            setChannelData(channres?.data?.data|| {});
            const vidres = await getChannelVideos(channelData?._id);
            console.log(channelData?._id);
            setVideos(vidres?.data?.data || []);
        } catch (error) {
            error.response?.data?.message || "Failed to load videos";
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchChannelData();
    }
        , [username])

    const handleToggleSubscribe = async () => {
        await toggleSubscription(channelData._id);
        fetchChannelData();
    }

    if (loading) {
        return <h2>Loading channel data</h2>
    }

    return (
        <div>

            {/* Cover Image */}
            {channelData.coverImage && (
                <img
                    src={channelData.coverImage}
                    alt="Channel Cover"
                    width="100%"
                    height="200"
                />
            )}

            {/* Avatar */}
            {channelData.avatar && (
                <img
                    src={channelData.avatar}
                    alt="Channel Avatar"
                    width="80"
                    height="80"
                />
            )}
            <h2>{channelData.username}</h2>
            <p>{channelData.subscribersCount || 0} subscribers</p>
            <p>{channelData.channelsSuscribedCount || 0} channel Suscribed</p>

            {user && user._id !== channelData._id && (
                <button onClick={handleToggleSubscribe}>
                    {channelData.isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
            )}

            <hr />

            <h3>Videos</h3>

            {videos.length === 0 ? (
                <p>No videos uploaded</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Channel;