import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-3xl place-items-center">
            <div className="w-full rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm font-semibold text-red-600">404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">
                    This page is not available
                </h1>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                    The link may be broken, or the page may have moved while the platform is evolving.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                        Back to home
                    </Link>
                    <Link
                        to="/upload"
                        className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
                    >
                        Upload video
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
