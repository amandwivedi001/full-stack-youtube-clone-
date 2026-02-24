import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    return (
        <div className="rounded-lg overflow-hidden hover:shadow-md transition">
            <Link to={`/watch/${video?._id}` }>
                <img
                    src={video?.thumbnail}
                    alt="thumbnail"
                    className="w-full h-40 object-cover"
                />

                <div style={{ padding: "10px" }}>
                    <h4 className="font-medium text-sm line-clamp-2"></h4>
                    <p className="text-xs text-gray-500 mt-1">
                        Views: {video?.views}
                    </p>
                </div>
            </Link>

            {video?.owner[0]?.username && (
                <Link
                    to={`/channel/${video.owner[0].username}`}
                    className = "underline-none text-gray-500"
                >
                    <img
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                        src={video.owner[0].avatar}
                        alt="Channel Avatar"
                        width="36"
                        height="36"
                    />
                    <p class="m-4 text-xs" >
                        {video.owner[0].username}
                    </p>
                </Link>
            )}
        </div>
    )
}

export default VideoCard;