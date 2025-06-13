import React, { useState } from 'react';
import { Mail, Users, Send, FileText, Image, Calendar, MapPin, Clock, DollarSign, Eye, X } from 'lucide-react';

const Announcement = () => {
  const [emailType, setEmailType] = useState('custom');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [events] = useState([
    {
      id: 1,
      title: 'Tech Fest 2025',
      club: 'Computer Science Club',
      date: 'June 25, 2025',
      time: '10:00 AM - 6:00 PM',
      venue: 'Main Auditorium',
      price: 500,
      registrations: 156,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      description: 'Join us for the biggest tech event of the year featuring workshops, competitions, and networking opportunities.'
    },
    {
      id: 2,
      title: 'Cultural Night',
      club: 'Arts & Culture Society',
      date: 'June 28, 2025',
      time: '7:00 PM - 11:00 PM',
      venue: 'Open Theatre',
      price: 300,
      registrations: 287,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      description: 'Experience an evening of cultural performances, music, and dance celebrating diversity.'
    }
  ]);

  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
    const event = events.find(e => e.id === parseInt(eventId));
    if (event && emailType === 'event') {
      setSubject(`${event.title} - Event Details`);
    }
  };

  const getSelectedEventData = () => {
    return events.find(e => e.id === parseInt(selectedEvent));
  };

  const generateEventEmail = () => {
    const event = getSelectedEventData();
    if (!event) return '';

    return `
Dear Students,

We are excited to announce "${event.title}" organized by ${event.club}.

Event Details:
📅 Date: ${event.date}
🕐 Time: ${event.time}
📍 Venue: ${event.venue}
💰 Registration Fee: ₹${event.price}

${event.description}

Don't miss this amazing opportunity! Register now to secure your spot.

For more information and registration, please visit our events portal.

Best regards,
Event Management Team
    `.trim();
  };

  const handleSendEmail = () => {
    const emailData = {
      type: emailType,
      recipients: recipientType,
      subject: subject,
      message: emailType === 'event' ? generateEventEmail() : message,
      eventId: selectedEvent || null,
      timestamp: new Date().toISOString()
    };

    console.log('Email Data:', emailData);
    alert(`Email sent successfully to ${recipientType === 'all' ? 'all students' : 'registered students'}!`);
    
    setSubject('');
    setMessage('');
    setSelectedEvent('');
  };

  const getRecipientCount = () => {
    if (recipientType === 'all') return '2,450 students';
    if (selectedEvent) {
      const event = getSelectedEventData();
      return event ? `${event.registrations} registered students` : '0 students';
    }
    return '0 students';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Send Announcement</h1>
                <p className="text-gray-600">Send emails to students about events and updates</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                      <select
                        value={emailType}
                        onChange={(e) => setEmailType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="custom">Custom Message</option>
                        <option value="event">Event Promotion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                      <select
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Students</option>
                        <option value="registered">Registered Students Only</option>
                      </select>
                    </div>
                  </div>

                  {(emailType === 'event' || recipientType === 'registered') && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                      <select
                        value={selectedEvent}
                        onChange={(e) => handleEventChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Choose an event...</option>
                        {events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.title} - {event.date}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {emailType === 'custom' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Email Preview</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[300px]">
                        {selectedEvent ? (
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                            {generateEventEmail()}
                          </pre>
                        ) : (
                          <div className="text-gray-500 text-center py-8">
                            Select an event to see the email preview
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={!subject || (emailType === 'custom' && !message) || (emailType === 'event' && !selectedEvent)}
                  >
                    <Eye size={20} />
                    <span>Preview Email</span>
                  </button>

                  <button
                    onClick={handleSendEmail}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!subject || (emailType === 'custom' && !message) || (emailType === 'event' && !selectedEvent)}
                  >
                    <Send size={20} />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                    <Users size={20} />
                    <span>Email Summary</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Recipients:</span>
                      <span className="font-medium text-blue-900">{getRecipientCount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Email Type:</span>
                      <span className="font-medium text-blue-900 capitalize">{emailType}</span>
                    </div>
                    {selectedEvent && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Event:</span>
                        <span className="font-medium text-blue-900">{getSelectedEventData()?.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEvent && emailType === 'event' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected Event</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{getSelectedEventData()?.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock size={14} />
                        <span>{getSelectedEventData()?.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={14} />
                        <span>{getSelectedEventData()?.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign size={14} />
                        <span>₹{getSelectedEventData()?.price}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Email Guidelines</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Keep subject lines clear and concise</li>
                    <li>• Include all relevant event details</li>
                    <li>• Use professional language</li>
                    <li>• Double-check recipient selection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Subject:</div>
                  <div className="font-medium text-gray-900">{subject}</div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Message:</div>
                <div className="bg-white p-4 rounded border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {emailType === 'event' ? generateEventEmail() : message}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
