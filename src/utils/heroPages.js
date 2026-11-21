// Pages whose top section is a full-bleed hero: the fixed navbar sits on top of
// it (transparent until you scroll) instead of pushing the page down.
const HERO_PAGES = [/^\/$/, /^\/tv$/, /^\/tv\/\d+$/, /^\/movies\/[a-f\d]{24}$/i];

export const hasHero = (pathname) => HERO_PAGES.some((pattern) => pattern.test(pathname));
