import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import EventDetail from './pages/EventDetails'
import Login from './pages/Login'
import Announcement from './pages/Announcement'
import Attendance from './pages/Attendance'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Dashboard />} />
      <Route path='list' element={<List />} /> 
      <Route path='list/:id' element={<EventDetail />} /> 
      <Route path='add' element={<Add />} />
      <Route path='login' element={<Login />} />
      <Route path="/list/:id/attendance" element={<Attendance />} />
      <Route path='announcement' element={<Announcement />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)