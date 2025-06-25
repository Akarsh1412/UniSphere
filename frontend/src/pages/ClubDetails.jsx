import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StatCard from "../components/StatCard";
import { ArrowLeft, Star, Calendar, MapPin, Mail, Globe, Instagram, Twitter, Facebook, Loader, AlertCircle } from "lucide-react";

const ClubDetails = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/clubs/${clubId}`);
      
      if (response.data.success) {
        const clubData = response.data.club;
        
        const transformedClub = {
          id: clubData.id,
          name: clubData.name,
          members: parseInt(clubData.members_count) || 0,
          category: clubData.category,
          description: clubData.description,
          image: clubData.image,
          coverImage: clubData.cover_image || clubData.image,
          featured: clubData.featured,
          rating: parseFloat(clubData.rating) || 0,
          established: clubData.established ? new Date(clubData.established).getFullYear().toString() : new Date(clubData.created_at).getFullYear().toString(),
          socialLinks: {
            website: clubData.website || "",
            instagram: clubData.instagram || "",
            twitter: clubData.twitter || "",
            facebook: clubData.facebook || "",
          },
          stats: {
            totalEvents: parseInt(clubData.events_count) || 0,
            upcomingEvents: clubData.upcomingEvents?.length || 0,
          },
          upcomingEvents: clubData.upcomingEvents || [],
          isMember: clubData.isMember || false,
          memberRole: clubData.memberRole,
          membershipFee: parseFloat(clubData.membership_fee) || 0,
        };
        
        setClub(transformedClub);
      } else {
        setError("Failed to fetch club details");
      }
    } catch (err) {
      setError("Error fetching club details: " + err.message);
      console.error("Error fetching club details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Club
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={fetchClubDetails}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/clubs")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Clubs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Club Not Found</h2>
          <p className="text-gray-600 mb-4">The club you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/clubs")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Star },
    { id: "events", label: "Events", icon: Calendar },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-4">
        <button
          onClick={() => navigate("/clubs")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Clubs</span>
        </button>
      </div>

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
                  <span>Est. {club.established}</span>
                  <span>{club.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            label="Events Hosted"
            value={club?.stats?.totalEvents}
            trend="8"
          />
          <StatCard
            icon={Calendar}
            label="Upcoming Events"
            value={club?.stats?.upcomingEvents}
            trend="3"
          />
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 mb-8">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About {club.name}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {club.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Category
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {club.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Established
                      </h3>
                      <span className="text-gray-600">{club.established}</span>
                    </div>
                  </div>

                  {club.membershipFee > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Membership Fee
                      </h3>
                      <span className="text-green-600 font-semibold">
                        ₹{club.membershipFee}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming Events</span>
                      <span className="font-semibold text-green-600">
                        {club.stats.upcomingEvents}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Events</span>
                      <span className="font-semibold text-purple-600">
                        {club.stats.totalEvents}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold text-blue-600">
                        {club.members}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-8">
              {club.upcomingEvents.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {club?.upcomingEvents?.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 border-l-4 border-l-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>{event.venue}</span>
                          </div>
                          {event.price && parseFloat(event.price) > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 font-semibold">
                                ₹{event.price}
                              </span>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="w-full py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          View Event
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/20 text-center">
                  <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-gray-500">
                    Stay tuned for exciting events coming soon!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              
              {(club.socialLinks.website || club.socialLinks.instagram || club.socialLinks.twitter || club.socialLinks.facebook) ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4 mb-6">
                    {club.socialLinks.facebook && (
                      <a
                        href={club.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {club.socialLinks.instagram && (
                      <a
                        href={club.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        title="Instagram"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {club.socialLinks.twitter && (
                      <a
                        href={club.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        title="Twitter"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                    {club.socialLinks.website && (
                      <a
                        href={club.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Website"
                      >
                        <Globe size={20} />
                      </a>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      Connect with {club.name} through our social media channels to stay updated on events and activities.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Mail size={48} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Contact Information
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Contact details will be available soon.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full blur-3xl opacity-10"></div>
    </div>
  );
};

export default ClubDetails;
