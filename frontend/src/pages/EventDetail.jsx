import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, UserPlus, ArrowLeft, Star, Share2, CreditCard } from 'lucide-react';
import Card from '../components/Cards';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedRegistration, setSelectedRegistration] = useState('student');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const event = {
    id: parseInt(id),
    title: 'Tech Fest 2025',
    club: 'Computer Science Club',
    date: 'June 25, 2025',
    time: '10:00 AM - 6:00 PM',
    venue: 'Main Auditorium, Block A',
    price: 299,
    volunteersNeeded: 15,
    registrations: 234,
    capacity: 500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    description: 'Join the biggest tech festival of the year featuring competitions, workshops, and networking opportunities. This event brings together students, professionals, and industry leaders to celebrate innovation and technology. Experience hands-on workshops, exciting competitions, and inspiring keynote sessions.',
    guests: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CTO, TechCorp',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
        bio: 'Leading AI researcher and entrepreneur'
      },
      {
        name: 'Mike Johnson',
        role: 'Senior Developer, Google',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        bio: 'Expert in cloud computing and scalable systems'
      },
      {
        name: 'Lisa Rodriguez',
        role: 'Product Manager, Microsoft',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        bio: 'Specializes in user experience and product strategy'
      }
    ],
    coordinators: [
      {
        name: 'Alex Kumar',
        role: 'Event Head',
        phone: '+91 9876543210',
        email: 'alex.kumar@university.edu',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      },
      {
        name: 'Priya Sharma',
        role: 'Technical Lead',
        phone: '+91 9876543211',
        email: 'priya.sharma@university.edu',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
      }
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Registration & Welcome' },
      { time: '11:00 AM', activity: 'Opening Ceremony' },
      { time: '12:00 PM', activity: 'Keynote: Future of AI' },
      { time: '1:00 PM', activity: 'Lunch Break' },
      { time: '2:00 PM', activity: 'Technical Workshops' },
      { time: '4:00 PM', activity: 'Coding Competition' },
      { time: '5:30 PM', activity: 'Networking Session' },
      { time: '6:00 PM', activity: 'Closing Ceremony' }
    ],
    requirements: [
      'Valid student ID card',
      'Laptop for workshop sessions',
      'Notebook and pen',
      'Comfortable clothing'
    ]
  };

  const handleRegistration = () => {
    if (selectedRegistration === 'volunteer') {
      alert('Volunteer registration submitted! You will receive confirmation via email.');
      return;
    }

    const amount = selectedRegistration === 'student' ? event.price : event.price * 1.5;

    if (paymentMethod === 'stripe') {
      window.open(`https://checkout.stripe.com/pay?amount=${amount * 100}&currency=inr&event=${event.id}`, '_blank');
    } else if (paymentMethod === 'payu') {
      window.open(`https://secure.payu.in/checkout?amount=${amount}&event=${event.id}`, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  useEffect(() => {
      window.scrollTo(0, 0);
    }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <button
            onClick={() => navigate('/events')}
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
                    <p className="text-lg text-blue-600 font-semibold">{event.club}</p>
                  </div>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar size={20} className="text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock size={20} className="text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin size={20} className="text-blue-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users size={20} className="text-blue-600" />
                      <span>{event.registrations} / {event.capacity} registered</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <UserPlus size={20} className="text-green-600" />
                      <span>{event.volunteersNeeded} volunteers needed</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Star size={20} className="text-yellow-600" />
                      <span>4.8/5 rating (124 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {event.capacity - event.registrations} spots remaining
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Event Schedule</h3>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-blue-600 font-semibold min-w-[80px]">{item.time}</div>
                    <div className="text-gray-800">{item.activity}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Featured Guests</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.guests.map((guest, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={guest.image}
                      alt={guest.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="font-semibold text-gray-900">{guest.name}</h4>
                    <p className="text-blue-600 text-sm mb-2">{guest.role}</p>
                    <p className="text-gray-600 text-sm">{guest.bio}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Event Coordinators</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {event.coordinators.map((coordinator, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={coordinator.image}
                      alt={coordinator.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{coordinator.name}</h4>
                      <p className="text-blue-600 text-sm">{coordinator.role}</p>
                      <p className="text-gray-600 text-sm">{coordinator.phone}</p>
                      <p className="text-gray-600 text-sm">{coordinator.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          <div className="space-y-6">

            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Register for Event</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="student"
                        checked={selectedRegistration === 'student'}
                        onChange={(e) => setSelectedRegistration(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">Student - ₹{event.price}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="general"
                        checked={selectedRegistration === 'general'}
                        onChange={(e) => setSelectedRegistration(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">General - ₹{Math.round(event.price * 1.5)}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registration"
                        value="volunteer"
                        checked={selectedRegistration === 'volunteer'}
                        onChange={(e) => setSelectedRegistration(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-green-600">Volunteer - Free</span>
                    </label>
                  </div>
                </div>

                {selectedRegistration !== 'volunteer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="stripe"
                          checked={paymentMethod === 'stripe'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm flex items-center">
                          <CreditCard size={16} className="mr-1" />
                          Stripe
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="payu"
                          checked={paymentMethod === 'payu'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm flex items-center">
                          <CreditCard size={16} className="mr-1" />
                          PayU
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleRegistration}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {selectedRegistration === 'volunteer' ? 'Register as Volunteer' : `Proceed to Pay ₹${selectedRegistration === 'student' ? event.price : Math.round(event.price * 1.5)}`}
              </button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What to Bring</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {event.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;