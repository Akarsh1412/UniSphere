import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    role: 'Normal',
    club: ''
  });

  const [preview, setPreview] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image type and size
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, profilePicture: 'Please select an image file' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image size should be less than 2MB' }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.role === 'Admin' && !formData.club) newErrors.club = 'Please select a club';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create a copy of formData without confirmPassword
      const { confirmPassword, ...userData } = formData;
      console.log('Form submitted:', userData);
      // Submit logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 max-w-xl w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome to UniSphere
          </h2>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        <form className="space-y-5" onSubmit={handleFormSubmit} noValidate>
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Your Name"
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm`}
              required
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              placeholder="your.email@university.edu"
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm`}
              required
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Registration Number Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number *</label>
            <input
              type="text"
              placeholder="University Registration ID"
              name='registrationNumber'
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 border ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm`}
              required
            />
            {errors.registrationNumber && <p className="mt-1 text-red-500 text-sm">{errors.registrationNumber}</p>}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm pr-10`}
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm shadow-sm pr-10`}
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center mt-2 gap-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="cursor-pointer bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Choose Image
                  <input
                    type="file"
                    name='ProfilePicture'
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 2MB)</p>
                {errors.profilePicture && <p className="mt-1 text-red-500 text-sm">{errors.profilePicture}</p>}
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type *</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => handleInputChange({ target: { name: 'role', value: 'Normal' }})}
                className={`px-4 py-3 rounded-xl border ${
                  formData.role === 'Normal' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                } transition-all duration-200 text-center`}
              >
                <span className={`font-medium ${formData.role === 'Normal' ? 'text-blue-600' : 'text-gray-600'}`}>
                  Student Account
                </span>
                <p className="text-xs text-gray-500 mt-1">Join clubs and events</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleInputChange({ target: { name: 'role', value: 'Admin' }})}
                className={`px-4 py-3 rounded-xl border ${
                  formData.role === 'Admin' 
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                    : 'border-gray-300 hover:border-gray-400'
                } transition-all duration-200 text-center`}
              >
                <span className={`font-medium ${formData.role === 'Admin' ? 'text-purple-600' : 'text-gray-600'}`}>
                  Club Admin
                </span>
                <p className="text-xs text-gray-500 mt-1">Manage club activities</p>
              </button>
            </div>
          </div>

          {/* Club Selection (Conditional) */}
          {formData.role === 'Admin' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Choose Club *</label>
              <select
                name='club'
                value={formData.club}
                onChange={handleInputChange}
                className={`mt-1 w-full px-4 py-3 border ${errors.club ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/60 backdrop-blur-sm shadow-sm`}
                required
              >
                <option value="">Select Club</option>
                <option value="CodingClub">Coding Club</option>
                <option value="CulturalClub">Cultural Club</option>
                <option value="DramaClub">Drama Club</option>
                <option value="PhotographyClub">Photography Club</option>
                <option value="SportsClub">Sports Club</option>
              </select>
              {errors.club && <p className="mt-1 text-red-500 text-sm">{errors.club}</p>}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline hover:text-purple-600 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;