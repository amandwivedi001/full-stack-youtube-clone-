import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
  const doLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  doLogout();
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Logging out...</h2>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
    </div>
  );
};

export default Logout;
