import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeSocketConnection, disconnectSocket, getSocket } from "../socket";
import { fetchUnreadCount, incrementUnreadCount } from "../redux/chatSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      initializeSocketConnection(user);
      dispatch(fetchUnreadCount());

      const socket = getSocket();
      if (socket) {
        const handleMessage = () => dispatch(incrementUnreadCount());
        socket.on('newMessageNotification', handleMessage);

        return () => {
          socket.off('newMessageNotification', handleMessage);
          disconnectSocket();
        };
      }
    } else {
      disconnectSocket();
    }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
