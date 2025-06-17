import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Info, Calendar, Star, Crown, X } from 'lucide-react';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication error. Please log in.');
        }
        const response = await fetch(`http://localhost:5000/api/clubs/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch club details.');
        }
        const data = await response.json();
        setClub(data.club); // <-- FIXED HERE
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClubDetails();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <p className="text-xl text-gray-700">Loading club details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <p className="text-xl text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <p className="text-xl text-gray-700">Club not found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 flex items-center justify-center`}>
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {club.cover_image && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={club.cover_image}
              alt={`${club.name} Cover`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}
        <div className="relative p-8 md:p-12">
          {club.image && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-12 md:-translate-x-0">
              <img
                src={club.image}
                alt={`${club.name} Logo`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          )}
          <div className={`${club.image ? 'mt-16 md:mt-0 md:ml-40' : ''}`}>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{club.name}</h1>
            {club.category && (
              <p className="text-blue-600 text-lg font-semibold mb-4">{club.category}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-700">
              {club.description && (
                <div>
                  <h2 className="flex items-center text-xl font-bold text-gray-800 mb-3">
                    <Info size={20} className="mr-2 text-blue-500" />
                    About Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{club.description}</p>
                </div>
              )}
              <div className="space-y-4">
                {club.established && (
                  <div className="flex items-center text-lg">
                    <Calendar size={20} className="mr-3 text-purple-500" />
                    <span className="font-semibold">Established:</span> {club.established}
                  </div>
                )}
                {club.rating && (
                  <div className="flex items-center text-lg">
                    <Star size={20} className="mr-3 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">Rating:</span> {parseFloat(club.rating).toFixed(1)} / 5
                  </div>
                )}
                {club.admin_id && (
                  <div className="flex items-center text-lg">
                    <Crown size={20} className="mr-3 text-green-500" />
                    <span className="font-semibold">Admin ID:</span> {club.admin_id}
                  </div>
                )}
                {club.featured !== undefined && (
                  <div className="flex items-center text-lg">
                    <ImageIcon size={20} className="mr-3 text-indigo-500" />
                    <span className="font-semibold">Featured:</span> {club.featured ? 'Yes' : 'No'}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => navigate('/clubs')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150 ease-in-out font-semibold"
              >
                Back to Clubs List
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Add New Club (Modal)</h2>
            <p className="text-gray-700 mb-6">This is where your "Add Club" form would go. The background is blurred.</p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
