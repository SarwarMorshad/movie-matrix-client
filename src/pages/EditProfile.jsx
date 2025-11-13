import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiCamera, FiSave, FiX, FiArrowLeft } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, setUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const [previewImage, setPreviewImage] = useState(user?.photoURL || "");

  // Default avatar
  const defaultAvatar = "https://i.ibb.co/2FbxWkt/user.png";
  const userAvatar = imageError ? defaultAvatar : previewImage || defaultAvatar;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update preview if photo URL changes
    if (name === "photoURL") {
      setPreviewImage(value);
      setImageError(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // Update Firebase profile using AuthContext function
      await updateUserProfile(formData.displayName, formData.photoURL);

      // Update context manually to force re-render immediately
      setUser({
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL || null,
      });

      toast.success("Profile updated successfully! 🎉");

      // Navigate back to profile
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/profile");
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setPreviewImage(user?.photoURL || "");
    setImageError(false);
    toast.success("Form reset to original values");
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="btn btn-ghost text-white mb-4 hover:text-primary"
        >
          <FiArrowLeft size={20} />
          Back to Profile
        </button>

        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <FiUser className="text-primary" />
          Edit Profile
        </h1>
        <p className="text-gray-400 text-lg">Update your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Card - Left Side */}
        <div className="lg:col-span-1">
          <div className="bg-base-200 rounded-2xl p-8 border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Profile Preview</h2>

            {/* Avatar Preview */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                    <img
                      src={userAvatar}
                      alt="Preview"
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                {/* Camera Icon */}
                <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                  <FiCamera size={20} />
                </div>
              </div>
            </div>

            {/* Name Preview */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                {formData.displayName || "Your Name"}
                <HiSparkles className="text-yellow-400" />
              </h3>
              <p className="text-gray-400">{user.email}</p>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-300 text-sm text-center">
                <FiCamera className="inline mr-2" />
                This is how your profile will look
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form - Right Side */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="bg-base-200 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FiUser className="text-2xl text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Display Name</h2>
                  <p className="text-gray-400 text-sm">This is your public name</p>
                </div>
              </div>

              <div className="form-control">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Enter your display name"
                  className="input input-bordered bg-base-300 text-white border-white/20 focus:border-primary focus:outline-none text-lg"
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    {formData.displayName.length}/50 characters
                  </span>
                </label>
              </div>
            </div>

            {/* Photo URL */}
            <div className="bg-base-200 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <FiCamera className="text-2xl text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Profile Photo</h2>
                  <p className="text-gray-400 text-sm">Enter image URL for your avatar</p>
                </div>
              </div>

              <div className="form-control">
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="input input-bordered bg-base-300 text-white border-white/20 focus:border-secondary focus:outline-none text-lg"
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">Paste a direct link to your image</span>
                </label>
              </div>

              {/* Image URL Help */}
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 mt-4">
                <p className="text-yellow-300 text-sm">
                  <strong>💡 Tip:</strong> Use image hosting services like{" "}
                  <a
                    href="https://imgbb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-200"
                  >
                    ImgBB
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://imgur.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-200"
                  >
                    Imgur
                  </a>{" "}
                  to get a direct image URL.
                </p>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="bg-base-200 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FiMail className="text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Email Address</h2>
                  <p className="text-gray-400 text-sm">Email cannot be changed</p>
                </div>
              </div>

              <div className="form-control">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input input-bordered bg-base-300/50 text-gray-400 border-white/10 cursor-not-allowed text-lg"
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    🔒 Your email is managed by Firebase Authentication
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn bg-primary hover:bg-red-700 text-white border-none flex-1 min-w-[200px] text-lg"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="btn btn-outline text-white hover:bg-base-300 border-white/20 flex-1 min-w-[200px] text-lg"
              >
                <FiX />
                Reset
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-ghost text-gray-400 hover:text-white hover:bg-base-300 w-full lg:w-auto text-lg"
              >
                <FiArrowLeft />
                Cancel
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <HiSparkles className="text-yellow-400" />
              Profile Update Information
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Your display name will be visible to all users</li>
              <li>• Email address cannot be changed for security reasons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
