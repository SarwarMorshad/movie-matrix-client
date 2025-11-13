import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiStar, FiEdit2, FiTrash2, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import useAxios from "../hooks/useAxios";

const MovieReviews = ({ movieId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const axiosInstance = useAxios();

  //   const API_URL = "http://localhost:3000";

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/${movieId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Submit new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 10) {
      toast.error("Please select a rating");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post(`/reviews`, {
        movieId,
        rating: newReview.rating,
        comment: newReview.comment,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || null,
      });

      toast.success("Review submitted successfully!");
      setNewReview({ rating: 0, comment: "" });
      setHoverRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update review
  const handleUpdateReview = async (reviewId) => {
    if (!user) return;

    try {
      await axiosInstance.put(`/reviews/${reviewId}`, {
        rating: editingReview.rating,
        comment: editingReview.comment,
        userEmail: user.email,
      });

      toast.success("Review updated successfully!");
      setEditingReview(null);
      setEditHoverRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await axiosInstance.delete(`/reviews/${reviewId}`, {
        params: { email: user.email },
      });

      toast.success("Review deleted successfully!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  // Render star rating (display only)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-yellow-400" size={20} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-yellow-400 opacity-50" size={20} />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-500" size={20} />);
      }
    }
    return stars;
  };

  // Render interactive star rating (for input)
  const renderInteractiveStars = (currentRating, hover, setRating, setHover) => {
    const stars = [];

    for (let i = 1; i <= 10; i++) {
      const isFilled = i <= (hover || currentRating);

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-125"
        >
          <FiStar
            size={32}
            className={`${
              isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-600 hover:text-gray-500"
            } transition-colors`}
          />
        </button>
      );
    }

    return stars;
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Reviews & Ratings</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">{renderStars(averageRating / 2)}</div>
            <span className="text-gray-400 text-lg">
              {averageRating}/10 • {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {user ? (
        <div className="bg-base-200 rounded-2xl p-8 border border-white/10 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Star Rating Input */}
            <div className="form-control">
              <div className="flex items-center justify-between mb-4">
                <label className="text-white font-semibold text-lg">
                  Your Rating <span className="text-error">*</span>
                </label>
                <span className="text-2xl font-bold text-primary">
                  {newReview.rating > 0 ? `${newReview.rating}/10` : "Select rating"}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center bg-base-300 py-6 rounded-xl">
                {renderInteractiveStars(
                  newReview.rating,
                  hoverRating,
                  (rating) => setNewReview({ ...newReview, rating }),
                  setHoverRating
                )}
              </div>

              <p className="text-center text-gray-400 text-sm mt-3">Click on a star to rate (1-10)</p>
            </div>

            {/* Comment Input */}
            <div className="form-control w-full">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-semibold text-lg">
                  Your Review <span className="text-error">*</span>
                </label>
                <span className="text-sm text-gray-400">{newReview.comment.length}/500</span>
              </div>

              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value.slice(0, 500) })}
                placeholder="Share your thoughts about this movie..."
                className="textarea textarea-bordered w-full h-40 bg-base-300 text-white border-white/20 focus:border-primary focus:outline-none resize-none text-base leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !newReview.comment.trim() || newReview.rating === 0}
              className="btn bg-primary hover:bg-red-700 text-white border-none w-full md:w-auto px-10 text-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-base-200 rounded-2xl p-10 border border-white/10 text-center shadow-xl">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-white text-xl font-semibold mb-2">Want to share your thoughts?</p>
          <p className="text-gray-400 mb-6 text-lg">Please login to write a review</p>
          <a href="/login" className="btn bg-primary hover:bg-red-700 text-white border-none px-10 text-lg">
            Login to Review
          </a>
        </div>
      )}

      {/* Reviews Grid - Card Layout */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">All Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-base-200 rounded-2xl border border-white/10 shadow-xl">
            <div className="text-7xl mb-6">⭐</div>
            <p className="text-2xl text-white font-semibold mb-3">No reviews yet</p>
            <p className="text-base text-gray-400">Be the first to review this movie!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-base-200 rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 relative group"
              >
                {editingReview && editingReview._id === review._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="form-control">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white font-semibold">Rating</label>
                        <span className="text-xl font-bold text-primary">{editingReview.rating}/10</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center bg-base-300 py-4 rounded-lg">
                        {renderInteractiveStars(
                          editingReview.rating,
                          editHoverRating,
                          (rating) => setEditingReview({ ...editingReview, rating }),
                          setEditHoverRating
                        )}
                      </div>
                    </div>

                    <textarea
                      value={editingReview.comment}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, comment: e.target.value.slice(0, 500) })
                      }
                      className="textarea textarea-bordered w-full h-32 bg-base-300 text-white border-white/20 focus:border-primary resize-none"
                      maxLength={500}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(review._id)}
                        className="btn btn-sm bg-primary text-white hover:bg-red-700 border-none"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingReview(null)}
                        className="btn btn-sm btn-ghost text-gray-400 hover:text-white hover:bg-base-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode - Dark Card Design
                  <>
                    {/* Edit/Delete Buttons - Top Right */}
                    {user && user.email === review.userEmail && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingReview(review);
                            setEditHoverRating(0);
                          }}
                          className="btn btn-ghost btn-sm text-gray-400 hover:text-primary hover:bg-base-300"
                          title="Edit review"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="btn btn-ghost btn-sm text-gray-400 hover:text-error hover:bg-base-300"
                          title="Delete review"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-200">
                          {review.userPhoto ? (
                            <img src={review.userPhoto} alt={review.userName} referrerPolicy="no-referrer" />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold w-full h-full">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{review.userName}</h4>
                        <div className="flex items-center gap-2 mt-1">{renderStars(review.rating / 2)}</div>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-300 leading-relaxed italic text-base mb-4">"{review.comment}"</p>

                    {/* Date */}
                    <p className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {review.updatedAt && <span className="ml-2 text-gray-400">(Edited)</span>}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReviews;
