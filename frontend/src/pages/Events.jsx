import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Filter } from 'lucide-react';
import Card from '../components/Cards';

const Events = () => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState('All');

  const clubs = [
    'All',
    'Computer Science Club',
    'Arts & Culture Society',
    'Athletic Club',
    'Entrepreneurship Club',
    'Photography Club',
    'Robotics Club',
    'Debate Society',
    'Music Club'
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Fest 2025',
      club: 'Computer Science Club',
      date: 'June 25, 2025',
      time: '10:00 AM - 6:00 PM',
      venue: 'Main Auditorium',
      price: 299,
      volunteersNeeded: 15,
      registrations: 234,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      description: 'Join the biggest tech festival of the year featuring competitions, workshops, and networking.',
      featured: true
    },
    {
      id: 2,
      title: 'Cultural Night',
      club: 'Arts & Culture Society',
      date: 'June 28, 2025',
      time: '7:00 PM - 11:00 PM',
      venue: 'Open Air Theatre',
      price: 199,
      volunteersNeeded: 10,
      registrations: 189,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      description: 'Experience diverse cultures through music, dance, and art performances.',
      featured: false
    },
    {
      id: 3,
      title: 'Sports Championship',
      club: 'Athletic Club',
      date: 'July 2, 2025',
      time: '9:00 AM - 5:00 PM',
      venue: 'Sports Complex',
      price: 149,
      volunteersNeeded: 20,
      registrations: 156,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      description: 'Annual inter-college sports championship with multiple sporting events.',
      featured: true
    },
    {
      id: 4,
      title: 'Innovation Summit',
      club: 'Entrepreneurship Club',
      date: 'July 5, 2025',
      time: '2:00 PM - 8:00 PM',
      venue: 'Conference Hall',
      price: 399,
      volunteersNeeded: 8,
      registrations: 98,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
      description: 'Connect with industry leaders and showcase innovative ideas.',
      featured: false
    },
    {
      id: 5,
      title: 'Photography Exhibition',
      club: 'Photography Club',
      date: 'July 8, 2025',
      time: '11:00 AM - 7:00 PM',
      venue: 'Art Gallery',
      price: 99,
      volunteersNeeded: 5,
      registrations: 67,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      description: 'Showcase of stunning photography from talented student photographers.',
      featured: false
    },
    {
      id: 6,
      title: 'Robotics Competition',
      club: 'Robotics Club',
      date: 'July 12, 2025',
      time: '10:00 AM - 4:00 PM',
      venue: 'Engineering Lab',
      price: 349,
      volunteersNeeded: 12,
      registrations: 89,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      description: 'Build, program, and compete with autonomous robots.',
      featured: true
    },
    {
      id: 7,
      title: 'Debate Tournament',
      club: 'Debate Society',
      date: 'July 15, 2025',
      time: '1:00 PM - 9:00 PM',
      venue: 'Seminar Hall',
      price: 79,
      volunteersNeeded: 6,
      registrations: 45,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=200&fit=crop',
      description: 'Annual inter-collegiate debate championship with exciting topics.',
      featured: false
    },
    {
      id: 8,
      title: 'Music Festival',
      club: 'Music Club',
      date: 'July 18, 2025',
      time: '6:00 PM - 12:00 AM',
      venue: 'Campus Ground',
      price: 249,
      volunteersNeeded: 18,
      registrations: 234,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      description: 'Live performances by student bands and guest artists.',
      featured: true
    }
  ];

  const filteredEvents = selectedClub === 'All' 
    ? events 
    : events.filter(event => event.club === selectedClub);

  const featuredEvents = events.filter(event => event.featured);

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-gray-600">Discover amazing events happening around campus</p>
        </div>

        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                    <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ₹{event.price}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-2">{event.club}</p>
                      
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} />
                          <span>{event.registrations} registered</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewEvent(event.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">All Events</h2>
            
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-500" />
              <select 
                value={selectedClub} 
                onChange={(e) => setSelectedClub(e.target.value)}
                className="px-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {clubs.map((club) => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ₹{event.price}
                  </div>
                  {event.volunteersNeeded > 0 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Volunteers Needed
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">{event.club}</p>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{event.registrations} registered</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewEvent(event.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try selecting a different club or check back later for new events.</p>
            </div>
          )}
        </section>

      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full blur-3xl opacity-10"></div>
    </div>
  );
};

export default Events;