import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnreadCount } from "../redux/chatSlice";
import NotificationListener from "./NotificationListener";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const user = useSelector(state => state.user) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUnreadCount());
    }
  }, [user, dispatch]);

  return (
    <>
      <NotificationListener />
      <Navbar />
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
