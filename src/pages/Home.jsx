import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Spinner } from "../components/ui";
import BrowseHome from "./BrowseHome";
import Landing from "./Landing";

// "/" shows the landing page to visitors and the streaming home to members
const Home = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner fullPage />;
  return user ? <BrowseHome /> : <Landing />;
};

export default Home;
