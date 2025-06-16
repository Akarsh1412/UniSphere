import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, clearUser } from '../redux/userSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Verify token and get user data
      axios.get('http://localhost:5000/api/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // Token is valid, set user data
        dispatch(setUser(response.data.user));
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        // Token is invalid, clear it
        localStorage.removeItem('token');
        dispatch(clearUser());
      });
    } else {
      // No token, ensure user is cleared
      dispatch(clearUser());
    }
  }, [dispatch]);

  return children;
};

export default AuthProvider;