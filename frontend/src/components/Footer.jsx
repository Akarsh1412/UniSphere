import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Events", path: "/events" },
    { name: "Community", path: "/community" },
    { name: "Clubs", path: "/clubs" },
  ];

  const contactInfo = [
    { icon: Mail, text: "info@unisphere.edu", type: "email" },
    { icon: Phone, text: "+91 912 2132 122", type: "phone" },
    {
      icon: MapPin,
      text: "VIT Bhopal University, Sehore, Madhya Pradesh",
      type: "address",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 border-2 border-white rounded-full relative">
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                UniSphere
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting students, fostering communities, and creating
              unforgettable experiences across campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    <ExternalLink
                      size={14}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-blue-400 group-hover:bg-gray-700 transition-all duration-300">
                    <contact.icon size={16} />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300 text-sm leading-relaxed">
                    {contact.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest events and updates.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-gray-400 text-sm text-center">
            © 2025 UniSphere. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
