import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Calendar, Users, Trophy, Star, ArrowRight, Tag } from "lucide-react";

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Access user from Redux
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);

  const stats = [
    { icon: Calendar, value: "50+", label: "Events" },
    { icon: Users, value: "1000+", label: "Students" },
    { icon: Trophy, value: "25+", label: "Clubs" },
    { icon: Star, value: "4.8", label: "Rating" },
  ];

  // Helper function to format event time
  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Conditional navigation for Join Community
  const handleJoinCommunity = () => {
    if (user) {
      navigate("/community");
    } else {
      navigate("/signup");
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get(`${API_URL}/api/events`);
        const clubsResponse = await axios.get(`${API_URL}/api/clubs`);

        // Filter out past events using timezone-aware comparison
        const currentEvents = eventsResponse.data.events.filter((event) => {
          const eventDate = new Date(event.date); // Use 'date' field instead of 'time_start'
          const now = new Date();
          return eventDate > now;
        });

        setUpcomingEvents(currentEvents);
        setFeaturedClubs(clubsResponse.data.clubs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full blur-3xl opacity-10 animate-pulse-slow"></div>
      <div
        className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-5 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse-slow">
                    UniSphere
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed animate-slide-up">
                  Your centralized hub for all event registration and campus
                  activities.
                  <span className="block mt-2 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                    Where connections spark and memories are made! ✨
                  </span>
                </p>
              </div>

              <div
                className="flex flex-wrap gap-4 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  to="/events"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>Explore Events</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={handleJoinCommunity}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                >
                  Join Community
                </button>
              </div>
            </div>

            {/* Enhanced Stats Card */}
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="relative glass-morphism rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2 group">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                        <stat.icon size={20} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Events Section */}
          <section className="py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg text-gray-600">
                Don't miss out on these amazing opportunities
              </p>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-t-xl relative">
                      <img
                        src={event.image || "/api/placeholder/300/225"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.club_name}
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          {formatEventTime(event.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewEvent(event.id)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300"
                      >
                        View Event
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Enhanced Clubs Section */}
          <section className="py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Featured Clubs
              </h2>
              <p className="text-lg text-gray-600">
                Join vibrant communities that match your interests
              </p>
            </div>

            {featuredClubs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                {featuredClubs.map((club, index) => (
                  <Card
                    key={club.id || index}
                    className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[3/2] overflow-hidden rounded-t-xl relative">
                      <img
                        src={club.image || "/api/placeholder/240/160"}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {club.name}
                      </h3>
                      <div className="flex items-center space-x-1 mb-4">
                        <Tag size={14} className="text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">
                          {club.category}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <button
                          onClick={() => handleViewClub(club.id)}
                          className="w-full py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300"
                        >
                          View Club
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No clubs available at the moment. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Conditional CTA Section */}
          {!user ? (
            <section className="py-16">
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white transform hover:scale-105 transition-all duration-500">
                <div className="p-12 text-center space-y-6">
                  <h2 className="text-4xl font-bold animate-fade-in">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl opacity-90 max-w-2xl mx-auto animate-slide-up">
                    Join thousands of students who are already making the most
                    of their campus experience
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 animate-bounce-subtle"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          ) : (
            <section className="py-16">
              <Card className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white transform hover:scale-105 transition-all duration-500">
                <div className="p-12 text-center space-y-6">
                  <h2 className="text-4xl font-bold animate-fade-in">
                    Welcome Back, {user.name || "Student"}! 🎉
                  </h2>
                  <p className="text-xl opacity-90 max-w-2xl mx-auto animate-slide-up">
                    Ready to discover new events and connect with amazing
                    communities?
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to="/events"
                      className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Explore Events
                    </Link>
                    <Link
                      to="/community"
                      className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
                    >
                      Join Community
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Additional Features Section */}
          <section className="py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Why Choose UniSphere?
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need for an amazing campus experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white mb-6">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Easy Event Discovery
                </h3>
                <p className="text-gray-600">
                  Find and register for events that match your interests with
                  just a few clicks.
                </p>
              </Card>

              <Card
                className="p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full text-white mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Connect with Peers
                </h3>
                <p className="text-gray-600">
                  Join clubs and communities to meet like-minded students and
                  build lasting friendships.
                </p>
              </Card>

              <Card
                className="p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full text-white mb-6">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Track Your Journey
                </h3>
                <p className="text-gray-600">
                  Keep track of your participation and achievements throughout
                  your campus journey.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
