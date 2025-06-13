import React, { useState } from 'react';
import { Calendar, Users, Eye, UserCheck, MapPin, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const navigate = useNavigate();
  
  const [events] = useState([
    {
      id: 1,
      title: 'Tech Fest 2025',
      club: 'Computer Science Club',
      date: 'June 25, 2025',
      time: '10:00 AM - 6:00 PM',
      venue: 'Main Auditorium',
      price: 500,
      capacity: 200,
      registrations: 156,
      attended: 142,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Cultural Night',
      club: 'Arts & Culture Society',
      date: 'June 28, 2025',
      time: '7:00 PM - 11:00 PM',
      venue: 'Open Theatre',
      price: 300,
      capacity: 300,
      registrations: 287,
      attended: 275,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Sports Championship',
      club: 'Athletic Club',
      date: 'July 2, 2025',
      time: '9:00 AM - 5:00 PM',
      venue: 'Sports Complex',
      price: 200,
      capacity: 150,
      registrations: 134,
      attended: 128,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Innovation Summit',
      club: 'Entrepreneurship Club',
      date: 'July 5, 2025',
      time: '10:00 AM - 4:00 PM',
      venue: 'Conference Hall',
      price: 400,
      capacity: 100,
      registrations: 89,
      attended: 0,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
      status: 'Upcoming'
    }
  ]);

  const handleViewEvent = (eventId) => {
    navigate(`/list/${eventId}`);
  };

  const handleAttendance = (eventId) => {
    navigate(`/list/${eventId}/attendance`);
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
                            {event.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{event.club}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign size={14} />
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
                          {event.registrations}/{event.capacity}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((event.registrations / event.capacity) * 100)}% filled
                        </div>
                      </div>

                      {event.status === 'Completed' && (
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                            <UserCheck size={14} />
                            <span>Attended</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {event.attended}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((event.attended / event.registrations) * 100)}% attendance
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleViewEvent(event.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        
                        {(event.status === 'Active' || event.status === 'Completed') && (
                          <button
                            onClick={() => handleAttendance(event.id)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <UserCheck size={16} />
                            <span>Attendance</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
