import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import { useAuth } from "../context/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logoutUser();
        setUser(null);
        setTimeout(() => navigate("/", { replace: true }), 700);
      } catch (err) {
        setError(err?.response?.data?.message || "Logout failed");
        setUser(null);
      }
    };

    doLogout();
  }, [navigate, setUser]);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-xl place-items-center">
      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-xl font-bold text-red-600">
          YT
        </div>
        <h1 className="mt-5 text-2xl font-bold text-neutral-950">
          {error ? "Session cleared" : "Logging you out"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {error
            ? "We cleared your local session. You can return home or login again."
            : "Finishing your session and taking you back to the home feed."}
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Go home
          </Link>
          {error && (
            <Link
              to="/login"
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Logout;
