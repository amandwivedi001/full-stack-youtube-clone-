import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    changePassword,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
} from "../api/auth.api";
import { useAuth } from "../context/useAuth";

const Settings = () => {
    const { user, loading, fetchCurrentUser } = useAuth();
    const [accountForm, setAccountForm] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [saving, setSaving] = useState("");

    const avatarPreview = useMemo(
        () => (avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar || ""),
        [avatarFile, user?.avatar]
    );

    const coverPreview = useMemo(
        () => (coverFile ? URL.createObjectURL(coverFile) : user?.coverImage || ""),
        [coverFile, user?.coverImage]
    );

    if (loading) return <SettingsSkeleton />;

    if (!user) {
        return (
            <section className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-red-600">Account settings</p>
                <h1 className="mt-2 text-2xl font-bold text-neutral-950">Login to manage settings</h1>
                <p className="mt-3 text-sm text-neutral-500">
                    Your channel customization, security, and account preferences live here.
                </p>
                <Link
                    to="/login"
                    className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                    Login
                </Link>
            </section>
        );
    }

    const showStatus = (type, message) => setStatus({ type, message });

    const handleAccountSave = async (event) => {
        event.preventDefault();

        try {
            setSaving("account");
            await updateAccountDetails({
                fullname: accountForm.fullname.trim(),
                email: accountForm.email.trim(),
            });
            await fetchCurrentUser();
            showStatus("success", "Account details updated.");
        } catch (err) {
            showStatus("error", err?.response?.data?.message || "Failed to update account details.");
        } finally {
            setSaving("");
        }
    };

    const handleAvatarSave = async () => {
        if (!avatarFile) return;

        try {
            setSaving("avatar");
            await updateAvatar(avatarFile);
            await fetchCurrentUser();
            setAvatarFile(null);
            showStatus("success", "Avatar updated.");
        } catch (err) {
            showStatus("error", err?.response?.data?.message || "Failed to update avatar.");
        } finally {
            setSaving("");
        }
    };

    const handleCoverSave = async () => {
        if (!coverFile) return;

        try {
            setSaving("cover");
            await updateCoverImage(coverFile);
            await fetchCurrentUser();
            setCoverFile(null);
            showStatus("success", "Cover image updated.");
        } catch (err) {
            showStatus("error", err?.response?.data?.message || "Failed to update cover image.");
        } finally {
            setSaving("");
        }
    };

    const handlePasswordSave = async (event) => {
        event.preventDefault();

        try {
            setSaving("password");
            await changePassword(passwordForm);
            setPasswordForm({ oldPassword: "", newPassword: "" });
            showStatus("success", "Password changed successfully.");
        } catch (err) {
            showStatus("error", err?.response?.data?.message || "Failed to change password.");
        } finally {
            setSaving("");
        }
    };

    return (
        <section className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-red-600">Account Studio</p>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Settings</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                        Tune your creator identity, channel visuals, and account security from one place.
                    </p>
                </div>
                <Link
                    to={`/channel/${user.username}`}
                    className="rounded-full border border-neutral-300 px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
                >
                    View channel
                </Link>
            </div>

            {status.message && (
                <div
                    className={[
                        "mb-5 rounded-lg border p-4 text-sm",
                        status.type === "success"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700",
                    ].join(" ")}
                >
                    {status.message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="h-fit overflow-hidden rounded-2xl border border-neutral-200 bg-white lg:sticky lg:top-24">
                    <div className="relative h-36 bg-neutral-950" style={{marginBottom:"3.5rem"}}>
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full bg-[radial-gradient(circle_at_20%_20%,#ef4444,transparent_28%),linear-gradient(135deg,#111827,#171717_45%,#dc2626)]" />
                        )}
                    </div>
                    <div className="-mt-10 px-5 pb-5">
                        <img
                            src={avatarPreview}
                            alt={user.username}
                            className="h-24 w-24 rounded-full border-4 border-white bg-neutral-100 object-cover shadow-sm"
                        />
                        <h2 className="mt-3 text-xl font-bold text-neutral-950">{user.fullname || user.username}</h2>
                        <p className="mt-1 text-sm font-medium text-neutral-500">@{user.username}</p>
                        <p className="mt-4 text-sm leading-6 text-neutral-500">
                            This preview reflects how your channel identity appears across uploads, comments, and profile cards.
                        </p>
                    </div>
                </aside>

                <div className="space-y-6">
                    <form onSubmit={handleAccountSave} className="rounded-2xl border border-neutral-200 bg-white p-5">
                        <SectionHeader title="Account details" description="Keep your creator name and email up to date." />
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Full name"
                                name="fullname"
                                value={accountForm.fullname}
                                onChange={(event) =>
                                    setAccountForm((prev) => ({ ...prev, fullname: event.target.value }))
                                }
                            />
                            <Field
                                label="Email"
                                name="email"
                                type="email"
                                value={accountForm.email}
                                onChange={(event) =>
                                    setAccountForm((prev) => ({ ...prev, email: event.target.value }))
                                }
                            />
                        </div>
                        <ActionRow
                            label={saving === "account" ? "Saving..." : "Save details"}
                            disabled={saving === "account" || !accountForm.fullname.trim() || !accountForm.email.trim()}
                        />
                    </form>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                        <SectionHeader title="Channel media" description="Update your avatar and cover image independently." />
                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            <MediaPicker
                                label="Avatar"
                                helper="Square image recommended"
                                accept="image/*"
                                file={avatarFile}
                                onChange={(file) => setAvatarFile(file)}
                                buttonLabel={saving === "avatar" ? "Uploading..." : "Update avatar"}
                                disabled={!avatarFile || saving === "avatar"}
                                onSave={handleAvatarSave}
                            />
                            <MediaPicker
                                label="Cover image"
                                helper="Wide banner image recommended"
                                accept="image/*"
                                file={coverFile}
                                onChange={(file) => setCoverFile(file)}
                                buttonLabel={saving === "cover" ? "Uploading..." : "Update cover"}
                                disabled={!coverFile || saving === "cover"}
                                onSave={handleCoverSave}
                            />
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSave} className="rounded-2xl border border-neutral-200 bg-white p-5">
                        <SectionHeader title="Security" description="Change your password when you need to refresh account access." />
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Old password"
                                name="oldPassword"
                                type="password"
                                value={passwordForm.oldPassword}
                                onChange={(event) =>
                                    setPasswordForm((prev) => ({ ...prev, oldPassword: event.target.value }))
                                }
                            />
                            <Field
                                label="New password"
                                name="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(event) =>
                                    setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                                }
                            />
                        </div>
                        <ActionRow
                            label={saving === "password" ? "Changing..." : "Change password"}
                            disabled={saving === "password" || !passwordForm.oldPassword || !passwordForm.newPassword}
                        />
                    </form>
                </div>
            </div>
        </section>
    );
};

const SectionHeader = ({ title, description }) => (
    <div>
        <h2 className="text-lg font-bold text-neutral-950">{title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
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

const ActionRow = ({ label, disabled }) => (
    <div className="mt-5 flex justify-end">
        <button
            disabled={disabled}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
            {label}
        </button>
    </div>
);

const MediaPicker = ({ label, helper, accept, file, onChange, buttonLabel, disabled, onSave }) => (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-bold text-neutral-950">{label}</p>
        <p className="mt-1 text-xs text-neutral-500">{helper}</p>
        <label className="mt-4 block cursor-pointer rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-center text-sm font-semibold text-neutral-700 hover:border-neutral-500">
            {file ? file.name : "Choose image"}
            <input
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(event) => onChange(event.target.files?.[0] || null)}
            />
        </label>
        <button
            type="button"
            onClick={onSave}
            disabled={disabled}
            className="mt-4 w-full rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
            {buttonLabel}
        </button>
    </div>
);

const SettingsSkeleton = () => (
    <section className="mx-auto max-w-6xl">
        <div className="h-10 w-52 animate-pulse rounded bg-neutral-200" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="h-96 animate-pulse rounded-2xl bg-neutral-200" />
            <div className="space-y-6">
                <div className="h-56 animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-56 animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-56 animate-pulse rounded-2xl bg-neutral-200" />
            </div>
        </div>
    </section>
);

export default Settings;
