import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [btnLoading, setbtnLoading] = useState(false)
    const [form, setForm] = useState({
        fullname: "",
        username: "",
        avatar: null,
        email: "",
        password: "",
    });

    const [errMsg, seterrMsg] = useState("");

    const navigate = useNavigate();

    const handlechange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handlesubmit = async (e) => {
        e.preventDefault();

        seterrMsg("");
        setbtnLoading(true);

        try {
            await registerUser(form);
            navigate('/login')
        } catch (error) {
            seterrMsg(error?.response?.data?.massage || "Sign Up failed")
        } finally {
            setbtnLoading(false);
        }
    }
    return (
        <div className="p-5">

            <h2>Sign-Up</h2>

            <form onSubmit={handlesubmit}>
                <input
                    name="fullname"
                    placeholder="full name"
                    value={form.fullname}
                    onChange={handlechange}
                />
                <br />

                <input
                    name="username"
                    placeholder="user name"
                    value={form.username}
                    onChange={handlechange}
                />
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setForm({ ...form, avatar: e.target.files[0] })
                    }
                />
                <br />

                {form.avatar instanceof File && (
                    <img
                        src={URL.createObjectURL(form.avatar)}
                        alt="preview"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                )}
                <br/>


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

                <button disabled={btnLoading}>
                    {btnLoading ? "Creating..." : "Create Account"}
                </button>
            </form>

            {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
        </div>
    )
}

export default SignUp;