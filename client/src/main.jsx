import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import App from './App'
import Home from './components/Home/Home'
import Events from './components/Events/Events'
import Media from './components/Media/Media'
import Clubs from './components/Clubs/Clubs'
import Login from './components/Login/Login'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='events' element={<Events />} />
      <Route path='media' element={<Media />} />
      <Route path='clubs' element={<Clubs />} />
      <Route path='login' element={<Login />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
