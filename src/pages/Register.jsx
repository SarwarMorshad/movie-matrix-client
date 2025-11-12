import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { MdMovie } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!isLongEnough) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    // Validate password
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      setLoading(false);
      return;
    }

    try {
      // Create user
      const result = await createUser(email, password);

      // Update profile
      await updateUserProfile(name, photoURL);

      // Update local user state
      setUser({
        ...result.user,
        displayName: name,
        photoURL: photoURL,
      });

      // Save user to database
      await saveUserToDatabase({
        name,
        email,
        photoURL,
      });

      toast.success("Registration successful! Welcome to Movie Matrix");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      // Save user to database
      await saveUserToDatabase({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });

      toast.success("Registration successful! Welcome to Movie Matrix");
      navigate("/");
    } catch (error) {
      console.error("Google registration error:", error);
      toast.error(error.message || "Could not register with Google");
    } finally {
      setLoading(false);
    }
  };

  const saveUserToDatabase = async (userData) => {
    try {
      await axios.post("http://localhost:3000/users", userData);
    } catch (error) {
      console.error("Error saving user:", error);
      // Don't show error to user, as this is not critical
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 max-w-11/12 mx-auto px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <MdMovie className="text-primary text-6xl" />
          </div>
          <h1 className="text-4xl font-bold text-white font-heading mb-2">Join Movie Matrix</h1>
          <p className="text-gray-400">Create an account to start your movie journey</p>
        </div>

        {/* Register Form */}
        <div className="bg-base-200 rounded-2xl p-8 shadow-2xl animate-scaleIn">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Photo URL Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Photo URL</label>
              <div className="relative">
                <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="url"
                  name="photoURL"
                  placeholder="Enter your photo URL"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="input-field pl-12 pr-12"
                  required
                  onChange={(e) => {
                    const error = validatePassword(e.target.value);
                    setPasswordError(error);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400">Password must contain:</p>
                <ul className="text-xs text-gray-400 space-y-1 ml-4">
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• Minimum 6 characters</li>
                </ul>
              </div>

              {/* Password Error */}
              {passwordError && <p className="text-error text-sm mt-2">{passwordError}</p>}
            </div>

            {/* Register Button */}
            <button type="submit" disabled={loading || passwordError} className="btn-primary w-full mt-6">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-400 my-6">OR</div>

          {/* Google Register */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="btn btn-outline w-full text-white hover:bg-white hover:text-black border-white"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-secondary font-semibold transition-colors">
              Login Now
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
