import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, Trash2, X, Link as LinkIcon, MessageSquare, Mail } from "lucide-react";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getSocket } from "../socket";
import OnlineUsers from "../components/OnlineUsers";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxState, setLightboxState] = useState({ open: false, slides: [] });
  const [shareModalState, setShareModalState] = useState({ isOpen: false, post: null });
  const [optionsMenu, setOptionsMenu] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const optionsMenuRef = useRef(null);
  const DEFAULT_AVATAR = "https://placehold.co/150x150/E2E8F0/4A5568?text=U";

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:5000/api/community/posts", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPosts(response.data.posts.map(p => ({ ...p, showComments: false, newComment: '' })));
      } catch (err) {
        setError("Failed to load community feed. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    const socket = getSocket();
    if (!socket) return;

    const handleNewPost = (newPost) => setPosts(prev => [newPost, ...prev]);
    const handleDeletePost = ({ postId }) => setPosts(prev => prev.filter(p => p.id !== postId));
    const handleUpdateLike = ({ postId, likesCount, liked }) => 
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: likesCount, is_liked: liked } : p));
    const handleNewComment = ({ postId, comment }) => 
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), comment], comments_count: (p.comments_count || 0) + 1 } : p));
    const handleDeleteComment = ({ postId, commentId }) => 
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: (p.comments || []).filter(c => c.id !== commentId), comments_count: Math.max(0, (p.comments_count || 0) - 1) } : p));

    socket.on('newPost', handleNewPost);
    socket.on('deletePost', handleDeletePost);
    socket.on('updateLike', handleUpdateLike);
    socket.on('newComment', handleNewComment);
    socket.on('deleteComment', handleDeleteComment);

    return () => {
      socket.off('newPost', handleNewPost);
      socket.off('deletePost', handleDeletePost);
      socket.off('updateLike', handleUpdateLike);
      socket.off('newComment', handleNewComment);
      socket.off('deleteComment', handleDeleteComment);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setOptionsMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Function to handle direct message navigation
  const handleDirectMessage = (userId) => {
    if (!currentUser) {
      alert('Please log in to send messages');
      navigate('/login');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const handleApiCall = async (method, url, data = null, headers = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to perform this action');
        navigate('/login');
        return;
      }

      await axios({
        method,
        url: `http://localhost:5000/api/community${url}`,
        data,
        headers: { Authorization: `Bearer ${token}`, ...headers }
      });
    } catch (err) {
      console.error('API call error:', err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this post?")) {
      handleApiCall('delete', `/posts/${postId}`);
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Delete this comment?")) {
      handleApiCall('delete', `/posts/${postId}/comments/${commentId}`);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      alert('Please log in to like posts');
      navigate('/login');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.is_liked;
    const newLikesCount = isCurrentlyLiked ? (post.likes_count || 0) - 1 : (post.likes_count || 0) + 1;

    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !isCurrentlyLiked, likes_count: newLikesCount }
        : p
    ));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/community/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, is_liked: isCurrentlyLiked, likes_count: post.likes_count }
          : p
      ));
      console.error('Like error:', err);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      alert('Please log in to comment');
      navigate('/login');
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post || !post.newComment?.trim()) return;

    const commentContent = post.newComment;
    setPosts(posts.map(p => p.id === postId ? { ...p, newComment: '' } : p));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/community/posts/${postId}/comments`, 
        { content: commentContent }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setPosts(posts.map(p => p.id === postId ? { ...p, newComment: commentContent } : p));
      console.error('Comment error:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleSubmitPost = async () => {
    if (!currentUser) {
      alert('Please log in to create posts');
      navigate('/login');
      return;
    }

    if (!newPostContent.trim() && !newPostImage) {
      alert('Please add some content or an image');
      return;
    }

    const formData = new FormData();
    formData.append("content", newPostContent);
    if (newPostImage) formData.append("image", newPostImage);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/community/posts', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setNewPostContent("");
      setNewPostImage(null);
      setPreviewImage(null);
    } catch (err) {
      console.error('Post creation error:', err);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setNewPostImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Link copied!"));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading Feed...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share something with the community!</p>
        </div>
      );
    }

    return posts.map((post) => (
      <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.user_profile_picture || DEFAULT_AVATAR}
              alt={post.user_name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-900 text-sm">{post.user_name}</h3>
                {currentUser && currentUser.id !== post.user_id && (
                  <button
                    onClick={() => handleDirectMessage(post.user_id)}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-150 border border-blue-200"
                    title="Send direct message"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Message
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{formatTime(post.created_at)}</p>
            </div>
          </div>
          
          {currentUser && currentUser.id === post.user_id && (
            <div className="relative" ref={optionsMenuRef}>
              <button
                onClick={() => setOptionsMenu(optionsMenu === post.id ? null : post.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              {optionsMenu === post.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      handleDeletePost(post.id);
                      setOptionsMenu(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="mt-4 rounded-lg max-w-full h-auto cursor-pointer hover:opacity-95 transition-opacity border border-gray-200"
              onClick={() => setLightboxState({
                open: true,
                slides: [{ src: post.image }]
              })}
            />
          )}
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-150 ${
              post.is_liked 
                ? 'text-red-600 bg-red-50 border border-red-200' 
                : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes_count || 0}</span>
          </button>

          <button
            onClick={() => setPosts(posts.map(p => p.id === post.id ? { ...p, showComments: !p.showComments } : p))}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-150 border border-transparent hover:border-gray-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </button>

          <button
            onClick={() => setShareModalState({ isOpen: true, post })}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-150 border border-transparent hover:border-gray-200"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {post.showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-4 mb-4">
              {(post.comments || []).map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <img
                    src={comment.user_profile_picture || DEFAULT_AVATAR}
                    alt={comment.user_name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm text-gray-900">{comment.user_name}</h4>
                        {currentUser && currentUser.id !== comment.user_id && (
                          <button
                            onClick={() => handleDirectMessage(comment.user_id)}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150 border border-blue-200"
                            title="Send direct message"
                          >
                            <Mail className="w-2.5 h-2.5 mr-1" />
                            Message
                          </button>
                        )}
                      </div>
                      {currentUser && currentUser.id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(post.id, comment.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-150"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentUser && (
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.profilePicture || DEFAULT_AVATAR}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={post.newComment || ''}
                    onChange={(e) => setPosts(posts.map(p => p.id === post.id ? { ...p, newComment: e.target.value } : p))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentUser && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={currentUser.profilePicture || DEFAULT_AVATAR}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
                      rows="3"
                    />
                    
                    {previewImage && (
                      <div className="mt-4 relative w-full max-h-60 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-auto object-cover object-center"
                          style={{ maxHeight: '240px' }}
                        />
                        <button
                          onClick={() => {
                            setPreviewImage(null);
                            setNewPostImage(null);
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors duration-150"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <label className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-gray-50">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={handleSubmitPost}
                        disabled={!newPostContent.trim() && !newPostImage}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm font-medium text-sm"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {renderContent()}
          </div>

          <div className="lg:col-span-1">
            <OnlineUsers />
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxState.open}
        close={() => setLightboxState({ open: false, slides: [] })}
        slides={lightboxState.slides}
      />

      {shareModalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Share Post</h3>
              <button
                onClick={() => setShareModalState({ isOpen: false, post: null })}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex space-x-3">
                <FacebookShareButton
                  url={window.location.href}
                  quote={shareModalState.post?.content}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-sm">
                    <FacebookIcon size={20} round />
                    <span className="font-medium">Facebook</span>
                  </div>
                </FacebookShareButton>
                
                <TwitterShareButton
                  url={window.location.href}
                  title={shareModalState.post?.content}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center space-x-2 p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-150 shadow-sm">
                    <TwitterIcon size={20} round />
                    <span className="font-medium">Twitter</span>
                  </div>
                </TwitterShareButton>
              </div>
              
              <LinkedinShareButton
                url={window.location.href}
                title={shareModalState.post?.content}
                className="w-full"
              >
                <div className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-150 shadow-sm">
                  <LinkedinIcon size={20} round />
                  <span className="font-medium">LinkedIn</span>
                </div>
              </LinkedinShareButton>
              
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 border border-gray-300"
              >
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;