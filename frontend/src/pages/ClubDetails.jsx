import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Star, Calendar, MapPin, DollarSign, 
  Crown, Mail, Phone, Globe, Instagram, Twitter, Facebook,
  TrendingUp, Award, Clock, Image, Video, FileText
} from 'lucide-react';

const ClubDetails = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  // const [club, setClub] = useState(null);

  const clubsData = {
    '1': {
      id: 1,
      name: 'Robotics Club',
      members: 234,
      category: 'Technology',
      description: 'Building the future through robotics and automation. Our club focuses on creating innovative robotic solutions while fostering a community of tech enthusiasts.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop',
      featured: true,
      rating: 4.8,
      established: '2019',
      revenue: '$15,420',
      admin: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        phone: '+1 (555) 123-4567',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100&h=100&fit=crop&crop=face'
      },
      socialLinks: {
        website: 'https://roboticsclub.university.edu',
        instagram: '@robotics_club_uni',
        twitter: '@RoboticsClubUni',
        facebook: 'RoboticsClubUniversity'
      },
      stats: {
        totalEvents: 45,
        upcomingEvents: 3,
        achievements: 12,
        activeProjects: 8
      },
      pastEvents: [
        {
          id: 1,
          name: 'Robot Design Competition 2024',
          date: '2024-11-15',
          attendees: 89,
          revenue: '$2,400',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
          type: 'Competition'
        },
        {
          id: 2,
          name: 'Arduino Workshop Series',
          date: '2024-10-20',
          attendees: 156,
          revenue: '$1,200',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop',
          type: 'Workshop'
        },
        {
          id: 3,
          name: 'Tech Talk: AI in Robotics',
          date: '2024-09-10',
          attendees: 203,
          revenue: '$800',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
          type: 'Seminar'
        },
        {
          id: 4,
          name: 'Campus Robot Demo Day',
          date: '2024-08-25',
          attendees: 124,
          revenue: '$600',
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
          type: 'Demo'
        }
      ],
      upcomingEvents: [
        {
          id: 5,
          name: 'Regional Robotics Championship',
          date: '2025-07-15',
          expectedAttendees: 200,
          venue: 'Main Auditorium'
        },
        {
          id: 6,
          name: 'Beginner Python Workshop',
          date: '2025-07-20',
          expectedAttendees: 80,
          venue: 'Computer Lab A'
        }
      ],
      achievements: [
        'Winner - National Robotics Competition 2024',
        'Best Innovation Award - Tech Fest 2024',
        'Excellence in STEM Education 2023',
        'Community Impact Award 2023'
      ]
    }
  };

//   useEffect(() => {
//     const fetchClub = () => {
//       const clubData = clubsData[clubId];
//       setClub(clubData);
//     };
//     fetchClub();

// }, []);

  const club = clubsData[1];
  // console.log(club);
  

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp size={16} />
            <span className="ml-1">+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={event?.image} 
          alt={event?.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {event.type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>{event.attendees} attendees</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={16} />
            <span className="text-green-600 font-medium">{event.revenue}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/clubs')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Clubs</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${club.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <div className="flex items-end space-x-6">
              <img 
                src={club?.image} 
                alt={club.name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl"
              />
              <div className="text-white flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl font-bold">{club.name}</h1>
                  {club.featured && (
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star size={14} />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-lg">
                  <span className="flex items-center space-x-2">
                    <Users size={20} />
                    <span>{club.members} members</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Star size={20} />
                    <span>{club.rating}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span>Est. {club.established}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Members" value={club.members} trend="12" />
          <StatCard icon={Calendar} label="Events Hosted" value={club?.stats?.totalEvents} trend="8" />
          <StatCard icon={DollarSign} label="Revenue Generated" value={club.revenue} trend="15" />
          <StatCard icon={Award} label="Achievements" value={club?.stats?.achievements} trend="5" />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Club Description */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About {club.name}</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{club.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {club.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Established</h3>
                      <span className="text-gray-600">{club.established}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h2>
                  <div className="space-y-3">
                    {club?.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <Award className="text-yellow-600" size={20} />
                        <span className="text-gray-800">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Club Admin */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Crown className="text-yellow-600" size={20} />
                    <span>Club Admin</span>
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={club?.admin?.image} 
                      alt={club?.admin?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{club.admin.name}</h4>
                      <p className="text-sm text-gray-600">Club Administrator</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail size={16} />
                      <span>{club?.admin?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone size={16} />
                      <span>{club?.admin?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Projects</span>
                      <span className="font-semibold text-blue-600">{club.stats.activeProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming Events</span>
                      <span className="font-semibold text-green-600">{club.stats.upcomingEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold text-purple-600">{club.revenue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              
              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {club?.upcomingEvents?.map(event => (
                    <div key={event.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 border-l-4 border-l-green-500">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={16} />
                          <span>{event.expectedAttendees} expected</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Events */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {club.pastEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
              <Image size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Media Gallery</h3>
              <p className="text-gray-500">Photo and video gallery coming soon...</p>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-blue-600" size={20} />
                    <span className="text-gray-800">{club.admin.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="text-green-600" size={20} />
                    <span className="text-gray-800">{club.admin.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="text-purple-600" size={20} />
                    <span className="text-gray-800">{club.socialLinks.website}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>

              {/* Join Club */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-blue-100 mb-6">
                  Ready to be part of something amazing? Join {club.name} and connect with {club.members}+ like-minded individuals.
                </p>
                <button className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Join Club
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;