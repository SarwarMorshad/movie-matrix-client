import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Page numbers to show, with "…" gaps: 1 … 4 5 6 … 12
const pageList = (page, total) => {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["gap-" + p, p] : [p]));
};

/**
 * ‹ Prev  1 … 4 [5] 6 … 12  Next ›
 * <Pagination page={page} totalPages={totalPages} onChange={setPage} />
 */
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const box =
    "flex h-[42px] min-w-[42px] items-center justify-center rounded-card border border-mm-border px-3 text-sm transition-colors";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${box} gap-1 text-mm-muted hover:border-mm-field hover:text-mm-ink disabled:pointer-events-none disabled:opacity-40`}
      >
        <FiChevronLeft aria-hidden="true" /> Prev
      </button>
      {pageList(page, totalPages).map((p) =>
        typeof p === "string" ? (
          <span key={p} aria-hidden="true" className="px-1 text-mm-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`${box} ${
              p === page
                ? "border-mm-accent bg-mm-accent font-extrabold text-mm-on-accent"
                : "text-mm-ink hover:border-mm-field"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={`${box} gap-1 text-mm-ink hover:border-mm-field disabled:pointer-events-none disabled:opacity-40`}
      >
        Next <FiChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
