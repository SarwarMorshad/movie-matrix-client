// Movie genres members can pick. Keep in sync with the server's
// src/utils/movieInput.js, which rejects anything else.
export const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western",
];

export const FIRST_FILM_YEAR = 1888;
export const latestReleaseYear = () => new Date().getFullYear() + 5;
