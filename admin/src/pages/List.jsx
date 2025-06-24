import React, { useEffect, useState } from 'react';
import { Calendar, Users, Eye, UserCheck, MapPin, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewEvent = (eventId) => {
    navigate(`/list/${eventId}`);
  };

  const handleAttendance = (eventId) => {
    navigate(`/list/${eventId}/attendance`);
  };

  const handleVolunteers = (eventId) => {
    navigate(`/list/${eventId}/volunteers`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <div className="text-sm text-gray-500">
                Total Events: {events.length}
              </div>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                            {event.status || 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.club_name || '-'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{event.time_start}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>₹{event.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                          <Users size={14} />
                          <span>Registrations</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {parseInt(event.registrations_count, 10) || 0}/{event.capacity}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleViewEvent(event.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleAttendance(event.id)}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <UserCheck size={16} />
                          <span>Attendance</span>
                        </button>
                        <button
                          onClick={() => handleVolunteers(event.id)}
                          className="flex items-center space-x-2 px-4 py-2 border border-yellow-400 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-50 transition-colors"
                        >
                          <Users size={16} />
                          <span>Manage Volunteers</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center text-gray-500 py-10">No events found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
