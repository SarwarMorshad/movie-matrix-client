import Button from "./Button";

/**
 * Heading row for a content section: small accent eyebrow, big title, and an
 * optional "VIEW ALL" button on the right.
 *
 * <SectionHeader id="top-rated" eyebrow="Top rated" title="Top Rated Movies" action={{ label: "View all", to: "/movies" }} />
 */
const SectionHeader = ({ id, eyebrow, title, action, as: Heading = "h2" }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      {eyebrow && (
        <p className="mb-1.5 font-display text-xs font-bold tracking-[0.16em] text-mm-accent uppercase">{eyebrow}</p>
      )}
      <Heading id={id} className="font-display text-[30px] leading-tight font-extrabold text-mm-ink">
        {title}
      </Heading>
    </div>
    {action && (
      <Button variant="dark" size="sm" to={action.to} uppercase className="h-10 px-[18px]">
        {action.label}
      </Button>
    )}
  </div>
);

export default SectionHeader;
