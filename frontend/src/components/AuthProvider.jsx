import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, clearUser } from '../redux/userSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;;

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get(`${API_URL}/api/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        dispatch(setUser(response.data.user));
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        dispatch(clearUser());
      });
    } else {
      dispatch(clearUser());
    }
  }, [dispatch]);

  return children;
};

export default AuthProvider;