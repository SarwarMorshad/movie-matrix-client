import { Outlet, useLocation } from "react-router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  // The navbar is fixed. Home's hero slides under it; other pages start below it.
  const isHome = useLocation().pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-mm-bg text-mm-ink">
      <Navbar />
      <main className={`flex grow flex-col ${isHome ? "" : "pt-16 lg:pt-[68px]"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
