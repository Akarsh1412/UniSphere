import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or registration number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showToast(firstError, 'error');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      localStorage.setItem('token', response.data.token);
      dispatch(setUser(response.data.user));
      
      showToast('Login successful! Welcome back.', 'success');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(errorMsg, 'error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email or Registration Number
            </label>
            <input
              type="text"
              placeholder="Enter your email or registration number"
              name='identifier'
              value={formData.identifier}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border ${
                errors.identifier ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm`}
              required
            />
            {errors.identifier && (
              <p className="mt-1 text-red-500 text-sm">{errors.identifier}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm pr-10`}
                required
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline hover:text-purple-600 transition-colors duration-200"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </div> 
  );
};

export default Login;
