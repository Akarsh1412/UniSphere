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
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path="login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path='list' element={<List />} />
        <Route path='list/:id' element={<EventDetail />} />
        <Route path='add' element={<Add />} />
        <Route path="/list/:id/attendance" element={<Attendance />} />
        <Route path='announcement' element={<Announcement />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)