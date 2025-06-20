import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Community from './pages/Community';
import Clubs from './pages/Clubs';
import Login from './pages/Login';
import EventDetail from './pages/EventDetail';
import ClubDetails from './pages/ClubDetails';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="community" element={<Community />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="clubs/:clubId" element={<ClubDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
