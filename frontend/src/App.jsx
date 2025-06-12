import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from './pages/Home';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="mt-16">
        <Home />
      </div>
      <Footer />
    </>
  );
};

const AppLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="mt-16">
        {children}
      </div>
      <Footer />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />} />
      <Route path='/home' element={<AppLayout><Home /></AppLayout>} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;