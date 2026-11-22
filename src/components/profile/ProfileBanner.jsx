import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiCheckCircle, FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../api/api";
import PosterWall from "../common/PosterWall";
import usePosterUrls from "../../hooks/usePosterUrls";
import { Button, TextField } from "../ui";
import Avatar from "./Avatar";

const MAX_NAME_LENGTH = 60; // same limit as the server

const isHttpUrl = (text) => {
  try {
    return ["http:", "https:"].includes(new URL(text).protocol);
  } catch {
    return false;
  }
};

const memberSince = (user) =>
  user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

/**
 * Full-width profile header over the poster wall: avatar, name, email and
 * plan. "Edit profile" turns it into a small form (name + photo URL) with a
 * live avatar preview.
 */
const ProfileBanner = ({ planName, startEditing = false }) => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const posters = usePosterUrls();
  const [editing, setEditing] = useState(startEditing);
  const [name, setName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    setName(user.displayName || "");
    setPhotoURL(user.photoURL || "");
    setErrors({});
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhoto = photoURL.trim();
    const found = {};
    if (!cleanName) found.name = "Please enter your name.";
    else if (cleanName.length > MAX_NAME_LENGTH) found.name = `Keep your name under ${MAX_NAME_LENGTH} characters.`;
    if (cleanPhoto && !isHttpUrl(cleanPhoto)) found.photoURL = "Use a link that starts with http:// or https://";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      // Server first: it checks the values, so Firebase only changes if they're accepted
      await api.updateMe({ name: cleanName, photoURL: cleanPhoto });
      await updateUserProfile(cleanName, cleanPhoto || null);
      toast.success("Profile updated");
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const since = memberSince(user);
  const verified = user.emailVerified;

  return (
    <section aria-labelledby="profile-name" className="relative isolate overflow-hidden">
      <PosterWall posters={posters} dim="bg-black/75" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-mm-bg to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-32 pb-12 sm:px-8 md:flex-row md:items-end lg:pt-40">
        <Avatar
          src={editing ? photoURL.trim() : user.photoURL}
          name={editing ? name : user.displayName}
          className="size-28 text-5xl shadow-2xl shadow-black/60 ring-4 ring-black/40 md:size-36 md:text-6xl"
        />

        {editing ? (
          <form onSubmit={save} noValidate className="flex w-full max-w-xl flex-col gap-4" aria-label="Edit profile">
            <h1 id="profile-name" className="font-display text-2xl font-extrabold text-mm-ink">
              Edit profile
            </h1>
            <TextField
              label="Your name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              error={errors.name}
              required
              autoFocus
            />
            <TextField
              label="Photo URL (optional)"
              name="photoURL"
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              error={errors.photoURL}
              hint="Paste a link to a picture. The preview updates as you type."
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="w-fit rounded-[3px] bg-mm-accent px-2 py-0.5 text-xs font-bold tracking-wider text-mm-on-accent uppercase">
                {planName} plan
              </span>
              <h1 id="profile-name" className="font-display text-4xl font-extrabold break-words text-mm-ink md:text-5xl">
                {user.displayName || "Movie fan"}
              </h1>
              <p className="break-all text-mm-muted">{user.email}</p>
              <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mm-muted">
                {since && (
                  <li className="flex items-center gap-1.5">
                    <FiCalendar aria-hidden="true" /> Member since {since}
                  </li>
                )}
                {verified && (
                  <li className="flex items-center gap-1.5 text-green-400">
                    <FiCheckCircle aria-hidden="true" /> Email verified
                  </li>
                )}
              </ul>
            </div>
            <Button variant="light" icon={<FiEdit2 />} onClick={openEditor} className="w-fit">
              Edit profile
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default ProfileBanner;
