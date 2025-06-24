import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Filter } from "lucide-react";
import Card from "../components/Cards";
import axios from "axios";

const Events = () => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState("All");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState(["All"]);

  useEffect(() => {
    window.scrollTo(0, 0);

    axios.get('http://localhost:5000/api/events')
      .then((response) => {
        console.log(response.data.events);
        const eventsData = response.data.events;
        setEvents(eventsData);
        
        // Extract unique club names for filter dropdown
        const uniqueClubs = ["All", ...new Set(eventsData.map(event => event.club_name))];
        setClubs(uniqueClubs);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format time
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Events
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing events happening around campus
          </p>
        </div>

        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Events
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
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
                      <p className="text-sm text-blue-600 font-medium mb-2">
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
                className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
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
                    <p className="text-sm text-blue-600 font-medium mb-2">
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Try selecting a different club or check back later for new
                events.
              </p>
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