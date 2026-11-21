import { Link } from "react-router";

const VARIANTS = {
  primary: "bg-mm-accent text-mm-on-accent hover:bg-mm-accent-hover",
  light: "bg-mm-ink text-mm-bg hover:bg-mm-ink/80", // white "Play" button on dark heroes
  secondary: "bg-white/10 text-mm-ink border border-white/25 hover:bg-white/15",
  outline: "border border-mm-field text-mm-ink hover:border-mm-muted",
  dark: "bg-mm-footer text-mm-ink border border-mm-border hover:border-mm-field",
  ghost: "text-mm-muted hover:text-mm-ink hover:bg-white/5",
  danger: "border border-mm-danger text-mm-danger-ink hover:bg-mm-danger/10",
};

const SIZES = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-[18px] text-sm",
  lg: "h-12 px-6 text-sm",
};

/**
 * The one button used across the app.
 * Renders a router <Link> when `to` is given, an <a> for `href`, else a <button>.
 *
 * <Button>Save</Button>
 * <Button variant="outline" to="/movies">View all</Button>
 * <Button variant="primary" size="lg" icon={<FaPlay />} uppercase>View details</Button>
 */
const Button = ({
  variant = "primary",
  size = "md",
  to,
  href,
  icon,
  uppercase = false,
  className = "",
  children,
  type = "button",
  ...rest
}) => {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-card font-display font-bold whitespace-nowrap",
    "transition-colors duration-150 cursor-pointer",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-accent",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    uppercase ? "uppercase tracking-[0.06em]" : "",
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    className,
  ].join(" ");

  const content = (
    <>
      {icon && <span aria-hidden="true" className="flex">{icon}</span>}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default Button;
