import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Star, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const handleViewClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const featuredClubs = [
    {
      id: 1,
      name: 'Robotics Club',
      members: 234,
      category: 'Technology',
      description: 'Building the future through robotics and automation',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
      featured: true,
      rating: 4.8,
      nextEvent: 'Robot Competition Prep'
    },
    {
      id: 2,
      name: 'Photography Club',
      members: 189,
      category: 'Arts',
      description: 'Capturing moments and creating visual stories',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop',
      featured: true,
      rating: 4.6,
      nextEvent: 'Campus Photo Walk'
    },
    {
      id: 3,
      name: 'Debate Society',
      members: 156,
      category: 'Academic',
      description: 'Sharpening minds through structured discourse',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=300&h=200&fit=crop',
      featured: true,
      rating: 4.7,
      nextEvent: 'Inter-University Debate'
    },
    {
      id: 4,
      name: 'Music Society',
      members: 298,
      category: 'Arts',
      description: 'Harmonizing voices and instruments in perfect unity',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
      featured: false,
      rating: 4.9,
      nextEvent: 'Annual Concert'
    },
    {
      id: 5,
      name: 'Coding Club',
      members: 412,
      category: 'Technology',
      description: 'Programming the future, one line of code at a time',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
      featured: false,
      rating: 4.5,
      nextEvent: 'Hackathon 2025'
    },
    {
      id: 6,
      name: 'Environmental Club',
      members: 167,
      category: 'Social',
      description: 'Creating a sustainable future for our planet',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
      featured: false,
      rating: 4.4,
      nextEvent: 'Campus Clean Drive'
    },
    {
      id: 7,
      name: 'Drama Club',
      members: 143,
      category: 'Arts',
      description: 'Bringing stories to life through theatrical performance',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      featured: false,
      rating: 4.6,
      nextEvent: 'Shakespeare Festival'
    },
    {
      id: 8,
      name: 'Sports Club',
      members: 356,
      category: 'Sports',
      description: 'Building champions through teamwork and dedication',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      featured: true,
      rating: 4.8,
      nextEvent: 'Inter-College Tournament'
    },
    {
      id: 9,
      name: 'Literary Society',
      members: 124,
      category: 'Academic',
      description: 'Exploring the world through words and literature',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      featured: false,
      rating: 4.3,
      nextEvent: 'Poetry Slam Night'
    }
  ];

  const categories = ['All', 'Technology', 'Arts', 'Academic', 'Social', 'Sports'];

  const filteredClubs = featuredClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ClubCard = ({ club }) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={club.image} 
          alt={club.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured Badge */}
        {club.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star size={12} />
            <span>Featured</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {club.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {club.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium text-gray-600">{club.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {club.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{club.members} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span className="text-blue-600 font-medium">{club.nextEvent}</span>
          </div>
        </div>
        
        {/* View Club Button */}
        <button 
          onClick={() => handleViewClub(club.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <Eye size={18} />
          <span>View Club</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Discover Your Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join amazing clubs, meet like-minded people, and create unforgettable memories
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredClubs.length}</span> clubs
            {selectedCategory !== 'All' && (
              <span> in <span className="font-semibold text-purple-600">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        {/* No Results */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No clubs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start your own club and bring together people who share your passion!
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Create a Club
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Clubs;