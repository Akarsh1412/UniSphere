import { useState, useEffect } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnreadCount } from "../redux/chatSlice";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const { unreadCount } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const logout = useLogout();

  const navItems = [
    { name: "Events", path: "/events" },
    { name: "Community", path: "/community" },
    { name: "Clubs", path: "/clubs" },
    { name: "Messages", path: "/chat", icon: MessageSquare, showBadge: true },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Fetch unread count when component mounts and user is authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());

      // Set up interval to periodically check for new messages
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const firstName = user?.name?.split(" ")[0] || null;
  const isAuthenticated = !!user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <div className="w-6 h-6 border-2 border-white rounded-full relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
              UniSphere
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              // Special handling for Messages item
              if (item.name === "Messages") {
                return isAuthenticated ? (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `relative px-3 py-2 text-sm font-medium transition-all duration-300 group flex items-center space-x-1 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.name}</span>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium ring-2 ring-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                ) : null;
              }

              // Regular nav items
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center space-x-3 group transition-all duration-300"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
                    {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="font-medium text-gray-700 group-hover:text-blue-600 hidden lg:inline">
                  {firstName || "Profile"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
              >
                <span className="relative z-10">Login</span>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="pt-4 space-y-2">
            {navItems.map((item) => {
              // Special handling for Messages item in mobile
              if (item.name === "Messages") {
                return isAuthenticated ? (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </NavLink>
                ) : null;
              }

              // Regular nav items for mobile
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}

            {isAuthenticated ? (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-base font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg text-center hover:shadow-lg transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
