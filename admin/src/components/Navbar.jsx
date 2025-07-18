import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, PlusSquare, List, Megaphone, LogIn, LogOut, Users } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Add', icon: PlusSquare, href: '/add' },
    { name: 'List', icon: List, href: '/list' },
    { name: 'Clubs', icon: Users, href: '/clubs' },
    { name: 'Announcements', icon: Megaphone, href: '/announcement' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20 shadow-sm">
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
              UniSphere Admin
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `relative px-4 py-2 text-sm font-medium transition-all duration-300 group flex items-center space-x-2 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-full overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <NavLink
                to="/login"
                className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <LogIn size={18} />
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NavLink>
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

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-96 opacity-100 pb-6'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pt-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 bg-gray-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full mt-4 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <LogIn size={18} />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
