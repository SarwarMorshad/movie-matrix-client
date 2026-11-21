import { Outlet, useLocation } from "react-router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { hasHero } from "../utils/heroPages";

const MainLayout = () => {
  // The navbar is fixed. Pages with a hero slide under it; others start below it.
  const overlayNavbar = hasHero(useLocation().pathname);

  return (
    <div className="flex min-h-screen flex-col bg-mm-bg text-mm-ink">
      <Navbar />
      <main className={`flex grow flex-col ${overlayNavbar ? "" : "pt-16 lg:pt-[68px]"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
