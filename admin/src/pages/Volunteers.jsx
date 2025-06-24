import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Search, Filter, Save, CheckCircle, XCircle } from 'lucide-react';

const Volunteers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
  const fetchVolunteersData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required.');

      const [eventRes, volunteersRes] = await Promise.all([
        fetch(`http://localhost:5000/api/events/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/events/${id}/volunteers`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!eventRes.ok || !volunteersRes.ok) {
        throw new Error('Failed to fetch data.');
      }

      const eventJson = await eventRes.json();
      const volunteersJson = await volunteersRes.json();      

      setEventData(eventJson.event || eventJson);
      
      // Fix: Add safety checks for the volunteers array
      const volunteersArray = volunteersJson.volunteers || volunteersJson || [];
      if (Array.isArray(volunteersArray)) {
        setVolunteers(volunteersArray.map(vol => ({
          userId: vol.user_id,
          name: vol.name,
          registrationNumber: vol.registration_number,
          email: vol.email,
          isPresent: vol.is_present,
          status: vol.status || 'pending'
        })));
      } else {
        setVolunteers([]); // Set empty array if no valid volunteers data
      }
    } catch (err) {
      setError(err.message);
      setVolunteers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  fetchVolunteersData();
}, [id]);


  const approveVolunteer = (userId) => {
    setVolunteers(prev =>
      prev.map(volunteer =>
        volunteer.userId === userId
          ? { ...volunteer, status: 'approved', isPresent: true }
          : volunteer
      )
    );
  };

  const rejectVolunteer = (userId) => {
    setVolunteers(prev =>
      prev.map(volunteer =>
        volunteer.userId === userId
          ? { ...volunteer, status: 'rejected', isPresent: false }
          : volunteer
      )
    );
  };

  const toggleAttendance = (userId) => {
    setVolunteers(prev =>
      prev.map(volunteer =>
        volunteer.userId === userId
          ? { ...volunteer, isPresent: !volunteer.isPresent }
          : volunteer
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      // Only send userId and isPresent for each volunteer
      const attendees = volunteers.map(v => ({
        userId: v.userId,
        isPresent: v.isPresent
      }));
      const response = await fetch(`http://localhost:5000/api/events/${id}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendees })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save volunteer data.');
      }

      alert('Volunteer data saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = volunteer.name?.toLowerCase().includes(searchLower) ||
                       volunteer.registrationNumber?.toLowerCase().includes(searchLower) ||
                       volunteer.email?.toLowerCase().includes(searchLower);

  if (filterStatus === 'present') return matchesSearch && volunteer.isPresent;
  if (filterStatus === 'absent') return matchesSearch && !volunteer.isPresent;
  if (filterStatus === 'approved') return matchesSearch && volunteer.status === 'approved';
  if (filterStatus === 'pending') return matchesSearch && volunteer.status === 'pending';
  if (filterStatus === 'rejected') return matchesSearch && volunteer.status === 'rejected';
  return matchesSearch;
});


  // Sort volunteers: approved/present first, then pending, then rejected
  const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
    if (a.status === 'approved' && a.isPresent && !(b.status === 'approved' && b.isPresent)) return -1;
    if (b.status === 'approved' && b.isPresent && !(a.status === 'approved' && a.isPresent)) return 1;
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return 0;
  });

  const presentCount = volunteers.filter(v => v.isPresent).length;
  const absentCount = volunteers.length - presentCount;
  const approvedCount = volunteers.filter(v => v.status === 'approved').length;
  const pendingCount = volunteers.filter(v => v.status === 'pending').length;

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/list')} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Volunteers - {eventData?.title}</h1>
                  <p className="text-gray-600">{new Date(eventData?.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600">{volunteers.length}</div>
                <div className="text-sm text-gray-600">Total Volunteers</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <UserCheck className="text-green-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                  <UserX className="text-yellow-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                  <CheckCircle className="text-purple-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-purple-600">{approvedCount}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, registration number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Volunteers</option>
                  <option value="present">Present Only</option>
                  <option value="absent">Absent Only</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 font-medium text-gray-700 text-sm">
                <div>Name</div>
                <div>Registration Number</div>
                <div>Email</div>
                <div>Status</div>
                <div>Attendance</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {sortedVolunteers.map((volunteer) => (
                  <div key={volunteer.userId} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">{volunteer.name}</div>
                    <div className="text-gray-600">{volunteer.registrationNumber}</div>
                    <div className="text-gray-600 text-sm">{volunteer.email}</div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                        volunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        volunteer.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {volunteer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveVolunteer(volunteer.userId)}
                            className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectVolunteer(volunteer.userId)}
                            className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {volunteer.status === 'approved' && (
                        <button
                          onClick={() => toggleAttendance(volunteer.userId)}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            volunteer.isPresent
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Mark {volunteer.isPresent ? 'Absent' : 'Present'}
                        </button>
                      )}
                      {volunteer.status === 'rejected' && (
                        <button
                          onClick={() => approveVolunteer(volunteer.userId)}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                        >
                          Re-approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {sortedVolunteers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No volunteers found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
