import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    const owner = Array.isArray(video?.owner) ? video.owner[0] : video?.owner;
    const duration = Number(video?.duration || 0);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, "0");
    const durationLabel = duration ? `${minutes}:${seconds}` : null;
    const views = Number(video?.views || 0).toLocaleString();

    return (
        <article className="group overflow-hidden rounded-lg bg-white">
            <Link to={`/watch/${video?._id}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100">
                    <img
                        src={video?.thumbnail}
                        alt={video?.title || "Video thumbnail"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {durationLabel && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white">
                            {durationLabel}
                        </span>
                    )}
                </div>
            </Link>

            <div className="mt-3 flex gap-3">
                {owner?.username && (
                    <Link to={`/channel/${owner.username}`} className="shrink-0">
                    <img
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-neutral-200"
                            src={owner.avatar}
                            alt={owner.username}
                    />
                    </Link>
                )}

                <div className="min-w-0">
                    <Link to={`/watch/${video?._id}`}>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-950 group-hover:text-red-700">
                            {video?.title || "Untitled video"}
                        </h3>
                    </Link>

                    {owner?.username && (
                        <Link
                            to={`/channel/${owner.username}`}
                            className="mt-1 block truncate text-sm text-neutral-600 hover:text-neutral-950"
                        >
                            {owner.username}
                        </Link>
                    )}

                    <p className="mt-0.5 text-sm text-neutral-500">{views} views</p>
                </div>
            </div>
        </article>
    )
}

export default VideoCard;
