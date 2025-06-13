import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserCheck, UserX, Search, Filter } from 'lucide-react';

const Attendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [eventData] = useState({
    title: 'Tech Fest 2025',
    date: 'June 25, 2025',
    totalRegistered: 156,
    totalAttended: 142,
    totalAbsent: 14
  });

  const [attendees, setAttendees] = useState([
    { id: 1, name: 'John Doe', registrationNumber: 'CS2021001', isPresent: true, email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', registrationNumber: 'CS2021002', isPresent: true, email: 'jane.smith@example.com' },
    { id: 3, name: 'Mike Johnson', registrationNumber: 'CS2021003', isPresent: false, email: 'mike.johnson@example.com' },
    { id: 4, name: 'Sarah Wilson', registrationNumber: 'CS2021004', isPresent: true, email: 'sarah.wilson@example.com' },
    { id: 5, name: 'David Brown', registrationNumber: 'CS2021005', isPresent: false, email: 'david.brown@example.com' },
    { id: 6, name: 'Emily Davis', registrationNumber: 'CS2021006', isPresent: true, email: 'emily.davis@example.com' },
    { id: 7, name: 'Chris Miller', registrationNumber: 'CS2021007', isPresent: true, email: 'chris.miller@example.com' },
    { id: 8, name: 'Lisa Anderson', registrationNumber: 'CS2021008', isPresent: false, email: 'lisa.anderson@example.com' }
  ]);

  const toggleAttendance = (attendeeId) => {
    setAttendees(prev => 
      prev.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, isPresent: !attendee.isPresent }
          : attendee
      )
    );
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'present') return matchesSearch && attendee.isPresent;
    if (filterStatus === 'absent') return matchesSearch && !attendee.isPresent;
    return matchesSearch;
  });

  const presentCount = attendees.filter(a => a.isPresent).length;
  const absentCount = attendees.filter(a => !a.isPresent).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/list')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{eventData.title}</h1>
                  <p className="text-gray-600">{eventData.date}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600">{eventData.totalRegistered}</div>
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
                  <div key={attendee.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-900">{attendee.name}</div>
                    <div className="text-gray-600">{attendee.registrationNumber}</div>
                    <div className="text-gray-600 text-sm">{attendee.email}</div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        attendee.isPresent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendee.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => toggleAttendance(attendee.id)}
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
