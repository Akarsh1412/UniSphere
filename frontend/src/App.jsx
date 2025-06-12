import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
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
