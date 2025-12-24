import { useState, useCallback } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { login } from "../Api/auth";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = useCallback(
    (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

  const loginFunc = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      if (response.ok) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginFunc.mutate(formData);
  };

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center h-screen font-poppins px-5">
      <section className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Login to track your expenses
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 cursor-pointer text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 accent-indigo-600 rounded"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />
              <span className="text-gray-600">Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?
            <Link
              className="text-indigo-600 font-medium hover:underline"
              to="/register"
            >
              Sign up
            </Link>
          </p>
        </form>
      </section>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-96 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-indigo-600">
              Checking Account...
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-scaleUp">
            <h2 className="text-2xl font-bold text-green-600">
              Login Successful
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome back! You're now logged in.
            </p>
            <p className="text-green-600 mt-3">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;
