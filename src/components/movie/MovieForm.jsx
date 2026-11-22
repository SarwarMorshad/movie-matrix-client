import { useState } from "react";
import { Button, PosterCard, TextField } from "../ui";
import { FIRST_FILM_YEAR, GENRES, latestReleaseYear } from "../../config/movies";

const EMPTY = {
  title: "",
  genre: "",
  releaseYear: "",
  director: "",
  cast: "",
  rating: "",
  duration: "",
  plotSummary: "",
  posterUrl: "",
  language: "",
  country: "",
};

const isHttpUrl = (text) => {
  try {
    return ["http:", "https:"].includes(new URL(text).protocol);
  } catch {
    return false;
  }
};

// Same rules as the server; returns { field: message } for anything wrong
const validate = (v) => {
  const errors = {};
  const year = Number(v.releaseYear);
  const rating = Number(v.rating);
  const duration = Number(v.duration);
  if (!v.title.trim()) errors.title = "Enter the movie's title.";
  if (!GENRES.includes(v.genre)) errors.genre = "Pick a genre.";
  if (!Number.isInteger(year) || year < FIRST_FILM_YEAR || year > latestReleaseYear()) {
    errors.releaseYear = `Use a year between ${FIRST_FILM_YEAR} and ${latestReleaseYear()}.`;
  }
  if (!v.director.trim()) errors.director = "Enter the director.";
  if (!v.cast.trim()) errors.cast = "Enter at least one cast member.";
  if (v.rating === "" || !Number.isFinite(rating) || rating < 0 || rating > 10) errors.rating = "Use a rating from 0 to 10.";
  if (!Number.isInteger(duration) || duration < 1 || duration > 900) errors.duration = "Use whole minutes, 1 to 900.";
  if (v.plotSummary.trim().length < 10) errors.plotSummary = "Write at least a sentence (10+ characters).";
  if (!isHttpUrl(v.posterUrl.trim())) errors.posterUrl = "Use a link that starts with http:// or https://";
  if (!v.language.trim()) errors.language = "Enter the language.";
  if (!v.country.trim()) errors.country = "Enter the country.";
  return errors;
};

// The values the API expects
const toMovie = (v) => ({
  title: v.title.trim(),
  genre: v.genre,
  releaseYear: Number(v.releaseYear),
  director: v.director.trim(),
  cast: v.cast.trim(),
  rating: Number(v.rating),
  duration: Number(v.duration),
  plotSummary: v.plotSummary.trim(),
  posterUrl: v.posterUrl.trim(),
  language: v.language.trim(),
  country: v.country.trim(),
});

const Section = ({ title, children }) => (
  <fieldset className="flex flex-col gap-5 rounded-card border border-mm-border bg-mm-surface p-5 sm:p-6">
    <legend className="sr-only">{title}</legend>
    <p aria-hidden="true" className="text-xs font-semibold tracking-[0.2em] text-mm-accent uppercase">
      {title}
    </p>
    {children}
  </fieldset>
);

/**
 * Add / edit movie form with a live preview of the poster card.
 * `onSubmit(movie)` must return a promise; a rejected one shows the server's message.
 *
 * <MovieForm submitLabel="Add movie" onSubmit={api.addMovie} onCancel={() => navigate(-1)} />
 * <MovieForm initial={movie} submitLabel="Save changes" onSubmit={(m) => api.updateMovie(id, m)} />
 */
const MovieForm = ({ initial, submitLabel, onSubmit, onCancel }) => {
  const [values, setValues] = useState(() => {
    const start = { ...EMPTY };
    for (const key of Object.keys(EMPTY)) if (initial?.[key] != null) start[key] = String(initial[key]);
    return start;
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      if (errors[name]) setErrors(({ [name]: _gone, ...rest }) => rest); // clear as they fix it
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) {
      // Take them to the first problem
      e.target.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSubmit(toMovie(values));
    } catch (error) {
      setFormError(error.response?.data?.message || "Couldn't save the movie. Please try again.");
      setSaving(false);
    }
  };

  // What the card will look like in the catalog
  const preview = {
    _id: "preview",
    title: values.title.trim() || "Movie title",
    releaseYear: values.releaseYear || "Year",
    rating: values.rating === "" ? null : Number(values.rating),
    duration: Number(values.duration) || null,
    language: values.language.trim() || "Language",
    genre: values.genre || null,
    posterUrl: isHttpUrl(values.posterUrl.trim()) ? values.posterUrl.trim() : "",
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="flex flex-col gap-6">
        {formError && (
          <p role="alert" className="rounded-card bg-mm-danger/15 px-4 py-3 text-sm font-medium text-mm-danger-ink">
            {formError}
          </p>
        )}

        <Section title="The basics">
          <TextField label="Title" maxLength={150} required {...field("title")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField as="select" label="Genre" options={GENRES} placeholder="Pick a genre" required {...field("genre")} />
            <TextField
              label="Release year"
              type="number"
              inputMode="numeric"
              min={FIRST_FILM_YEAR}
              max={latestReleaseYear()}
              required
              {...field("releaseYear")}
            />
          </div>
        </Section>

        <Section title="People">
          <TextField label="Director" maxLength={100} required {...field("director")} />
          <TextField label="Cast" maxLength={400} hint="Separate names with commas." required {...field("cast")} />
        </Section>

        <Section title="Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Rating (0–10)" type="number" step="0.1" min="0" max="10" inputMode="decimal" required {...field("rating")} />
            <TextField label="Runtime (minutes)" type="number" min="1" max="900" inputMode="numeric" required {...field("duration")} />
            <TextField label="Language" maxLength={40} required {...field("language")} />
            <TextField label="Country" maxLength={60} required {...field("country")} />
          </div>
        </Section>

        <Section title="Story and poster">
          <TextField
            as="textarea"
            label="Plot summary"
            rows={5}
            maxLength={2000}
            hint={`${values.plotSummary.length} / 2000`}
            required
            {...field("plotSummary")}
          />
          <TextField
            label="Poster URL"
            type="url"
            maxLength={500}
            hint="A portrait image link (2:3) looks best. The preview updates as you type."
            required
            {...field("posterUrl")}
          />
        </Section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving…" : submitLabel}
          </Button>
          {onCancel && (
            <Button variant="ghost" size="lg" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <aside aria-label="Preview" className="flex flex-col gap-3 lg:sticky lg:top-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-mm-muted uppercase">Preview</p>
        <div inert className="w-48 sm:w-56 lg:w-full">
          <PosterCard key={preview.posterUrl} movie={preview} />
        </div>
        {(values.director.trim() || values.plotSummary.trim()) && (
          <div className="flex flex-col gap-2 rounded-card border border-mm-border bg-mm-surface p-4 text-sm">
            {values.director.trim() && (
              <p className="text-mm-muted">
                Directed by <span className="text-mm-ink">{values.director.trim()}</span>
              </p>
            )}
            {values.plotSummary.trim() && <p className="line-clamp-4 leading-relaxed text-mm-muted">{values.plotSummary.trim()}</p>}
          </div>
        )}
      </aside>
    </form>
  );
};

export default MovieForm;
