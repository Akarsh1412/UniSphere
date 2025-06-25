import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, DollarSign, Award, Activity, Mail, UserCheck, Clock, Target, BarChart3, PieChart, Eye, X, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClubDetails, setShowClubDetails] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [analyticsData, setAnalyticsData] = useState({
    totalClubs: 0,
    totalCapacity: 350,
    totalUsers: 0,
    totalRegistered: 0,
    totalAttended: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    eventAttendance: 0,
    eventsHeld: 0,
    emailsSent: 0
  });

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [clubStats, setClubStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const clubsResponse = await fetch(`${API_URL}/api/clubs?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const clubsData = await clubsResponse.json();
      
      if (!clubsData.success) {
        throw new Error(clubsData.message || 'Failed to fetch clubs');
      }
      
      const clubsList = clubsData.clubs || [];
      setClubs(clubsList);

      const eventsResponse = await fetch(`${API_URL}/api/events?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const eventsData = await eventsResponse.json();
      
      if (!eventsData.success) {
        throw new Error(eventsData.message || 'Failed to fetch events');
      }
      
      const eventsList = eventsData.events || [];
      setEvents(eventsList);

      const revenueResponse = await fetch(`${API_URL}/api/clubs/revenue/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const revenueData = await revenueResponse.json();
      
      let totalRevenue = 0;
      let totalRegistered = 0;
      
      if (revenueData.success && revenueData.clubs) {
        totalRevenue = revenueData.clubs.reduce((sum, club) => {
          const revenue = club.total_revenue !== null ? parseFloat(club.total_revenue) || 0 : 0;
          return sum + revenue;
        }, 0);
        
        totalRegistered = revenueData.clubs.reduce((sum, club) => {
          return sum + (parseInt(club.total_registrations) || 0);
        }, 0);
      }

      const totalClubs = clubsList.length;
      const eventsHeld = eventsList.length;

      const sortedEvents = eventsList
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4)
        .map(event => ({
          id: event.id,
          title: event.title,
          club: event.club_name || 'Unknown Club',
          date: new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          registrations: event.registrations_count || 0,
          status: new Date(event.date) >= new Date() ? 'Upcoming' : 'Completed',
          price: event.price || 0,
          attendance: event.attendance || 0
        }));

      setRecentEvents(sortedEvents);

      const totalAttended = sortedEvents.reduce((sum, event) => sum + (event.attendance || 0), 0);

      setAnalyticsData({
        totalClubs,
        totalCapacity: 350,
        totalUsers: 0,
        totalRegistered,
        totalAttended,
        totalRevenue,
        monthlyGrowth: 0,
        eventAttendance: 0,
        eventsHeld,
        emailsSent: 0
      });

      const clubStatsWithRevenue = clubsList.slice(0, 5).map(club => {
        const clubRevenueData = revenueData.success ? 
          revenueData.clubs.find(c => c.club_id === club.id) : null;
        
        const clubRevenue = clubRevenueData && clubRevenueData.total_revenue !== null ? 
          parseFloat(clubRevenueData.total_revenue) || 0 : 0;
        
        return {
          id: club.id,
          name: String(club.name || 'Unknown Club'),
          students: Number(club.members_count || 0),
          events: Number(club.events_count || 0),
          revenue: Number(clubRevenue),
          registrations: Number(clubRevenueData ? parseInt(clubRevenueData.total_registrations) || 0 : 0)
        };
      });

      setClubStats(clubStatsWithRevenue);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubEvents = async (clubId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/events?club_id=${clubId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const eventsWithRevenue = await Promise.all(
          data.events.map(async (event) => {
            try {
              const revenueResponse = await fetch(`${API_URL}/api/events/events/${event.id}/revenue`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const revenueData = await revenueResponse.json();
              
              return {
                ...event,
                revenue: revenueData.success ? Number(parseFloat(revenueData.totalRevenue) || 0) : 0,
                registrations: revenueData.success ? Number(revenueData.registrationCount || 0) : 0
              };
            } catch (err) {
              console.error(`Error fetching revenue for event ${event.id}:`, err);
              return { ...event, revenue: 0, registrations: 0 };
            }
          })
        );
        setClubEvents(eventsWithRevenue);
      }
    } catch (err) {
      console.error('Error fetching club events:', err);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/api/events/${eventId}/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const processedRegistrations = (data.registrations || []).map((registration, index) => {
          const amountPaid = registration.calculated_amount_paid || registration.amount_paid || selectedEvent?.price || 0;
          
          return {
            user_name: String(registration.name || registration.user_name || 'N/A'),
            user_email: String(registration.email || registration.user_email || 'N/A'),
            registered_at: String(registration.registered_at || registration.created_at || new Date().toISOString()),
            amount_paid: Number(amountPaid),
            payment_status: String(registration.payment_status || 'completed'),
            is_present: Boolean(registration.is_present)
          };
        });
        
        setEventRegistrations(processedRegistrations);
      } else {
        setEventRegistrations([]);
      }
    } catch (err) {
      console.error('Error fetching event registrations:', err);
      setEventRegistrations([]);
    }
  };

  const handleClubClick = async (club) => {
    setSelectedClub(club);
    setShowClubDetails(true);
    await fetchClubEvents(club.id);
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    await fetchEventRegistrations(event.id);
  };

  const monthlyData = (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === monthIndex && eventDate.getFullYear() === currentYear;
      });
      
      const monthRevenue = clubStats.reduce((sum, club) => {
        const clubEvents = monthEvents.filter(event => event.club_id === club.id);
        return sum + (clubEvents.length > 0 ? club.revenue / 6 : 0);
      }, 0);
      
      return {
        month,
        events: monthEvents.length,
        revenue: monthRevenue,
        students: monthEvents.reduce((sum, event) => sum + (event.registrations_count || 0), 0)
      };
    });
  })();

  const safePercentage = (numerator, denominator) => {
    if (!denominator || denominator === 0) return 0;
    const result = (numerator / denominator) * 100;
    return isNaN(result) ? 0 : Math.round(result * 10) / 10;
  };

  const safeValue = (value) => {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  };

  const mainStats = [
    {
      icon: Users,
      label: 'Total Clubs',
      value: analyticsData.totalClubs,
      change: 'Active clubs',
      color: 'blue'
    },
    {
      icon: UserCheck,
      label: 'Total Registered',
      value: analyticsData.totalRegistered,
      change: `${safePercentage(analyticsData.totalRegistered, analyticsData.totalCapacity)}% of Expected`,
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Total Attended',
      value: analyticsData.totalAttended,
      change: `${safePercentage(analyticsData.totalAttended, analyticsData.totalRegistered)}% of Registered`,
      color: 'orange'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `₹${(safeValue(analyticsData.totalRevenue) / 1000).toFixed(1)}K`,
      change: 'Total collected',
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showEventDetails && selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h1>
                    <p className="text-gray-600">Event Details & Registration Information</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 text-blue-600 border-blue-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{(selectedEvent.price * selectedEvent.registrations).toFixed(0)}</div>
                      <div className="text-xs opacity-75">Total Revenue</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Revenue Generated</div>
                </div>

                <div className="bg-green-50 text-green-600 border-green-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Users size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedEvent.registrations}</div>
                      <div className="text-xs opacity-75">Total Count</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Registered</div>
                </div>

                <div className="bg-purple-50 text-purple-600 border-purple-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <UserCheck size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedEvent.attendance}</div>
                      <div className="text-xs opacity-75">Present</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Attended</div>
                </div>

                <div className="bg-orange-50 text-orange-600 border-orange-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{selectedEvent.price}</div>
                      <div className="text-xs opacity-75">Per Person</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Ticket Price</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Registration Details</h3>
                {eventRegistrations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Registration Date</th>
                          <th className="text-left py-3 px-4">Amount Paid</th>
                          <th className="text-left py-3 px-4">Payment Status</th>
                          <th className="text-left py-3 px-4">Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventRegistrations.map((registration, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{registration.user_name}</td>
                            <td className="py-3 px-4">{registration.user_email}</td>
                            <td className="py-3 px-4">
                              {registration.registered_at ? 
                                new Date(registration.registered_at).toLocaleDateString() : 
                                'N/A'
                              }
                            </td>
                            <td className="py-3 px-4">₹{registration.amount_paid}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.payment_status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {registration.payment_status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.is_present 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {registration.is_present ? 'Present' : 'Absent'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No registrations found for this event
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showClubDetails && selectedClub) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowClubDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedClub.name}</h1>
                    <p className="text-gray-600">Club Events & Revenue Details</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 text-blue-600 border-blue-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{clubEvents.length}</div>
                      <div className="text-xs opacity-75">Total Events</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Events Organized</div>
                </div>

                <div className="bg-green-50 text-green-600 border-green-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Users size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedClub.students}</div>
                      <div className="text-xs opacity-75">Club Members</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Total Members</div>
                </div>

                <div className="bg-purple-50 text-purple-600 border-purple-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <UserCheck size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedClub.registrations}</div>
                      <div className="text-xs opacity-75">Event Registrations</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Total Registrations</div>
                </div>

                <div className="bg-orange-50 text-orange-600 border-orange-200 border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign size={24} />
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{(selectedClub.revenue / 1000).toFixed(1)}K</div>
                      <div className="text-xs opacity-75">Total Revenue</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">Revenue Generated</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Revenue Details</h3>
                <div className="space-y-4">
                  {clubEvents.map((event, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} • {event.venue || 'Venue TBD'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">₹{event.revenue}</div>
                          <div className="text-xs text-gray-500">revenue</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex space-x-4">
                          <span className="text-gray-600">Price: ₹{event.price || 0}</span>
                          <span className="text-gray-600">Registrations: {event.registrations || 0}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          new Date(event.date) >= new Date() ? 'Upcoming' : 'Completed'
                        )}`}>
                          {new Date(event.date) >= new Date() ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {clubEvents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No events found for this club
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      <span>Revenue (K)</span>
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
                            <span>Revenue: ₹{(data.revenue / 1000).toFixed(1)}K</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((data.events / 10) * 100, 100)}%` }}
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
                      <span className="text-sm text-gray-600">Club Revenue Rate</span>
                      <span className="text-sm font-medium">
                        {clubStats.length > 0 ? 
                          `${Math.round((clubStats.filter(c => c.revenue > 0).length / clubStats.length) * 100)}%` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: clubStats.length > 0 ? 
                            `${(clubStats.filter(c => c.revenue > 0).length / clubStats.length) * 100}%` : 
                            '0%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Events This Month</span>
                      <span className="text-sm font-medium">{monthlyData[5]?.events || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(((monthlyData[5]?.events || 0) / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <DollarSign size={16} />
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">₹{(analyticsData.totalRevenue / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-500">Total collected</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Award size={20} />
                  <span>Club Revenue Overview</span>
                </h3>
                
                <div className="space-y-4">
                  {clubStats.length > 0 ? clubStats.map((club, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleClubClick(club)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{club.name}</h4>
                          <div className="text-sm text-gray-600">{club.students} members • {club.events} events</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">₹{(club.revenue / 1000).toFixed(1)}K</div>
                          <div className="text-xs text-gray-500">revenue</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Registrations</span>
                        <span className="text-xs font-medium">{club.registrations || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full" 
                          style={{ width: `${Math.min((club.revenue / (analyticsData.totalRevenue || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      No clubs found
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Activity size={20} />
                  <span>Recent Events</span>
                </h3>
                
                <div className="space-y-4">
                  {recentEvents.length > 0 ? recentEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEventClick(event)}
                    >
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
                      <div className="mt-2 pt-2 border-t flex justify-between text-xs text-gray-500">
                        <span>Revenue: ₹{(event.price * event.registrations).toFixed(0)}</span>
                        <span>Attended: {event.attendance}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      No recent events found
                    </div>
                  )}
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
