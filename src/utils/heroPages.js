// Pages whose top section is a full-bleed hero: the fixed navbar sits on top of
// it (transparent until you scroll) instead of pushing the page down.
const HERO_PAGES = [/^\/$/, /^\/tv$/, /^\/tv\/\d+$/, /^\/movies\/[a-f\d]{24}$/i, /^\/profile$/];

export const hasHero = (pathname) => HERO_PAGES.some((pattern) => pattern.test(pathname));

// Log in / sign up pages: a full-screen split layout with no navbar or footer
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/verify-email"];

export const isAuthPage = (pathname) => AUTH_PAGES.includes(pathname);
