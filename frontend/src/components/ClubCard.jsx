import { useNavigate } from "react-router-dom";
import { Users, Eye, Star, Calendar } from "lucide-react";

const ClubCard = ({ club }) => {
  const navigate = useNavigate();
  const handleViewClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 flex flex-col">
      
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Featured Badge */}
        {club.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star size={12} />
            <span>Featured</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {club.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {club.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium text-gray-600">
              {club.rating}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
          {club.description}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{club.members} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span className="text-blue-600 font-medium">{club.nextEvent}</span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => handleViewClub(club.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <Eye size={18} />
            <span>View Club</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;