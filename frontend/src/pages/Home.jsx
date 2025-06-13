import React from 'react';
import { ArrowRight, Calendar, Users, Star, TrendingUp } from 'lucide-react';
import Card from '../components/Cards';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Fest 2025',
      club: 'Computer Science Club',
      date: 'June 25, 2025',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Cultural Night',
      club: 'Arts & Culture Society',
      date: 'June 28, 2025',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Sports Championship',
      club: 'Athletic Club',
      date: 'July 2, 2025',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Innovation Summit',
      club: 'Entrepreneurship Club',
      date: 'July 5, 2025',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'
    },
    {
      id:5,
      title: 'Tech Fest 2025',
      club: 'Computer Science Club',
      date: 'June 25, 2025',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Cultural Night',
      club: 'Arts & Culture Society',
      date: 'June 28, 2025',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      title: 'Sports Championship',
      club: 'Athletic Club',
      date: 'July 2, 2025',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      title: 'Innovation Summit',
      club: 'Entrepreneurship Club',
      date: 'July 5, 2025',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'
    }
  ];

  const featuredClubs = [
    {
      name: 'Robotics Club',
      members: 234,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop'
    },
    {
      name: 'Photography Club',
      members: 189,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop'
    },
    {
      name: 'Debate Society',
      members: 156,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=300&h=200&fit=crop'
    },
    {
      name: 'Robotics Club',
      members: 234,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop'
    },
    {
      name: 'Photography Club',
      members: 189,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop'
    },
    {
      name: 'Debate Society',
      members: 156,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=300&h=200&fit=crop'
    }
  ];

  const stats = [
    { icon: Calendar, label: 'Active Events', value: '47+' },
    { icon: Users, label: 'Students', value: '2.5K+' },
    { icon: Star, label: 'Clubs', value: '25+' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%' }
  ];

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    UniSphere
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Your centralized hub for all event registration and campus activities. 
                  <span className="block mt-2 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                    Where connections spark and memories are made! ✨
                  </span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link
                to='/events'
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <span>Explore Events</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                to='/signup'
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                  Join Community
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
                        <stat.icon size={20} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-gray-600">Don't miss out on these amazing opportunities</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500">{event.club}</p>
                      <p className="text-sm text-blue-600 font-medium">{event.date}</p>
                    </div>
                    <button onClick={() => handleViewEvent(event.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                      View
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Clubs</h2>
              <p className="text-lg text-gray-600">Join vibrant communities that match your interests</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {featuredClubs.map((club, index) => (
                <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-t-xl">
                  <img 
                    src={club.image} 
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{club.members} members</p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleViewClub(club.id)}
                      className="w-full py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      Join Club
                    </button>
                  </div>
                </div>
              </Card>

              ))}
            </div>
          </section>

          <section className="py-16">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              <div className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Join thousands of students who are already making the most of their campus experience
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                  to='/signup'
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Create Account
                  </Link>
                  <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </Card>
          </section>

        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full blur-3xl opacity-10"></div>
      
    </div>
  );
};

export default Home;