// src/hooks/useLogout.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/userSlice';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Clear user from Redux store
    dispatch(clearUser());
    
    // Redirect to login page
    navigate('/login');
  };

  return logout;
};