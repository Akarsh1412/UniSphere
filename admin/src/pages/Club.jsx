import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Save, X, Upload } from 'lucide-react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    cover_image: null,
    website: '',
    instagram: '',
    twitter: '',
    facebook: ''
  });
  const imageInputRef = useRef();
  const coverInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clubs');
      const data = await res.json();
      setClubs(data.clubs || []);
    } catch {
      setError('Failed to fetch clubs.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, cover_image: file }));
  };

  const handleAddClub = async (e) => {
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
    Object.keys(formData).forEach(key => {
      if (key === 'image' || key === 'cover_image') {
        if (formData[key]) {
          apiFormData.append(key, formData[key]);
        }
      } else {
        apiFormData.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/clubs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: apiFormData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to add club');
      setShowAdd(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        image: null,
        cover_image: null,
        website: '',
        instagram: '',
        twitter: '',
        facebook: ''
      });
      fetchClubs();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Add Club</span>
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {clubs.map(club => (
                <tr key={club.id}>
                  <td className="px-6 py-4 text-gray-500">{club.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{club.name}</td>
                  <td className="px-6 py-4 text-gray-700">{club.category || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{club.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/clubs/${club.id}`)}
                      className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-500">No clubs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-lg w-full relative">
              <button
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Club</h2>
              <form onSubmit={handleAddClub} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current.click()}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-300 hover:bg-blue-200"
                    >
                      <Upload size={18} className="mr-2" />
                      {formData.image ? formData.image.name : "Upload Logo"}
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                    <input
                      type="file"
                      name="cover_image"
                      accept="image/*"
                      ref={coverInputRef}
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current.click()}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-300 hover:bg-blue-200"
                    >
                      <Upload size={18} className="mr-2" />
                      {formData.cover_image ? formData.cover_image.name : "Upload Cover"}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram</label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook</label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
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
                    <span>{isSubmitting ? 'Adding...' : 'Add Club'}</span>
                  </button>
                </div>
                {error && <div className="text-red-500 mt-3 text-center">{error}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
