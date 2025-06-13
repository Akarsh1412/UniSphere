import React, { useState } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, Award, Activity, Mail, UserCheck, Clock, Target, BarChart3, PieChart, Eye } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  const [analyticsData] = useState({
    totalClubs: 24,
    totalStudents: 2450,
    activeEvents: 8,
    totalBudget: 485000,
    monthlyGrowth: 12.5,
    eventAttendance: 89.2,
    eventsHeld: 156,
    emailsSent: 1250
  });

  const [clubStats] = useState([
    { name: 'Computer Science Club', students: 340, events: 12, budget: 85000, attendance: 142 },
    { name: 'Arts & Culture Society', students: 280, events: 18, budget: 65000, attendance: 287 },
    { name: 'Athletic Club', students: 220, events: 15, budget: 45000, attendance: 134 },
    { name: 'Entrepreneurship Club', students: 180, events: 8, budget: 72000, attendance: 89 },
    { name: 'Music Society', students: 160, events: 22, budget: 38000, attendance: 156 }
  ]);

  const [recentEvents] = useState([
    { id: 1, title: 'Tech Fest 2025', club: 'Computer Science Club', date: 'June 25, 2025', registrations: 156, status: 'Active' },
    { id: 2, title: 'Cultural Night', club: 'Arts & Culture Society', date: 'June 28, 2025', registrations: 287, status: 'Active' },
    { id: 3, title: 'Sports Championship', club: 'Athletic Club', date: 'July 2, 2025', registrations: 134, status: 'Upcoming' },
    { id: 4, title: 'Innovation Summit', club: 'Entrepreneurship Club', date: 'July 5, 2025', registrations: 89, status: 'Upcoming' }
  ]);

  const [monthlyData] = useState([
    { month: 'Jan', events: 15, budget: 45000, students: 2200 },
    { month: 'Feb', events: 18, budget: 52000, students: 2280 },
    { month: 'Mar', events: 22, budget: 68000, students: 2350 },
    { month: 'Apr', events: 20, budget: 61000, students: 2380 },
    { month: 'May', events: 25, budget: 75000, students: 2420 },
    { month: 'Jun', events: 28, budget: 85000, students: 2450 }
  ]);

  const mainStats = [
    {
      icon: Users,
      label: 'Total Students',
      value: analyticsData.totalStudents.toLocaleString(),
      change: `+${analyticsData.monthlyGrowth}%`,
      color: 'blue'
    },
    {
      icon: Calendar,
      label: 'Active Events',
      value: analyticsData.activeEvents,
      change: '+3 this week',
      color: 'green'
    },
    {
      icon: DollarSign,
      label: 'Total Budget',
      value: `₹${(analyticsData.totalBudget / 1000).toFixed(0)}K`,
      change: '+18% from last month',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Events Held',
      value: analyticsData.eventsHeld,
      change: '+12 this month',
      color: 'emerald'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Club Management Dashboard</h1>
                <p className="text-gray-600">Overview of all club activities and performance metrics</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mainStats.map((stat, index) => (
                <div key={index} className={`border rounded-lg p-6 ${getColorClasses(stat.color)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs opacity-75">{stat.change}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <BarChart3 size={20} />
                    <span>Monthly Performance</span>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Events</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Budget (K)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                      <div className="flex-1 flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Events: {data.events}</span>
                            <span>Budget: ₹{(data.budget / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(data.events / 30) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <PieChart size={20} />
                  <span>Quick Stats</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{analyticsData.totalClubs}</div>
                    <div className="text-sm text-gray-600">Active Clubs</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Event Attendance</span>
                      <span className="text-sm font-medium">{analyticsData.eventAttendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${analyticsData.eventAttendance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Events This Month</span>
                      <span className="text-sm font-medium">28</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <Mail size={16} />
                      <span className="text-sm font-medium">Communications</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{analyticsData.emailsSent}</div>
                    <div className="text-xs text-gray-500">Emails sent this month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Award size={20} />
                  <span>Club Overview</span>
                </h3>
                
                <div className="space-y-4">
                  {clubStats.map((club, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{club.name}</h4>
                          <div className="text-sm text-gray-600">{club.students} students • {club.events} events</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">₹{(club.budget / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">budget</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">People Attended</span>
                        <span className="text-xs font-medium">{club.attendance}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full" 
                          style={{ width: `${(club.attendance / club.students) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Activity size={20} />
                  <span>Recent Events</span>
                </h3>
                
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="text-sm text-gray-600">{event.club}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Users size={14} />
                          <span>{event.registrations} registered</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 mx-auto">
                    <Eye size={16} />
                    <span>View All Events</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
