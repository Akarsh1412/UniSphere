import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { updateUser } from '../redux/userSlice'; // Import updateUser action
import axios from 'axios';
import { User, Mail, Calendar, Shield, CheckCircle, Clock, LogOut, Edit, TrendingUp, Users, FileText, Heart, ChevronDown, ChevronUp } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const logout = useLogout();
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    registrationNumber: '',
    profilePicture: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Stats states
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [userClubs, setUserClubs] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Initialize edit form with current user data
      setEditForm({
        name: user.name || '',
        registrationNumber: user.registrationNumber || '',
        profilePicture: null
      });
    }
  }, [user, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      if (editForm.name.trim() !== user.name) {
        formData.append('name', editForm.name.trim());
      }
      
      if (editForm.registrationNumber.trim() !== (user.registrationNumber || '')) {
        formData.append('registrationNumber', editForm.registrationNumber.trim());
      }
      
      if (editForm.profilePicture) {
        formData.append('profilePicture', editForm.profilePicture);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update Redux store with new user data
        dispatch(updateUser(response.data.user));
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user stats
  const fetchStats = async () => {
    if (stats) return; // Don't fetch if already loaded
    
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, clubsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/users/clubs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }
      
      if (clubsResponse.data.success) {
        setUserClubs(clubsResponse.data.clubs);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Toggle stats dropdown
  const toggleStats = () => {
    setShowStats(prev => {
      if (!prev) {
        fetchStats(); // Fetch stats when opening
      }
      return !prev;
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name || '',
      registrationNumber: user.registrationNumber || '',
      profilePicture: null
    });
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Registration No.</span>
                  </div>
                  <span className="text-sm font-medium">
                    {user.registrationNumber || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Account Status</p>
                    <p className="text-xs text-green-700">
                      {user.verified ? (
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Verification
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Role</p>
                    <p className="text-xs text-blue-700 capitalize">
                      {user.role || 'student'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">Member Since</p>
                    <p className="text-xs text-purple-700">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dropdown */}
            <div className="mb-8">
              <button
                onClick={toggleStats}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">View Detailed Stats</span>
                </div>
                {showStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showStats && (
                <div className="mt-4 bg-gray-50 rounded-lg p-6 border">
                  {statsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading stats...</p>
                    </div>
                  ) : stats ? (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Activity Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{stats.clubsJoined}</p>
                          <p className="text-sm text-gray-600">Clubs Joined</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{stats.eventsRegistered}</p>
                          <p className="text-sm text-gray-600">Events Registered</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{stats.postsCreated}</p>
                          <p className="text-sm text-gray-600">Posts Created</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{stats.likesReceived}</p>
                          <p className="text-sm text-gray-600">Likes Received</p>
                        </div>
                      </div>

                      {userClubs.length > 0 && (
                        <div>
                          <h5 className="text-md font-semibold text-gray-900 mb-3">Your Clubs</h5>
                          <div className="space-y-2">
                            {userClubs.map(club => (
                              <div key={club.id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                                <div>
                                  <p className="font-medium text-gray-900">{club.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {club.role} • {club.members_count} members
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500">
                                  Joined {new Date(club.joined_at).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">Failed to load stats</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Registration Number</p>
                        <input
                          type="text"
                          name="registrationNumber"
                          value={editForm.registrationNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter registration number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">{user.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Registration Number</p>
                        <p className="text-sm text-gray-600">
                          {user.registrationNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                        <p className="text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Account Status</h4>
                  <p className="text-sm text-blue-700">
                    {user.verified 
                      ? "Your account is fully verified. You have access to all platform features."
                      : "Your account is pending verification. Some features may be limited until your account is verified."
                    }
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={logout}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
