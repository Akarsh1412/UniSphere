import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Calendar,
  Users,
  Trophy,
  Star,
  ArrowRight,
  Tag,
  MapPin,
  Clock,
  Sparkles,
  Globe,
} from "lucide-react";

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);

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

        const currentEvents = eventsResponse.data.events.filter((event) => {
          const eventDate = new Date(event.date);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute top-1/2 left-1/2 w-20 h-20 bg-indigo-500/15 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    
      <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>

      <div className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
      
                <div className="relative">
                  <h1 className="text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                    <span className="unisphere-premium-gradient relative inline-block">
                      UniSphere
                      
                      <div className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-spin-slow">
                        <Sparkles size={24} />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-500 animate-bounce-slow">
                        <Globe size={20} />
                      </div>
                    </span>
                  </h1>
                 
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                      Campus Life Reimagined
                    </span>
                    <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </div>
                </div>

                <p className="text-xl text-slate-700 leading-relaxed animate-slide-up font-medium">
                  Your centralized hub for all event registration and campus
                  activities.
                  <span className="block mt-3 text-lg text-purple-700 font-semibold flex items-center">
                    <Sparkles size={18} className="mr-2 text-yellow-500" />
                    Where connections spark and memories are made!
                  </span>
                </p>
              </div>

              <div
                className="flex flex-wrap gap-4 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  to="/events"
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 group shadow-lg"
                >
                  <Calendar size={18} />
                  <span>Explore Events</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={handleJoinCommunity}
                  className="px-10 py-4 border-2 border-purple-600 text-purple-600 font-bold rounded-full hover:bg-purple-600 hover:text-white hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                >
                  <Users size={18} />
                  <span>Join Community</span>
                </button>
              </div>
            </div>

            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-3xl blur-3xl animate-pulse-slow"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                
                <div className="relative h-80 bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl overflow-hidden border border-slate-200">
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative transform-gpu perspective-1000">
                   
                      <div className="w-40 h-48 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 rounded-t-2xl transform rotate-y-15 shadow-2xl relative border-2 border-blue-500">
                     
                        <div className="grid grid-cols-4 gap-1 p-3">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-4 rounded ${
                                i % 3 === 0 ? "bg-yellow-300 shadow-inner" : "bg-blue-200 shadow-inner"
                              } animate-pulse border border-white/30`}
                              style={{ animationDelay: `${i * 0.3}s` }}
                            ></div>
                          ))}
                        </div>

                        <div className="absolute top-2 left-2 right-2 bg-white/95 rounded-md px-2 py-1 shadow-md border">
                          <div className="text-xs font-black text-blue-800 text-center tracking-wide">
                            EVENTS
                          </div>
                        </div>

                        <div className="absolute -bottom-3 -right-6 w-40 h-12 bg-blue-900/40 rounded-full blur-md transform skew-x-12"></div>
                      </div>
                      
                      <div className="absolute -left-8 top-4 w-20 h-32 bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 rounded-t-lg transform -rotate-12 shadow-xl border-2 border-purple-400">
                        <div className="grid grid-cols-2 gap-1 p-2">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-3 bg-purple-200 rounded animate-pulse shadow-inner border border-white/30"
                              style={{ animationDelay: `${i * 0.4}s` }}
                            ></div>
                          ))}
                        </div>
                        <div className="absolute top-1 left-1 right-1 bg-white/95 rounded px-1 shadow-sm border">
                          <div className="text-xs font-black text-purple-800 text-center">
                            CLUBS
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -right-6 top-8 w-16 h-28 bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 rounded-t-lg transform rotate-12 shadow-xl border-2 border-indigo-400">
                        <div className="grid grid-cols-2 gap-1 p-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-indigo-200 rounded animate-pulse shadow-inner border border-white/30"
                              style={{ animationDelay: `${i * 0.5}s` }}
                            ></div>
                          ))}
                        </div>
                        <div className="absolute top-1 left-0 right-0 bg-white/95 rounded px-1 shadow-sm border">
                          <div className="text-xs font-black text-indigo-800 text-center">
                            MEET
                          </div>
                        </div>
                      </div>
                    
                      <div
                        className="absolute -top-6 -left-6 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-yellow-300"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <Calendar size={16} className="text-yellow-900" />
                      </div>
                      <div
                        className="absolute -top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-green-300"
                        style={{ animationDelay: "1s" }}
                      >
                        <Users size={12} className="text-green-900" />
                      </div>
                      <div
                        className="absolute top-12 -right-8 w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-pink-300"
                        style={{ animationDelay: "1.5s" }}
                      >
                        <Trophy size={10} className="text-pink-900" />
                      </div>
                      <div
                        className="absolute bottom-4 -left-4 w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-xl border-2 border-orange-300"
                        style={{ animationDelay: "2s" }}
                      >
                        <Star size={12} className="text-orange-900" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 left-8 w-3 h-3 bg-blue-400 rounded-full animate-ping shadow-lg"></div>
                  <div
                    className="absolute bottom-8 right-12 w-2 h-2 bg-purple-500 rounded-full animate-ping shadow-lg"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute top-16 right-16 w-2 h-2 bg-indigo-500 rounded-full animate-ping shadow-lg"
                    style={{ animationDelay: "2s" }}
                  ></div>
                  <div
                    className="absolute bottom-12 left-12 w-1 h-1 bg-pink-500 rounded-full animate-ping shadow-lg"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
             
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-200 via-green-100 to-transparent rounded-b-2xl border-t border-green-300"></div>
                </div>
          
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer group border-2 border-blue-200 shadow-md">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="text-blue-600 mr-2" size={20} />
                      <div className="text-2xl font-black text-blue-700 group-hover:scale-110 transition-transform duration-300">
                        Live
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 font-bold">
                      Events Hub
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer group border-2 border-purple-200 shadow-md">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="text-purple-600 mr-2" size={20} />
                      <div className="text-2xl font-black text-purple-700 group-hover:scale-110 transition-transform duration-300">
                        Active
                      </div>
                    </div>
                    <div className="text-sm text-purple-600 font-bold">
                      Communities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="py-20">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Don't miss out on these amazing opportunities
              </p>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {upcomingEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className="group cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden animate-fade-in border-2 border-transparent hover:border-blue-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-t-xl relative">
                      <img
                        src={event.image || "/api/placeholder/300/225"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        NEW
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-black text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {event.club_name}
                        </p>
                        <p className="text-sm text-blue-600 font-bold flex items-center mt-2">
                          <Clock size={14} className="mr-1" />
                          {formatEventTime(event.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewEvent(event.id)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        View Event
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-xl font-medium">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            )}
          </section>

          <section className="py-20">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Featured Clubs
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Join vibrant communities that match your interests
              </p>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
            </div>

            {featuredClubs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                {featuredClubs.map((club, index) => (
                  <Card
                    key={club.id || index}
                    className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden animate-fade-in border-2 border-transparent hover:border-purple-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[3/2] overflow-hidden rounded-t-xl relative">
                      <img
                        src={club.image || "/api/placeholder/240/160"}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-black text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {club.name}
                      </h3>
                      <div className="flex items-center space-x-1 mb-4">
                        <Tag size={14} className="text-purple-600" />
                        <span className="text-sm text-purple-600 font-bold">
                          {club.category}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <button
                          onClick={() => handleViewClub(club.id)}
                          className="w-full py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300"
                        >
                          View Club
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-xl font-medium">
                  No clubs available at the moment. Check back soon!
                </p>
              </div>
            )}
          </section>

          {!user ? (
            <section className="py-20">
              <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white transform hover:scale-105 transition-all duration-500 border-0 shadow-2xl">
                <div className="p-16 text-center space-y-8">
                  <h2 className="text-5xl font-black animate-fade-in text-white drop-shadow-lg">
                    Ready to Get Started?
                  </h2>
                  <p className="text-2xl text-blue-100 max-w-3xl mx-auto animate-slide-up font-medium">
                    Join thousands of students who are already making the most
                    of their campus experience
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <Link
                      to="/signup"
                      className="px-12 py-4 bg-white text-blue-600 font-black rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-subtle text-lg"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      className="px-12 py-4 border-2 border-white text-white font-black rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          ) : (
            <section className="py-20">
              <Card className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white transform hover:scale-105 transition-all duration-500 border-0 shadow-2xl">
                <div className="p-16 text-center space-y-8">
                  <h2 className="text-5xl font-black animate-fade-in text-white drop-shadow-lg">
                    Welcome Back, {user.name || "Student"}! 🎉
                  </h2>
                  <p className="text-2xl text-purple-100 max-w-3xl mx-auto animate-slide-up font-medium">
                    Ready to discover new events and connect with amazing
                    communities?
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <Link
                      to="/events"
                      className="px-12 py-4 bg-white text-purple-600 font-black rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
                    >
                      Explore Events
                    </Link>
                    <Link
                      to="/community"
                      className="px-12 py-4 border-2 border-white text-white font-black rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 text-lg"
                    >
                      Join Community
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          )}

          <section className="py-20">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Why Choose UniSphere?
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Everything you need for an amazing campus experience
              </p>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <Card className="p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in border-2 border-transparent hover:border-blue-200">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full text-white mb-8 shadow-lg">
                  <Calendar size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Easy Event Discovery
                </h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  Find and register for events that match your interests with
                  just a few clicks.
                </p>
              </Card>

              <Card
                className="p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in border-2 border-transparent hover:border-purple-200"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full text-white mb-8 shadow-lg">
                  <Users size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Connect with Peers
                </h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  Join clubs and communities to meet like-minded students and
                  build lasting friendships.
                </p>
              </Card>

              <Card
                className="p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in border-2 border-transparent hover:border-indigo-200"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full text-white mb-8 shadow-lg">
                  <Trophy size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Track Your Journey
                </h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
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
