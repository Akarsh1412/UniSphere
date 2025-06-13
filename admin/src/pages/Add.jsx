import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, UserPlus, Save, X, Plus, Minus } from 'lucide-react';

const Add = () => {
  const [formData, setFormData] = useState({
    title: '',
    club: '',
    date: '',
    time: '',
    venue: '',
    price: '',
    totalBudget: '',
    volunteersNeeded: '',
    capacity: '',
    image: null,
    description: '',
    guests: [{ name: '', role: '', image: '', bio: '' }],
    coordinators: [{ name: '', role: '', phone: '', email: '', image: '' }],
    schedule: [{ time: '', activity: '' }],
    requirements: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      id: Date.now(),
      price: parseInt(formData.price),
      totalBudget: parseInt(formData.totalBudget),
      volunteersNeeded: parseInt(formData.volunteersNeeded),
      capacity: parseInt(formData.capacity),
      registrations: 0,
      requirements: formData.requirements.filter(req => req.trim() !== '')
    };

    console.log('Event Data:', eventData);
    alert('Event added successfully!');
    
    setFormData({
      title: '',
      club: '',
      date: '',
      time: '',
      venue: '',
      price: '',
      totalBudget: '', // Add this
      volunteersNeeded: '',
      capacity: '',
      image: null,
      description: '',
      guests: [{ name: '', role: '', image: '', bio: '' }],
      coordinators: [{ name: '', role: '', phone: '', email: '', image: '' }],
      schedule: [{ time: '', activity: '' }],
      requirements: ['']
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Event</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                  <input
                    type="text"
                    name="club"
                    value={formData.club}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="10:00 AM - 6:00 PM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6"> {/* Changed to 4 columns */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserPlus size={16} className="inline mr-1" />
                      Volunteers Needed
                    </label>
                    <input
                      type="number"
                      name="volunteersNeeded"
                      value={formData.volunteersNeeded}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="inline mr-1" />
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {/* Add Total Budget field here */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (₹)</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={formData.totalBudget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <Plus size={16} className="mr-2" />
                  <span>Upload Image</span>
                  <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only" 
                    required
                  />
                </label>
                {formData.image && (
                  <p className="text-sm text-gray-500 mt-2">Selected file: {formData.image.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Featured Guests</h3>
                  <button
                    type="button"
                    onClick={() => addArrayItem('guests', { name: '', role: '', image: '', bio: '' })}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} />
                    <span>Add Guest</span>
                  </button>
                </div>
                {formData.guests.map((guest, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <input
                      type="text"
                      placeholder="Guest Name"
                      value={guest.name}
                      onChange={(e) => handleArrayChange('guests', index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={guest.role}
                      onChange={(e) => handleArrayChange('guests', index, 'role', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={guest.image}
                      onChange={(e) => handleArrayChange('guests', index, 'image', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Bio"
                        value={guest.bio}
                        onChange={(e) => handleArrayChange('guests', index, 'bio', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.guests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('guests', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Coordinators</h3>
                  <button
                    type="button"
                    onClick={() => addArrayItem('coordinators', { name: '', role: '', phone: '', email: '', image: '' })}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} />
                    <span>Add Coordinator</span>
                  </button>
                </div>
                {formData.coordinators.map((coordinator, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <input
                      type="text"
                      placeholder="Coordinator Name"
                      value={coordinator.name}
                      onChange={(e) => handleArrayChange('coordinators', index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={coordinator.role}
                      onChange={(e) => handleArrayChange('coordinators', index, 'role', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={coordinator.phone}
                      onChange={(e) => handleArrayChange('coordinators', index, 'phone', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={coordinator.email}
                      onChange={(e) => handleArrayChange('coordinators', index, 'email', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={coordinator.image}
                        onChange={(e) => handleArrayChange('coordinators', index, 'image', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.coordinators.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('coordinators', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Schedule</h3>
                  <button
                    type="button"
                    onClick={() => addArrayItem('schedule', { time: '', activity: '' })}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} />
                    <span>Add Schedule Item</span>
                  </button>
                </div>
                {formData.schedule.map((item, index) => (
                  <div key={index} className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      placeholder="Time (e.g., 10:00 AM)"
                      value={item.time}
                      onChange={(e) => handleArrayChange('schedule', index, 'time', e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Activity"
                      value={item.activity}
                      onChange={(e) => handleArrayChange('schedule', index, 'activity', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('schedule', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} />
                    <span>Add Requirement</span>
                  </button>
                </div>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      placeholder="Requirement"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          requirements: prev.requirements.filter((_, i) => i !== index) 
                        }))}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={20} />
                  <span>Add Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;