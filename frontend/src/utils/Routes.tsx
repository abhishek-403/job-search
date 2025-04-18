import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firbaseConfig";
import Home from "../pages/Home";
import AuthPage from "../pages/Login";
import LoadingPage from "./LoadingPage";
import ProfilePage from "@/pages/Profile";

const ProtectedRoute = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingPage />;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const NotLoggedIn = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingPage />;

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<NotLoggedIn />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
