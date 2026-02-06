import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import VideoCard from "../components/common/VideoCard";
import { getAllVideos } from "../api/video.api";

const Home = () => {
  const { user, loading } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchVideos = async () => {
    setErrMsg("");
    setLoader(true);

    try {
      const res = await getAllVideos();
      setVideos(res?.data?.data || []);
    } catch (error) {
      setErrMsg(error?.response?.data?.message || "Failed to load videos")
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  if (loading) return <h2>Loading Auth...</h2>;

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Home Page Visible ✅</h2>

        <div>
          <h3>You are NOT logged in</h3>

          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/signup">
            <button style={{ marginLeft: "10px" }}>Signup</button>
          </Link>
        </div>
      </div>
    );
  };


  if (loader) return <h2>Loading videos...</h2>;
  if (errMsg) return <h2 style={{ color: "red" }}>{errMsg}</h2>;

  return(
    <div>
      <h2>Home Feed ✅</h2>

      {videos.length === 0 ? (
        <p>No videos found.</p>
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
export default Home;
