import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, UserPlus, ArrowLeft, Star, Share2, CreditCard } from "lucide-react";
import Card from "../components/Cards";
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import EventPaymentForm from "../components/EventPaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedRegistration, setSelectedRegistration] = useState("student");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data.event);
      setError(null);
    } catch (error) {
      setError("Failed to load event details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const parseJSONArray = (jsonString, fallback = []) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  };

  const handleRegistration = async () => {
    if (!event) return;

    if (selectedRegistration === "volunteer") {
      alert("Volunteer registration submitted! You will receive confirmation via email.");
      return;
    }

    const isPaid = parseFloat(event.price) > 0;
    if (paymentMethod === "stripe" && isPaid) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("You must be logged in to register for events");
          navigate("/login");
          return;
        }
        const intentRes = await axios.post(
          `http://localhost:5000/api/events/${event.id}/create-payment-intent`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(intentRes.data.clientSecret);
        setShowStripeForm(true);
      } catch (err) {
        alert("Payment initiation failed. " + (err.response?.data?.message || err.message));
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to register for events");
        navigate("/login");
        return;
      }
      await axios.post(
        `http://localhost:5000/api/events/${event.id}/register`,
        { registrationType: selectedRegistration, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Registration successful!");
      fetchEvent();
    } catch (err) {
      alert("Registration failed. " + (err.response?.data?.message || err.message));
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/events/confirm-payment`,
        { paymentIntentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowStripeForm(false);
      setClientSecret(null);
      alert("Payment successful! You are registered for the event.");
      fetchEvent();
    } catch (err) {
      alert("Payment confirmation failed. " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const guests = parseJSONArray(event.guests);
  const coordinators = parseJSONArray(event.coordinators);
  const schedule = parseJSONArray(event.schedule);
  const requirements = parseJSONArray(event.requirements);

  const registrationsCount = parseInt(event.registrations_count) || 0;
  const capacity = event.capacity || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-semibold">
                      {event.club_name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Event link copied to clipboard!");
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar size={20} className="text-blue-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock size={20} className="text-blue-600" />
                      <span>{formatTime(event.time_start)} - {formatTime(event.time_end)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin size={20} className="text-blue-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users size={20} className="text-blue-600" />
                      <span>
                        {registrationsCount} / {capacity} registered
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <UserPlus size={20} className="text-green-600" />
                      <span>{event.volunteers_needed} volunteers needed</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Star size={20} className="text-yellow-600" />
                      <span>New Event</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${capacity > 0 ? (registrationsCount / capacity) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.max(0, capacity - registrationsCount)} spots remaining
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    About This Event
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
            {schedule.length > 0 && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Event Schedule
                </h3>
                <div className="space-y-4">
                  {schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-gray-800">{item}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {guests.length > 0 && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Featured Guests
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guests.map((guest, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {guest}
                      </h4>
                      <p className="text-blue-600 text-sm mb-2">Guest Speaker</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {coordinators.length > 0 && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Event Coordinators
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {coordinators.map((coordinator, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {coordinator}
                        </h4>
                        <p className="text-blue-600 text-sm">
                          Event Coordinator
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Register for Event
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="student"
                        checked={selectedRegistration === "student"}
                        onChange={(e) =>
                          setSelectedRegistration(e.target.value)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        Student - ₹{parseFloat(event.price)}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="general"
                        checked={selectedRegistration === "general"}
                        onChange={(e) =>
                          setSelectedRegistration(e.target.value)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        General - ₹{Math.round(parseFloat(event.price) * 1.5)}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="volunteer"
                        checked={selectedRegistration === "volunteer"}
                        onChange={(e) =>
                          setSelectedRegistration(e.target.value)
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-green-600">
                        Volunteer - Free
                      </span>
                    </label>
                  </div>
                </div>
                {selectedRegistration !== "volunteer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="stripe"
                          checked={paymentMethod === "stripe"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm flex items-center">
                          <CreditCard size={16} className="mr-1" />
                          Stripe
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {!showStripeForm && (
                <button
                  onClick={handleRegistration}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {selectedRegistration === "volunteer"
                    ? "Register as Volunteer"
                    : `Proceed to Pay ₹${
                        selectedRegistration === "student"
                          ? parseFloat(event.price)
                          : Math.round(parseFloat(event.price) * 1.5)
                      }`}
                </button>
              )}
              {showStripeForm && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <EventPaymentForm onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              )}
              {showStripeForm && !clientSecret && (
                <div className="text-center py-4 text-gray-500">Loading payment form...</div>
              )}
            </Card>
            {requirements.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What to Bring
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
