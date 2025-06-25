import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Filter } from "lucide-react";
import Card from "../components/Cards";
import axios from "axios";

const Events = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState("All");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState(["All"]);

  useEffect(() => {
    window.scrollTo(0, 0);

    axios.get(`${API_URL}/api/events`)
      .then((response) => {
        const eventsData = response.data.events;
        setEvents(eventsData);
        
        const uniqueClubs = ["All", ...new Set(eventsData.map(event => event.club_name))];
        setClubs(uniqueClubs);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredEvents =
    selectedClub === "All"
      ? events
      : events.filter((event) => event.club_name === selectedClub);

  const featuredEvents = events.filter((event) => event.featured);

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="text-blue-700">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Discover amazing events happening around campus
          </p>
        </div>

        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                Featured Events
              </h2>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                >
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      FEATURED
                    </div>
                    <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ₹{event.price}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-black text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-bold mb-2">
                        {event.club_name}
                      </p>

                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} />
                          <span>{formatTime(event.time_start)} - {formatTime(event.time_end)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={14} />
                          <span>{event.registrations_count || 0} registered</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
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
            <h2 className="text-3xl font-black text-gray-900">All Events</h2>

            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium shadow-sm hover:border-blue-400 transition-colors"
              >
                {clubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              >
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
                  {event.volunteers_needed > 0 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Volunteers Needed
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-black text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-bold mb-2">
                      {event.club_name}
                    </p>

                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{formatTime(event.time_start)} - {formatTime(event.time_end)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{event.registrations_count || 0} registered</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewEvent(event.id)}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
              <div className="text-gray-400 mb-4">
                <Calendar size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 font-medium">
                Try selecting a different club or check back later for new
                events.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Events;
