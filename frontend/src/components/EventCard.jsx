import { Users, Calendar } from "lucide-react";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
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
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>{event.attendees} attendees</span>
          </div>
        </div>
        <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
