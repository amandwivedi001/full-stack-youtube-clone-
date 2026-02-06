import { Link } from 'react-router-dom';

const VideoCard = ({video}) => {
    return (
        <Link to={`/watch/${video?._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                }}
            >
                <img
                    src={video?.thumbnail}
                    alt="thumbnail"
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />

                <div style={{ padding: "10px" }}>
                    <h4 style={{ margin: 0 }}>{video?.title}</h4>
                    <p style={{ margin: "6px 0", fontSize: "14px" }}>
                        Views: {video?.views}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard;