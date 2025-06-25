import { useState, useEffect, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import {
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  Tag,
  Clock,
} from "lucide-react";

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`} {...props}>
    {children}
  </div>
);

// 3D Sphere Component
const InteractiveSphere = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0, 0]} scale={1.1}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
};

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-blue-400">UniSphere</span>
                </h1>
                <div className="h-1 w-24 bg-blue-500 rounded-full"></div>
                <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                  Your centralized hub for all event registration and campus activities. Connect, explore, and make your mark.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/events"
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Calendar size={20} />
                  <span>Explore Events</span>
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={handleJoinCommunity}
                  className="px-8 py-4 border-2 border-purple-500 text-purple-400 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <Users size={20} />
                  <span>Join Community</span>
                </button>
              </div>

              
            </div>

            {/* 3D Interactive Object */}
            <div className="relative h-96 lg:h-[500px]">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                  <InteractiveSphere />
                  <Environment preset="night" />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upcoming Events Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Upcoming Events
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't miss out on these amazing opportunities to connect, learn, and grow with your campus community
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image || "/api/placeholder/300/225"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{event.club_name}</p>
                      <p className="text-sm text-blue-600 font-medium flex items-center mt-3">
                        <Clock size={14} className="mr-2" />
                        {formatEventTime(event.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="w-full py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                      View Event
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Calendar size={64} className="mx-auto text-slate-400 mb-6" />
              <p className="text-slate-500 text-lg">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Featured Clubs Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Featured Clubs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join vibrant communities that match your interests and connect with like-minded peers
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
          </div>

          {featuredClubs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredClubs.map((club, index) => (
                <Card
                  key={club.id || index}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border-0 shadow-md hover:-translate-y-2"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={club.image || "/api/placeholder/240/160"}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {club.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <Tag size={14} className="text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">
                        {club.category}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleViewClub(club.id)}
                        className="w-full py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
                      >
                        View Club
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Users size={64} className="mx-auto text-slate-400 mb-6" />
              <p className="text-slate-500 text-lg">
                No clubs available at the moment. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        {!user ? (
          <section className="py-20">
            <Card className="bg-gradient-to-r from-slate-900 to-blue-900 text-white border-0 shadow-xl">
              <div className="p-16 text-center space-y-8">
                <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Join thousands of students who are already making the most of their campus experience
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link
                    to="/signup"
                    className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        ) : (
          <section className="py-20">
            <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white border-0 shadow-xl">
              <div className="p-16 text-center space-y-8">
                <h2 className="text-4xl font-bold">Welcome Back, {user.name || "Student"}!</h2>
                <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                  Ready to discover new events and connect with amazing communities?
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link
                    to="/events"
                    className="px-10 py-4 bg-white text-purple-900 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore Events
                  </Link>
                  <Link
                    to="/community"
                    className="px-10 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105"
                  >
                    Join Community
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why Choose UniSphere?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for an amazing campus experience, all in one place
            </p>
            <div className="mt-6 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full text-blue-600 mb-8">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Easy Event Discovery
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Find and register for events that match your interests with just a few clicks.
              </p>
            </Card>

            <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full text-purple-600 mb-8">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Connect with Peers
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Join clubs and communities to meet like-minded students and build lasting friendships.
              </p>
            </Card>

            <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-600 mb-8">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Track Your Journey
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Keep track of your participation and achievements throughout your campus journey.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
