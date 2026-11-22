import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/api";
import { planFor } from "../config/plans";
import ProfileBanner from "../components/profile/ProfileBanner";
import StatTiles from "../components/profile/StatTiles";
import MembershipCard from "../components/profile/MembershipCard";
import AccountDetails from "../components/profile/AccountDetails";

// The signed-in member's page: banner with inline edit, counters, plan and account
const Profile = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams(); // ?edit=1 opens the editor (old /edit-profile links)
  const [stats, setStats] = useState(null);
  const [planKey, setPlanKey] = useState("free");

  useEffect(() => {
    let alive = true;
    Promise.all([
      api.getMyList().then((r) => r.items.length),
      api.getMyMovies().then((m) => m.length),
      api.getMyReviews().then((r) => r.length),
    ])
      .then(([myList, moviesAdded, reviews]) => alive && setStats({ myList, moviesAdded, reviews }))
      .catch(() => alive && setStats({ myList: 0, moviesAdded: 0, reviews: 0 }));
    api
      .getMe()
      .then((me) => alive && setPlanKey(me.plan || "free"))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${user.displayName || "Your profile"} · Movie Matrix`}</title>
      </Helmet>

      <ProfileBanner planName={planFor(planKey).name} startEditing={searchParams.get("edit") === "1"} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-20 sm:px-8">
        <StatTiles stats={stats} />
        <div className="grid gap-6 lg:grid-cols-2">
          <MembershipCard planKey={planKey} />
          <AccountDetails />
        </div>
      </div>
    </>
  );
};

export default Profile;
