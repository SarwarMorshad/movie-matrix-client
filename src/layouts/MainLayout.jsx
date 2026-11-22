import { Outlet, useLocation } from "react-router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { hasHero, isAuthPage } from "../utils/heroPages";

const MainLayout = () => {
  const { pathname } = useLocation();

  // Log in / sign up pages fill the screen on their own: no navbar or footer
  if (isAuthPage(pathname)) {
    return (
      <div className="flex min-h-screen flex-col bg-mm-bg text-mm-ink">
        <Outlet />
      </div>
    );
  }

  // The navbar is fixed. Pages with a hero slide under it; others start below it.
  return (
    <div className="flex min-h-screen flex-col bg-mm-bg text-mm-ink">
      <Navbar />
      <main className={`flex grow flex-col ${hasHero(pathname) ? "" : "pt-16 lg:pt-[68px]"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
