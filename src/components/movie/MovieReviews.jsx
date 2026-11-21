import { useContext, useState } from "react";
import { useLocation } from "react-router";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import * as api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Button, ConfirmDialog, RatingPicker } from "../ui";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

// Write or edit a review
const ReviewForm = ({ initial, busy, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");

  const submit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Pick a score from 1 to 10");
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-lg border border-mm-border bg-mm-surface p-5 sm:p-6">
      <RatingPicker value={rating} onChange={setRating} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-text" className="text-sm font-semibold text-mm-ink">
          Your review <span className="font-normal text-mm-muted">(optional)</span>
        </label>
        <textarea
          id="review-text"
          rows={4}
          maxLength={2000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think?"
          className="resize-y rounded-card border border-mm-field bg-mm-bg px-3.5 py-3 text-[15px] text-mm-ink focus:border-mm-accent focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" uppercase disabled={busy}>
          {busy ? "Saving…" : initial ? "Save changes" : "Post review"}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

/**
 * Reviews & Ratings for a movie: community score, your own review
 * (write / edit / delete) and everyone else's.
 */
const MovieReviews = ({ movieId, reviews, communityRating, onChanged }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mine = user ? reviews.find((r) => r.userEmail?.toLowerCase() === user.email?.toLowerCase()) : null;
  const others = reviews.filter((r) => r !== mine);

  const save = async (values) => {
    setBusy(true);
    try {
      if (mine) {
        await api.updateReview(mine._id, values);
        toast.success("Review updated");
      } else {
        await api.addReview({ movieId, ...values, userName: user.displayName, userPhoto: user.photoURL });
        toast.success("Thanks for your review!");
      }
      setEditing(false);
      await onChanged();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save your review");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteReview(mine._id);
      toast.success("Review deleted");
      setConfirmDelete(false);
      await onChanged();
    } catch {
      toast.error("Couldn't delete your review");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="reviews-title" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 font-display text-xs font-bold tracking-[0.16em] text-mm-accent uppercase">Community</p>
          <h2 id="reviews-title" className="font-display text-[30px] leading-tight font-extrabold text-mm-ink">
            Reviews &amp; Ratings
          </h2>
        </div>
        <p className="text-sm text-mm-muted">
          {reviews.length ? (
            <>
              <span className="font-display text-2xl font-extrabold text-mm-ink">★ {communityRating}</span> / 10 from{" "}
              {reviews.length} review{reviews.length > 1 ? "s" : ""}
            </>
          ) : (
            "No reviews yet"
          )}
        </p>
      </div>

      {/* Your review: form, your posted review, or a prompt to log in */}
      {!user ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-mm-field p-5">
          <p className="text-mm-muted">Log in to rate this movie and share your review.</p>
          <Button variant="outline" to="/login" state={{ from: location }}>
            Log in
          </Button>
        </div>
      ) : !mine || editing ? (
        <ReviewForm initial={mine} busy={busy} onSubmit={save} onCancel={mine ? () => setEditing(false) : undefined} />
      ) : null}

      {reviews.length > 0 && (
        <ul className="flex flex-col gap-3">
          {[...(mine && !editing ? [mine] : []), ...others].map((r) => {
            const isMine = r === mine;
            return (
              <li
                key={r._id}
                className={`flex gap-4 rounded-lg border p-5 ${isMine ? "border-mm-accent/60 bg-mm-accent/5" : "border-mm-border bg-mm-surface"}`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mm-raised font-display font-extrabold text-mm-accent">
                  {r.userPhoto ? (
                    <img src={r.userPhoto} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
                  ) : (
                    (r.userName || "?").charAt(0).toUpperCase()
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-mm-ink">
                      {r.userName || "Anonymous"}
                      {isMine && <span className="ml-2 text-xs font-bold tracking-wider text-mm-accent uppercase">Your review</span>}
                    </p>
                    <span className="rounded-[3px] border-[1.5px] border-mm-accent px-2 py-px text-sm font-bold text-mm-ink">
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-xs text-mm-muted">
                    {formatDate(r.createdAt)}
                    {r.updatedAt && " · edited"}
                  </p>
                  {r.comment && <p className="text-[15px] leading-relaxed whitespace-pre-line text-mm-ink/90">{r.comment}</p>}
                  {isMine && (
                    <div className="mt-1 flex gap-2">
                      <Button size="sm" variant="outline" icon={<FiEdit2 />} onClick={() => setEditing(true)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setConfirmDelete(true)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete your review?"
        message="Your score and comment will be removed. This can't be undone."
        confirmLabel="Delete review"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </section>
  );
};

export default MovieReviews;
