import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('isAdminAuthenticated')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="mt-15">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;