import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

const SignUp = () => {
    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false);
    const [form, setForm] = useState({
        fullname: "",
        username: "",
        avatar: null,
        email: "",
        password: "",
    });
    const [errMsg, setErrMsg] = useState("");

    const avatarPreview = useMemo(
        () => (form.avatar ? URL.createObjectURL(form.avatar) : ""),
        [form.avatar]
    );

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrMsg("");
        setBtnLoading(true);

        try {
            await registerUser(form);
            navigate("/login");
        } catch (error) {
            setErrMsg(error?.response?.data?.message || "Sign up failed");
        } finally {
            setBtnLoading(false);
        }
    };

    const isReady =
        form.fullname.trim() &&
        form.username.trim() &&
        form.email.trim() &&
        form.password &&
        form.avatar;

    return (
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_500px]">
            <div className="hidden lg:block">
                <p className="text-sm font-semibold text-red-600">Start creating</p>
                <h1 className="mt-3 max-w-xl text-5xl font-bold tracking-tight text-neutral-950">
                    Create your channel identity in minutes.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-neutral-500">
                    Sign up, add your avatar, and begin publishing videos with a professional creator workflow.
                </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold text-red-600">Create account</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">Join StreamHub</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Your avatar and channel name will appear beside your uploads and comments.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full bg-neutral-200">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                            ) : null}
                        </div>

                        <label className="cursor-pointer rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
                            Choose avatar
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, avatar: event.target.files?.[0] || null }))
                                }
                            />
                        </label>

                        <p className="min-w-0 flex-1 truncate text-sm text-neutral-500">
                            {form.avatar?.name || "Required"}
                        </p>
                    </div>

                    <Field
                        label="Full name"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                        placeholder="Aman Dwivedi"
                        autoComplete="name"
                    />
                    <Field
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="aman"
                        autoComplete="username"
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="aman@example.com"
                        autoComplete="email"
                    />
                    <Field
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                    />

                    {errMsg && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {errMsg}
                        </div>
                    )}

                    <button
                        disabled={btnLoading || !isReady}
                        className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                        {btnLoading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-neutral-950 hover:text-red-700">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

const Field = ({ label, ...props }) => (
    <label className="block">
        <span className="text-sm font-semibold text-neutral-950">{label}</span>
        <input
            {...props}
            className="mt-2 h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-500"
        />
    </label>
);

export default SignUp;
