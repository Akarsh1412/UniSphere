import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Send,
  Users,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/community/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";

        // Transform backend data to match frontend structure
        const transformedPosts = response.data.posts.map((post) => ({
          id: post.id,
          author: {
            name: post.author_name,
            avatar:
              post.author_avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
            club: "",
            verified: false,
          },
          content: post.content,
          image: post.image,
          timestamp: formatTime(post.created_at),
          likes: parseInt(post.likes_count),
          comments: post.comments
            ? post.comments.map((comment) => ({
                id: comment.id,
                author: {
                  name: comment.author_name,
                  avatar: comment.author_avatar || DEFAULT_AVATAR,
                },
                content: comment.content,
                timestamp: formatTime(comment.created_at),
              }))
            : [],
          shares: post.shares_count || 0,
          liked: post.is_liked || false,
          bookmarked: false,
          showComments: false,
          newComment: "",
        }));

        setPosts(transformedPosts);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
        setIsLoading(false);
      }
    };

    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  // Format timestamp to relative time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;

    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const handleLike = async (postId) => {
    // Optimistically update UI first
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        : post
    );
    setPosts(updatedPosts);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Make API request to backend
      await axios.post(
        `http://localhost:5000/api/community/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Like toggle failed:", error);

      // Revert UI changes on error
      setPosts(posts);
      alert("Failed to update like status. Please try again.");
    }
  };

  const toggleComments = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const handleCommentChange = (postId, value) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, newComment: value } : post
      )
    );
  };

  const handleAddComment = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      // Save comment text and clear input immediately
      const commentText = post.newComment;
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, newComment: "" } : p))
      );

      // Send comment to backend
      const response = await axios.post(
        `http://localhost:5000/api/community/posts/${postId}/comments`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Transform backend response to frontend format
      const serverComment = response.data.comment;
      const newComment = {
        id: serverComment.id,
        author: {
          name: serverComment.author_name,
          avatar:
            serverComment.author_avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        },
        content: serverComment.content,
        timestamp: formatTime(serverComment.created_at),
      };

      // Update state with new comment
      setPosts(
        posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...p.comments, newComment],
              showComments: true,
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Error adding comment:", error);

      // Restore comment text on error
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, newComment: commentText } : p
        )
      );

      alert("Failed to add comment. Please try again.");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() && !selectedImage) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const formData = new FormData();
      formData.append("content", newPost);

      if (selectedImage) {
        const blob = await fetch(selectedImage).then((res) => res.blob());
        const file = new File([blob], "post-image.png", { type: blob.type });
        formData.append("image", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/community/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const serverPost = response.data.post;
      const newPostData = {
        id: serverPost.id,
        author: {
          name: serverPost.author_name,
          avatar:
            serverPost.author_avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
          club: "",
          verified: false,
        },
        content: serverPost.content,
        image: serverPost.image,
        timestamp: "just now",
        likes: parseInt(serverPost.likes_count),
        comments: [],
        shares: 0,
        liked: false,
        bookmarked: false,
        showComments: false,
        newComment: "",
      };

      setPosts([newPostData, ...posts]);
      setNewPost("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const trendingTopics = [
    { tag: "#TechFest2025", posts: "2.3K" },
    { tag: "#CulturalNight", posts: "1.8K" },
    { tag: "#StudyTips", posts: "1.2K" },
    { tag: "#CampusLife", posts: "967" },
    { tag: "#Innovation", posts: "543" },
  ];

  const suggestedClubs = [
    {
      name: "Debate Society",
      members: "156",
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=80&h=80&fit=crop",
    },
    {
      name: "Music Club",
      members: "234",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
    },
    {
      name: "Gaming Society",
      members: "189",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&h=80&fit=crop",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading posts
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-xl text-gray-600">
              Connect, share, and inspire with your campus community
            </p>
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
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    >
                      <span className="font-medium text-blue-600">
                        {topic.tag}
                      </span>
                      <span className="text-sm text-gray-500">
                        {topic.posts}
                      </span>
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
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-all duration-200"
                    >
                      <img
                        src={club.image}
                        alt={club.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {club.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {club.members} members
                        </p>
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
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-full max-h-64 object-cover rounded-xl"
                        />
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
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
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
                  <div
                    key={post.id}
                    className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-gray-900">
                                {post.author.name}
                              </h3>
                              {post.author.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {post.author.club} • {post.timestamp}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <p className="text-gray-800 mb-4 leading-relaxed">
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 transition-all duration-200 ${
                              post.liked
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              size={20}
                              fill={post.liked ? "currentColor" : "none"}
                            />
                            <span className="font-medium">{post.likes}</span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className={`flex items-center space-x-2 transition-all duration-200 ${
                              post.showComments
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                            }`}
                          >
                            <MessageCircle size={20} />
                            <span className="font-medium">
                              {post.comments.length}
                            </span>
                          </button>

                          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-all duration-200">
                            <Share2 size={20} />
                            <span className="font-medium">{post.shares}</span>
                          </button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {post.showComments && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="space-y-4">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start space-x-3"
                              >
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full object-cover mt-1"
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="flex items-baseline">
                                      <h4 className="font-semibold text-sm">
                                        {comment.author.name}
                                      </h4>
                                      <span className="text-xs text-gray-500 ml-2">
                                        {comment.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 mt-1">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Comment Form */}
                          <div className="mt-4 flex items-center space-x-3">
                            <img
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                              alt="Your avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 flex bg-gray-50 rounded-full px-4 py-2">
                              <input
                                type="text"
                                value={post.newComment}
                                onChange={(e) =>
                                  handleCommentChange(post.id, e.target.value)
                                }
                                placeholder="Write a comment..."
                                className="flex-1 bg-transparent border-0 focus:outline-none text-sm"
                                onKeyPress={(e) =>
                                  e.key === "Enter" && handleAddComment(post.id)
                                }
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Send size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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
