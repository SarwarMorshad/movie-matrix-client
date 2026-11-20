const SIZES = { sm: "size-5 border-2", md: "size-9 border-[3px]", lg: "size-14 border-4" };

/**
 * Loading indicator in the accent colour.
 * <Spinner /> · <Spinner size="lg" label="Loading movies" /> · <Spinner fullPage />
 */
const Spinner = ({ size = "md", label = "Loading", fullPage = false }) => {
  const spinner = (
    <span role="status" className="inline-flex items-center justify-center">
      <span
        aria-hidden="true"
        className={`${SIZES[size] ?? SIZES.md} animate-spin rounded-full border-mm-raised border-t-mm-accent`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );

  if (!fullPage) return spinner;
  return <div className="flex min-h-[60vh] items-center justify-center bg-mm-bg">{spinner}</div>;
};

export default Spinner;
