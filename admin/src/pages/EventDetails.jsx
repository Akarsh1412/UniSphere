import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, TrendingUp, Calendar, Clock, MapPin, UserCheck, Target, Award } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [eventData] = useState({
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
    totalCollection: 78000,
    budget: 150000,
    expenses: 125000,
    profit: 28000,
    attendanceRate: 91.0,
    registrationRate: 78.0,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    status: 'Completed'
  });

  const stats = [
    {
      icon: Users,
      label: 'Total Registrations',
      value: eventData.registrations,
      subtext: `${eventData.registrationRate}% of capacity`,
      color: 'blue'
    },
    {
      icon: UserCheck,
      label: 'Attendance',
      value: eventData.attended,
      subtext: `${eventData.attendanceRate}% attendance rate`,
      color: 'green'
    },
    {
      icon: DollarSign,
      label: 'Total Collection',
      value: `₹${eventData.totalCollection.toLocaleString()}`,
      subtext: 'From registrations',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Net Profit',
      value: `₹${eventData.profit.toLocaleString()}`,
      subtext: 'After expenses',
      color: 'emerald'
    }
  ];

  const financialData = [
    { label: 'Registration Revenue', amount: eventData.totalCollection, type: 'income' },
    { label: 'Total Budget', amount: eventData.budget, type: 'budget' },
    { label: 'Total Expenses', amount: eventData.expenses, type: 'expense' },
    { label: 'Net Profit/Loss', amount: eventData.profit, type: eventData.profit >= 0 ? 'profit' : 'loss' }
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

  const getFinancialColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'profit':
        return 'text-emerald-600';
      case 'loss':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="text-gray-600">{eventData.club}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {eventData.status}
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img 
                    src={eventData.image} 
                    alt={eventData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={18} />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={18} />
                    <span>{eventData.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{eventData.venue}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">{eventData.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">₹{eventData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Rate</span>
                      <span className="font-medium">{eventData.registrationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="font-medium text-green-600">{eventData.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className={`border rounded-lg p-6 ${getColorClasses(stat.color)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs opacity-75">{stat.subtext}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <DollarSign size={20} />
                  <span>Financial Overview</span>
                </h3>
                <div className="space-y-4">
                  {financialData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600">{item.label}</span>
                      <span className={`font-bold text-lg ${getFinancialColor(item.type)}`}>
                        ₹{Math.abs(item.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Budget Utilization</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${(eventData.expenses / eventData.budget) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((eventData.expenses / eventData.budget) * 100)}% of budget used
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Target size={20} />
                  <span>Performance Metrics</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Registration Target</span>
                      <span className="font-medium">{eventData.registrations}/{eventData.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${(eventData.registrations / eventData.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="font-medium">{eventData.attended}/{eventData.registrations}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${(eventData.attended / eventData.registrations) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                      <Award size={18} />
                      <span className="font-medium">Event Success Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((eventData.attendanceRate + eventData.registrationRate) / 2)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Based on registration and attendance rates
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
