// src/pages/Profile.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout'; // Import your custom hook

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const logout = useLogout(); // Use your custom logout hook
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white/30 object-cover shadow-lg"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-blue-100 mb-4">{user.email}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm font-medium">Registration No.</p>
                    <p className="font-bold">{user.registrationNumber || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="font-bold">
                      {user.verified ? (
                        <span className="text-green-300">Verified</span>
                      ) : (
                        <span className="text-yellow-300">Pending Verification</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm font-medium">Role</p>
                    <p className="font-bold capitalize">{user.role || 'student'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Account Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">{user.registrationNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Account Actions</h2>
                
                <div className="space-y-4">
                  <Link 
                    to="/update-profile" 
                    className="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                  
                  <Link 
                    to="/change-password" 
                    className="block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-center font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Change Password
                  </Link>
                  
                  <button
                    onClick={logout} // Use the logout function from your hook
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-700">
                  {user.verified
                    ? "Your account is fully verified. You have access to all platform features."
                    : "Your account is pending verification. Some features may be limited until your account is verified."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;