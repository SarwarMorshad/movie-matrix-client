// Log in / sign up pages: full-screen poster background, navbar with just the logo
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/verify-email"];

export const isAuthPage = (pathname) => AUTH_PAGES.includes(pathname);

// Pages whose top section is a full-bleed hero: the fixed navbar sits on top of
// it (transparent until you scroll) instead of pushing the page down.
const HERO_PAGES = [/^\/$/, /^\/tv$/, /^\/tv\/\d+$/, /^\/movies\/[a-f\d]{24}$/i];

export const hasHero = (pathname) => isAuthPage(pathname) || HERO_PAGES.some((pattern) => pattern.test(pathname));
