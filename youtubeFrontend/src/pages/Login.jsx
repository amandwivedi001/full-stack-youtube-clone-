import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    })

    const navigate = useNavigate();
    const [errMsg, seterrMsg] = useState("");
    const [btnLoading, setbtnLoading] = useState(false);

    const { fetchCurrentUser } = useAuth();

    const handlechange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handlesubmit = async (e) => {

        e.preventDefault();
        seterrMsg("");
        setbtnLoading(true);

        try {
            await loginUser(form);
            await fetchCurrentUser();
            navigate("/");
        } catch (err) {
            seterrMsg(err?.response?.data?.massage || "Login failed")
        } finally {
            setbtnLoading(false)
        };
    }

    return (
        <div class="padding: 20px">
            <h2>Login</h2>

            <form onSubmit={handlesubmit}>
                <input
                    name="username"
                    placeholder="username"
                    value={form.username}
                    onChange={handlechange}
                />
                <br />

                <input
                    name="email"
                    placeholder="email"
                    value={form.email}
                    onChange={handlechange}
                />
                <br />

                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={form.password}
                    onChange={handlechange}
                />
                <br />

                <button>
                    {btnLoading ? "...creating" : "Login"}
                </button>
            </form>

            {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
        </div>
    )
}

export default Login;