import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Send, Users, TrendingUp, Bookmark } from 'lucide-react';

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b9c?w=50&h=50&fit=crop&crop=face',
        club: 'Photography Club',
        verified: true
      },
      content: 'Just captured this amazing sunset from the campus rooftop! The golden hour lighting was absolutely perfect for our photography workshop today. Can\'t wait to share more shots with everyone! 📸✨',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      timestamp: '2 hours ago',
      likes: 124,
      comments: 23,
      shares: 8,
      liked: false,
      bookmarked: false
    },
    {
      id: 2,
      author: {
        name: 'Alex Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        club: 'Robotics Club',
        verified: true
      },
      content: 'Our team just won the regional robotics competition! 🏆 All those late nights in the lab finally paid off. Special thanks to everyone who supported us. Next stop: nationals! #RoboticsLife #TeamWork',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      timestamp: '4 hours ago',
      likes: 298,
      comments: 45,
      shares: 22,
      liked: true,
      bookmarked: true
    },
    {
      id: 3,
      author: {
        name: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        club: 'Arts & Culture Society',
        verified: false
      },
      content: 'Rehearsals for our upcoming cultural night are going amazing! The energy and talent of our performers is incredible. This is going to be our best show yet! Who\'s excited to see what we\'ve been working on? 🎭🎨',
      timestamp: '6 hours ago',
      likes: 87,
      comments: 12,
      shares: 5,
      liked: false,
      bookmarked: false
    },
    {
      id: 4,
      author: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        club: 'Entrepreneurship Club',
        verified: true
      },
      content: 'Just launched our startup idea at the innovation summit! The feedback was incredible and we\'ve already got three potential investors interested. Dreams do come true when you work hard and believe in yourself! 💼🚀',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
      timestamp: '8 hours ago',
      likes: 156,
      comments: 28,
      shares: 15,
      liked: false,
      bookmarked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPost.trim() && !selectedImage) return;
    
    const post = {
      id: posts.length + 1,
      author: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
        club: 'Student',
        verified: false
      },
      content: newPost,
      image: selectedImage,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
  };

  const trendingTopics = [
    { tag: '#TechFest2025', posts: '2.3K' },
    { tag: '#CulturalNight', posts: '1.8K' },
    { tag: '#StudyTips', posts: '1.2K' },
    { tag: '#CampusLife', posts: '967' },
    { tag: '#Innovation', posts: '543' }
  ];

  const suggestedClubs = [
    { name: 'Debate Society', members: '156', image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=80&h=80&fit=crop' },
    { name: 'Music Club', members: '234', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop' },
    { name: 'Gaming Society', members: '189', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&h=80&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Community Hub
              </span>
            </h1>
            <p className="text-xl text-gray-600">Connect, share, and inspire with your campus community</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-blue-600" size={20} />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200">
                      <span className="font-medium text-blue-600">{topic.tag}</span>
                      <span className="text-sm text-gray-500">{topic.posts}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="mr-2 text-purple-600" size={20} />
                  Suggested Clubs
                </h3>
                <div className="space-y-4">
                  {suggestedClubs.map((club, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-all duration-200">
                      <img src={club.image} alt={club.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{club.name}</h4>
                        <p className="text-sm text-gray-500">{club.members} members</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-start space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face" 
                    alt="Your avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's happening in your campus life?"
                      className="w-full p-4 border-0 resize-none focus:outline-none bg-gray-50 rounded-xl text-gray-900 placeholder-gray-500"
                      rows="3"
                    />
                    {selectedImage && (
                      <div className="mt-4 relative">
                        <img src={selectedImage} alt="Selected" className="w-full max-h-64 object-cover rounded-xl" />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <label className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 cursor-pointer">
                        <Image size={20} />
                        <span className="text-sm font-medium">Add Photo</span>
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      </label>
                      <button 
                        onClick={handleSubmitPost}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <Send size={16} />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                              {post.author.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{post.author.club} • {post.timestamp}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                      
                      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                      
                      {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 transition-all duration-200 ${
                              post.liked 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-all duration-200">
                            <MessageCircle size={20} />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-all duration-200">
                            <Share2 size={20} />
                            <span className="font-medium">{post.shares}</span>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleBookmark(post.id)}
                          className={`transition-all duration-200 ${
                            post.bookmarked 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-500 hover:text-yellow-500'
                          }`}
                        >
                          <Bookmark size={20} fill={post.bookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full blur-3xl opacity-10"></div>
    </div>
  );
};

export default Community;