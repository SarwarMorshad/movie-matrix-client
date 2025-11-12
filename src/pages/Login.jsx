import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdMovie } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const Login = () => {
  const { signInUser, signInWithGoogle, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signInUser(email, password);

      // Save user to database
      await saveUserToDatabase({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back to Movie Matrix",
        background: "#141414",
        color: "#fff",
        confirmButtonColor: "#E50914",
        timer: 2000,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password",
        background: "#141414",
        color: "#fff",
        confirmButtonColor: "#E50914",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      // Save user to database
      await saveUserToDatabase({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome to Movie Matrix",
        background: "#141414",
        color: "#fff",
        confirmButtonColor: "#E50914",
        timer: 2000,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Could not sign in with Google",
        background: "#141414",
        color: "#fff",
        confirmButtonColor: "#E50914",
      });
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
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <MdMovie className="text-primary text-6xl" />
          </div>
          <h1 className="text-4xl font-bold text-white font-heading mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to access your movie collection</p>
        </div>

        {/* Login Form */}
        <div className="bg-base-200 rounded-2xl p-8 shadow-2xl animate-scaleIn">
          <form onSubmit={handleLogin} className="space-y-6">
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

            {/* Password Field */}
            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-secondary transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-400 my-6">OR</div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline w-full text-white hover:bg-white hover:text-black border-white"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-secondary font-semibold transition-colors"
            >
              Register Now
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

export default Login;
