import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, UserPlus, Save, X, Plus, Image as ImageIcon, FileText } from 'lucide-react';

const Add = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    club_id: '',
    date: '',
    time_start: '',
    time_end: '',
    venue: '',
    price: '0',
    capacity: '',
    volunteers_needed: '0',
    image: null,
    guests: '',
    coordinators: '',
    schedule: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Authentication error. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    const apiFormData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        if (key === 'guests' || key === 'coordinators' || key === 'schedule' || key === 'requirements') {
          const arr = formData[key]
            .split(',')
            .map(item => item.trim())
            .filter(item => item);
          apiFormData.append(key, JSON.stringify(arr));
        } else if (key === 'image') {
          apiFormData.append(key, formData[key]);
        } else {
          apiFormData.append(key, formData[key]);
        }
      }
    }
    apiFormData.set('price', formData.price === '' ? '0' : formData.price);
    apiFormData.set('volunteers_needed', formData.volunteers_needed === '' ? '0' : formData.volunteers_needed);

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add event');
      }

      alert('Event added successfully!');
      navigate('/list');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="max-w-3xl w-full mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="club_id" className="block text-sm font-semibold text-gray-700 mb-2">Club ID</label>
              <input
                type="number"
                id="club_id"
                name="club_id"
                value={formData.club_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1 text-gray-500" />
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time_start" className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1 text-gray-500" />
                Start Time
              </label>
              <input
                type="time"
                id="time_start"
                name="time_start"
                value={formData.time_start}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time_end" className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1 text-gray-500" />
                End Time
              </label>
              <input
                type="time"
                id="time_end"
                name="time_end"
                value={formData.time_end}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1 text-gray-500" />
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="volunteers_needed" className="block text-sm font-semibold text-gray-700 mb-2">
                <UserPlus size={16} className="inline mr-1 text-gray-500" />
                Volunteers Needed
              </label>
              <input
                type="number"
                id="volunteers_needed"
                name="volunteers_needed"
                value={formData.volunteers_needed}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                <Users size={16} className="inline mr-1 text-gray-500" />
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">Event Image</label>
            <label htmlFor="image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              {formData.image ? (
                <p className="text-gray-700 text-center">{formData.image.name}</p>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-600 text-sm">Upload Image</span>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1 text-gray-500" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="guests" className="block text-sm font-semibold text-gray-700 mb-2">Guests (Comma separated)</label>
              <input
                type="text"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Guest1, Guest2"
              />
            </div>
            <div>
              <label htmlFor="coordinators" className="block text-sm font-semibold text-gray-700 mb-2">Coordinators (Comma separated)</label>
              <input
                type="text"
                id="coordinators"
                name="coordinators"
                value={formData.coordinators}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Coordinator1, Coordinator2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="schedule" className="block text-sm font-semibold text-gray-700 mb-2">Schedule (Comma separated)</label>
            <textarea
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="10:00 AM - Registration, 11:00 AM - Opening"
            />
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-2">Requirements (Comma separated)</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Projector, Microphone"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/list')}
              className="flex items-center space-x-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Adding Event...' : 'Add Event'}</span>
            </button>
          </div>
          {error && <div className="text-red-500 mt-4 text-center font-medium">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Add;
