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

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());

      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Original Logo - Keep as is */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.name === "Messages") {
                return isAuthenticated ? (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-sm font-semibold transition-all duration-300 group flex items-center space-x-2 rounded-lg ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.name}</span>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold ring-2 ring-white shadow-lg">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ) : null;
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold transition-all duration-300 group rounded-lg ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center space-x-3 group transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400 transition-colors shadow-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white font-bold shadow-md group-hover:bg-purple-700 transition-colors">
                    {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 hidden lg:inline">
                  {firstName || "Profile"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="pt-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg mt-2 border border-gray-200/50 shadow-lg">
            {navItems.map((item) => {
              if (item.name === "Messages") {
                return isAuthenticated ? (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 mx-2 ${
                        isActive
                          ? "text-blue-600 bg-blue-100"
                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-md">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </NavLink>
                ) : null;
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 mx-2 ${
                      isActive
                        ? "text-blue-600 bg-blue-100"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}

            {isAuthenticated ? (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 mx-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-base font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm shadow-sm">
                      {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span>My Profile</span>
                </Link>
              </div>
            ) : (
              <div className="mt-4 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
