import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Search, Filter, Save } from 'lucide-react';

const Attendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Authentication required.');

        const [eventRes, registrationsRes] = await Promise.all([
          fetch(`${API_URL}/api/events/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/events/${id}/registrations`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!eventRes.ok || !registrationsRes.ok) {
          throw new Error('Failed to fetch data.');
        }

        const eventJson = await eventRes.json();
        const registrationsJson = await registrationsRes.json();

        setEventData(eventJson.event || eventJson);
        setAttendees(registrationsJson.registrations.map(reg => ({
          userId: reg.user_id,
          name: reg.name,
          registrationNumber: reg.registration_number,
          email: reg.email,
          isPresent: reg.is_present
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id]);

  const toggleAttendance = (userId) => {
    setAttendees(prev =>
      prev.map(attendee =>
        attendee.userId === userId
          ? { ...attendee, isPresent: !attendee.isPresent }
          : attendee
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/events/${id}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ attendees })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save attendance.');
      }
      
      alert('Attendance saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAttendees = attendees.filter(attendee => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = attendee.name.toLowerCase().includes(searchLower) ||
                         (attendee.registrationNumber && attendee.registrationNumber.toLowerCase().includes(searchLower)) ||
                         attendee.email.toLowerCase().includes(searchLower);

    if (filterStatus === 'present') return matchesSearch && attendee.isPresent;
    if (filterStatus === 'absent') return matchesSearch && !attendee.isPresent;
    return matchesSearch;
  });

  const presentCount = attendees.filter(a => a.isPresent).length;
  const absentCount = attendees.length - presentCount;

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
                  <h1 className="text-3xl font-bold text-gray-900">{eventData?.title}</h1>
                  <p className="text-gray-600">{new Date(eventData?.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />
                <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600">{attendees.length}</div>
                <div className="text-sm text-gray-600">Total Registered</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <UserCheck className="text-green-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                  <UserX className="text-red-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <div className="text-sm text-gray-600">Absent</div>
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
                  <option value="all">All Students</option>
                  <option value="present">Present Only</option>
                  <option value="absent">Absent Only</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-medium text-gray-700 text-sm">
                <div>Name</div>
                <div>Registration Number</div>
                <div>Email</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAttendees.map((attendee) => (
                  <div key={attendee.userId} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">{attendee.name}</div>
                    <div className="text-gray-600">{attendee.registrationNumber}</div>
                    <div className="text-gray-600 text-sm">{attendee.email}</div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        attendee.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {attendee.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => toggleAttendance(attendee.userId)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          attendee.isPresent
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Mark {attendee.isPresent ? 'Absent' : 'Present'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredAttendees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
