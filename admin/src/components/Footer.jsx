import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UniSphere Admin Panel. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
