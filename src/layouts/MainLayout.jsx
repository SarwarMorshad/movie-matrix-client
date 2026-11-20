import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-mm-bg text-mm-ink">
    <Navbar />
    <main className="flex grow flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
