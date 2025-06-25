import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft, Calendar, Clock, MapPin, Users, UserPlus, FileText, CheckSquare, User, Mic } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch event details');
        const data = await response.json();
        setEventData(data.event || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      if (typeof field === 'string') return JSON.parse(field);
      return Array.isArray(field) ? field : [];
    } catch {
      return [];
    }
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
      <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
      <div className="ml-3">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-base text-gray-900">{value}</p>
      </div>
    </div>
  );

  const ListSection = ({ title, data, icon: Icon }) => (
    <div>
      <h3 className="flex items-center text-xl font-bold text-gray-800 mb-3">
        <Icon size={20} className="mr-2 text-blue-500" />
        {title}
      </h3>
      {data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((item, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <span className="w-4 h-4 bg-blue-200 rounded-full mr-3"></span>
              {typeof item === 'string' ? item : Object.values(item).join(' - ')}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">None provided.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Event not found.</p>
      </div>
    );
  }

  const guests = parseJsonField(eventData.guests);
  const coordinators = parseJsonField(eventData.coordinators);
  const schedule = parseJsonField(eventData.schedule);
  const requirements = parseJsonField(eventData.requirements);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/list')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events List
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <div className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{eventData.title}</h1>
                  <p className="text-lg text-gray-500">Club ID: {eventData.club_id}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-sm">
                  <DetailItem icon={Calendar} label="Date" value={eventData.date} />
                  <DetailItem icon={Clock} label="Start Time" value={eventData.time_start} />
                  <DetailItem icon={Clock} label="End Time" value={eventData.time_end || '-'} />
                  <DetailItem icon={MapPin} label="Venue" value={eventData.venue} />
                  <DetailItem icon={Users} label="Capacity" value={eventData.capacity} />
                  <DetailItem icon={UserPlus} label="Volunteers" value={eventData.volunteers_needed} />
                  <DetailItem icon={DollarSign} label="Price" value={`₹${eventData.price}`} />
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="flex items-center text-xl font-bold text-gray-800 mb-3">
                      <FileText size={20} className="mr-2 text-blue-500" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-justify">{eventData.description || 'No description provided.'}</p>
                  </div>
                  <div className="space-y-6">
                    <ListSection title="Schedule" data={schedule} icon={Clock} />
                    <ListSection title="Requirements" data={requirements} icon={CheckSquare} />
                    <ListSection title="Guests" data={guests} icon={Mic} />
                    <ListSection title="Coordinators" data={coordinators} icon={User} />
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="w-full bg-gray-100 rounded-lg p-2 flex items-center justify-center max-h-[70vh]">
                  {eventData.image ? (
                    <img
                      src={eventData.image}
                      alt={eventData.title}
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
