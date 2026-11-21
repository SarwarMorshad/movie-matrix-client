import { useEffect, useRef } from "react";
import Button from "./Button";

/**
 * "Are you sure?" dialog for destructive actions, built on the native <dialog>
 * (focus is trapped, Escape cancels).
 *
 * <ConfirmDialog open={open} title="Delete this movie?" message="This can't be undone."
 *   confirmLabel="Delete" busy={deleting} onConfirm={remove} onCancel={() => setOpen(false)} />
 */
const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", busy = false, onConfirm, onCancel }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(92vw,420px)] rounded-lg border border-mm-border bg-mm-surface p-0 text-mm-ink shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex flex-col gap-3 p-6">
        <h2 id="confirm-title" className="font-display text-xl font-extrabold">
          {title}
        </h2>
        {message && <p className="text-sm leading-relaxed text-mm-muted">{message}</p>}
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy} autoFocus>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
