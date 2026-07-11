import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const { fetchCurrentUser } = useAuth();
    const [form, setForm] = useState({
        identifier: "",
        password: "",
    });
    const [errMsg, setErrMsg] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const identifier = form.identifier.trim();
        const payload = identifier.includes("@")
            ? { email: identifier, password: form.password }
            : { username: identifier, password: form.password };

        setErrMsg("");
        setBtnLoading(true);

        try {
            await loginUser(payload);
            await fetchCurrentUser();
            navigate("/");
        } catch (err) {
            setErrMsg(err?.response?.data?.message || "Login failed");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Welcome back"
            title="Login to StreamHub"
            description="Continue your creator workflow, manage uploads, and join conversations."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                    label="Username or email"
                    name="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder="aman or aman@example.com"
                    autoComplete="username"
                />

                <Field
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />

                {errMsg && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errMsg}
                    </div>
                )}

                <button
                    disabled={btnLoading || !form.identifier.trim() || !form.password}
                    className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                    {btnLoading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
                New to StreamHub?{" "}
                <Link to="/signup" className="font-semibold text-neutral-950 hover:text-red-700">
                    Create an account
                </Link>
            </p>
        </AuthShell>
    );
};

const AuthShell = ({ eyebrow, title, description, children }) => (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <div className="hidden lg:block">
            <p className="text-sm font-semibold text-red-600">{eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-5xl font-bold tracking-tight text-neutral-950">
                Build, publish, and grow your video platform.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-neutral-500">
                A professional streaming experience starts with a clean creator identity and a smooth auth flow.
            </p>

            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
                {["Upload", "Watch", "Engage"].map((item) => (
                    <div key={item} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-bold text-neutral-950">{item}</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">Creator-ready flow</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
                <p className="text-sm font-semibold text-red-600">{eyebrow}</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
            </div>
            {children}
        </div>
    </section>
);

const Field = ({ label, ...props }) => (
    <label className="block">
        <span className="text-sm font-semibold text-neutral-950">{label}</span>
        <input
            {...props}
            className="mt-2 h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-500"
        />
    </label>
);

export default Login;
