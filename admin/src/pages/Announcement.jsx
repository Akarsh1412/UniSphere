import { useState, useEffect } from "react";
import {
  Mail,
  Users,
  Send,
  FileText,
  Image,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  X,
  UploadCloud,
} from "lucide-react";
import emailjs from '@emailjs/browser';

const Announcement = () => {
  const [emailType, setEmailType] = useState("custom");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [manualEmails, setManualEmails] = useState("");
  const [fileEmails, setFileEmails] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendMode, setSendMode] = useState("bulk");

  const [events, setEvents] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [recipientCounts, setRecipientCounts] = useState({
    allStudents: 0,
    eventParticipants: 0
  });

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    fetchInitialData();
  }, []);

  const handleEmailTypeChange = (type) => {
    setEmailType(type);
    if (type === "event") {
      setRecipientType("registered");
    } else {
      setRecipientType("all");
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEvents(),
        fetchAllStudentEmails()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events?upcoming=true&limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        console.error('Failed to fetch events');
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchAllStudentEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/students/emails', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRecipientCounts(prev => ({
          ...prev,
          allStudents: data.totalStudents || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching student emails:', error);
    }
  };

  const fetchRecipientEmails = async (type, eventId = null) => {
    try {
      const token = localStorage.getItem('token');
      let url = '';
      
      switch (type) {
        case 'all':
          url = 'http://localhost:5000/api/users/students/emails';
          break;
        case 'registered':
          if (!eventId) return [];
          url = `http://localhost:5000/api/users/participants/emails/${eventId}`;
          console.log(`Fetching registered emails for event ID: ${eventId}`);
          break;
        default:
          return [];
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.emails || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching recipient emails:', error);
      return [];
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedEventDetails(data.event);
        
        const participantEmails = await fetchRecipientEmails('registered', eventId);
        setRecipientCounts(prev => ({
          ...prev,
          eventParticipants: participantEmails.length
        }));
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setSelectedEventDetails(null);
    }
  };

  const handleEventChange = async (eventId) => {
    setSelectedEvent(eventId);
    
    if (eventId) {
      await fetchEventDetails(eventId);
      const event = events.find((e) => e.id === parseInt(eventId));
      if (event && emailType === "event") {
        setSubject(`${event.title} - Event Details`);
      }
    } else {
      setSelectedEventDetails(null);
      setRecipientCounts(prev => ({
        ...prev,
        eventParticipants: 0
      }));
    }
  };

  const handleRecipientTypeChange = async (type) => {
    setRecipientType(type);
    
    let emails = [];
    if (type === 'all') {
      emails = await fetchRecipientEmails('all');
    } else if (type === 'registered' && selectedEvent) {
      emails = await fetchRecipientEmails('registered', selectedEvent);
    }
    
    setRecipientEmails(emails);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }
      if (!["text/plain", "text/csv", "application/vnd.ms-excel"].includes(file.type)) {
        alert("Invalid file type. Please upload a .txt or .csv file.");
        return;
      }
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
        setFileEmails(emails);
        if (emails.length === 0) {
          alert("No valid email addresses found in the file.");
        }
      };
      reader.onerror = () => {
        alert("Failed to read the file.");
        setUploadedFile(null);
        setFileEmails([]);
      };
      reader.readAsText(file);
    }
  };

  const generateEventEmail = () => {
    const event = selectedEventDetails;
    if (!event) return "";
    
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `Dear Students,

We are excited to announce "${event.title}" organized by ${event.club_name}.

Event Details:
📅 Date: ${eventDate}
🕐 Time: ${event.time_start} - ${event.time_end}
📍 Venue: ${event.venue}
💰 Registration Fee: ₹${event.price || 0}

${event.description}

Don't miss this amazing opportunity! Register now to secure your spot.

Current Registrations: ${event.registrations_count || 0}
${event.capacity ? `Available Spots: ${event.capacity - (event.registrations_count || 0)}` : ''}

For more information and registration, please visit our events portal.

Best regards,
UniSphere Team`;
  };

  const handleSendEmail = async () => {
    if (isFormInvalid()) {
      alert("Please fill all required fields and define your recipients.");
      return;
    }
    
    setIsSending(true);

    try {
      let recipientsEmails = [];

      if (recipientType === "manual") {
        recipientsEmails = manualEmails.split(/[\n,;]+/).map((email) => email.trim()).filter((email) => email);
      } else if (recipientType === "upload") {
        recipientsEmails = fileEmails;
      } else {
        recipientsEmails = await fetchRecipientEmails(recipientType, selectedEvent);
      }

      const recipientCount = recipientsEmails.length;
      if (recipientCount === 0) {
        alert("Recipient list is empty. Please add recipients to send the email.");
        setIsSending(false);
        return;
      }

      const emailBody = emailType === "event" ? generateEventEmail() : message;

      if (sendMode === "bulk") {
        const templateParams = {
          to_email: recipientsEmails.join(', '),
          subject: subject,
          message: emailBody,
          from_name: 'UniSphere Team'
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        alert(`Bulk email sent successfully to ${recipientCount} recipients!`);
      } else {
        let successCount = 0;
        let failureCount = 0;

        for (const email of recipientsEmails) {
          try {
            const templateParams = {
              to_email: email,
              subject: subject,
              message: emailBody,
              from_name: 'UniSphere Team'
            };

            await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              templateParams
            );
            
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            failureCount++;
          }
        }

        if (successCount > 0) {
          alert(`Individual emails sent successfully to ${successCount} recipients!${failureCount > 0 ? ` ${failureCount} failed.` : ''}`);
        } else {
          alert("Failed to send emails to all recipients. Check console for details.");
        }
      }

      setSubject("");
      setMessage("");
      setSelectedEvent("");
      setManualEmails("");
      setFileEmails([]);
      setUploadedFile(null);

    } catch (error) {
      console.error("Email sending failed:", error);
      alert(`Failed to send email: ${error.text || error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientCount = () => {
    switch (recipientType) {
      case "all":
        return `All Students (${recipientCounts.allStudents})`;
      case "registered":
        return selectedEvent 
          ? `Event Participants (${recipientCounts.eventParticipants})` 
          : "Select an event";
      case "manual":
        const emails = manualEmails.split(/[\n,;]+/).filter((email) => email.trim() !== "");
        return `${emails.length} recipients`;
      case "upload":
        return `${fileEmails.length} recipients from ${uploadedFile?.name || "file"}`;
      default:
        return "0 recipients";
    }
  };

  const isFormInvalid = () => {
    const isContentInvalid = !subject || (emailType === "custom" && !message) || (emailType === "event" && !selectedEvent);
    let isRecipientInvalid = false;
    
    if (recipientType === "registered" && !selectedEvent) {
      isRecipientInvalid = true;
    } else if (recipientType === "manual" && manualEmails.trim() === "") {
      isRecipientInvalid = true;
    } else if (recipientType === "upload" && fileEmails.length === 0) {
      isRecipientInvalid = true;
    }
    
    return isContentInvalid || isRecipientInvalid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcement system...</p>
        </div>
      </div>
    );
  }
  
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
                <p className="text-gray-600">Send emails to students and event participants</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                      <select value={emailType} onChange={(e) => handleEmailTypeChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="custom">Custom Message</option>
                        <option value="event">Event Promotion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                      <select value={recipientType} onChange={(e) => handleRecipientTypeChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {emailType === "custom" ? (
                          <>
                            <option value="all">All Students</option>
                            <option value="manual">Manual Entry</option>
                          </>
                        ) : (
                          <>
                            <option value="registered">Event Participants</option>
                            <option value="manual">Manual Entry</option>
                            <option value="upload">Upload File</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Send Mode</label>
                      <select value={sendMode} onChange={(e) => setSendMode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="bulk">Bulk Email</option>
                        <option value="individual">Individual Emails</option>
                      </select>
                    </div>
                  </div>
                  {(emailType === "event" || recipientType === "registered") && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                      <select value={selectedEvent} onChange={(e) => handleEventChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        <option value="">Choose an event...</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {recipientType === "manual" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manual Email Entry</label>
                      <textarea value={manualEmails} onChange={(e) => setManualEmails(e.target.value)} placeholder="Enter emails, separated by commas, semicolons, or new lines." rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  )}
                  {recipientType === "upload" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Email File</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.csv" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">TXT, CSV up to 5MB</p>
                        </div>
                      </div>
                      {uploadedFile && (<p className="mt-2 text-sm text-gray-600">File selected: {uploadedFile.name} ({fileEmails.length} emails found)</p>)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  {emailType === "custom" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here..." rows={12} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Email Preview</label>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[300px]">
                        {selectedEvent ? (<pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{generateEventEmail()}</pre>) : (<div className="text-gray-500 text-center py-8">Select an event to see the email preview</div>)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6">
                  <button onClick={() => setIsPreviewOpen(true)} className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isFormInvalid()}>
                    <Eye size={20} />
                    <span>Preview Email</span>
                  </button>
                  <button onClick={handleSendEmail} className="flex items-center justify-center space-x-2 px-6 py-3 w-40 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isFormInvalid() || isSending}>
                    {isSending ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<> <Send size={20} /> <span>Send Email</span> </>)}
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
                      <span className="font-medium text-blue-900 text-right">{getRecipientCount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Email Type:</span>
                      <span className="font-medium text-blue-900 capitalize">{emailType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Send Mode:</span>
                      <span className="font-medium text-blue-900 capitalize">{sendMode}</span>
                    </div>
                    {selectedEventDetails && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Event:</span>
                        <span className="font-medium text-blue-900">{selectedEventDetails.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEventDetails && emailType === "event" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected Event</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{new Date(selectedEventDetails.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock size={14} />
                        <span>{selectedEventDetails.time_start} - {selectedEventDetails.time_end}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={14} />
                        <span>{selectedEventDetails.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign size={14} />
                        <span>₹{selectedEventDetails.price || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users size={14} />
                        <span>{selectedEventDetails.registrations_count || 0} registered</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {emailType === "custom" ? "Custom Message Recipients" : "Event Promotion Recipients"}
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>✅ Available Recipients:</strong></p>
                    {emailType === "custom" ? (
                      <ul className="list-disc list-inside ml-4">
                        <li>All Students ({recipientCounts.allStudents})</li>
                        <li>Manual Entry</li>
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside ml-4">
                        <li>Event Participants</li>
                        <li>Manual Entry</li>
                        <li>Upload File</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Email Preview</h2>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Subject:</div>
                  <div className="font-semibold text-xl text-gray-900">{subject}</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">Message Body:</div>
                <div className="bg-white p-4 rounded border min-h-[40vh]" dangerouslySetInnerHTML={{ __html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${(emailType === "event" ? generateEventEmail() : message).replace(/\n/g, "<br>")}</div>`}}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
