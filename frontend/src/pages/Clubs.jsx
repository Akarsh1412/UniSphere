import { useState, useEffect } from "react";
import { Search, Filter, Loader } from "lucide-react";
import axios from "axios";
import ClubCard from "../components/ClubCard";

const Clubs = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All",
    "Technology",
    "Art and Culture",
    "Sports",
    "Arts",
    "Academic",
    "Social",
  ];

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/clubs`);
      
      if (response.data.success) {
        const transformedClubs = response.data.clubs.map(club => ({
          id: club.id,
          name: club.name,
          members: parseInt(club.members_count) || 0,
          category: club.category,
          description: club.description.length > 150 
            ? club.description.substring(0, 150) + "..." 
            : club.description,
          image: club.image,
          cover_image: club.cover_image,
          featured: club.featured,
          rating: parseFloat(club.rating) || 0,
          nextEvent: club.events_count > 0 ? "Upcoming Event" : "No upcoming events",
          website: club.website,
          instagram: club.instagram,
          twitter: club.twitter,
          facebook: club.facebook,
          established: club.established,
          admin_name: club.admin_name,
          admin_email: club.admin_email,
          events_count: parseInt(club.events_count) || 0
        }));
        
        setClubs(transformedClubs);
      } else {
        setError("Failed to fetch clubs data");
      }
    } catch (err) {
      setError("Error fetching clubs: " + err.message);
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter clubs based on search term and category
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClubs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader className="animate-spin text-blue-600 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Loading clubs...
            </h2>
            <p className="text-gray-500">Please wait while we fetch the latest clubs</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Clubs
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchClubs}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Discover Your Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join amazing clubs, meet like-minded people, and create
            unforgettable memories
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchClubs}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {filteredClubs.length}
            </span>{" "}
            clubs
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <span className="font-semibold text-purple-600">
                  {selectedCategory}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        {/* No Results */}
        {filteredClubs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No clubs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Empty State - No clubs at all */}
        {clubs.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No clubs available
            </h3>
            <p className="text-gray-500">
              Be the first to create a club!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;