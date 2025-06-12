import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Events from './pages/Events'
import Community from './pages/Community'
import Clubs from './pages/Clubs'
import Login from './pages/Login'
import EventDetail from './pages/EventDetail'
import ClubsDetails from './pages/ClubDetails'
import Signup from './pages/Signup'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='events' element={<Events />} /> 
      <Route path='events/:id' element={<EventDetail />} /> 
      <Route path='community' element={<Community />} />
      <Route path='clubs' element={<Clubs />} />
      <Route path='clubs/:clubid' element={<ClubsDetails />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)