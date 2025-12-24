import { useState, useCallback } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { register } from "../Api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showSucess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const registerFunc = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: (response) => {
      if (response.ok) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setShowSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
  });
  const handleChange = useCallback(
    (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

  const SubmitFunc = useCallback(
    (e) => {
      e.preventDefault();
      if (formData.password != formData.confirmpassword) {
        toast.error("password doest not match");
        return;
      }
      registerFunc.mutate(formData);
    },
    [formData]
  );
  return (
    <main className="bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center h-screen font-poppins px-5">
      <section className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Sign up to start tracking your expenses
        </p>

        <form onSubmit={SubmitFunc} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              onChange={handleChange}
              required
              className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none "
            />
          </div>

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
              className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none "
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
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none "
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmpassword"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-3 cursor-pointer text-gray-500 hover:text-indigo-600"
              >
                {showConfirmPass ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link
              className="text-indigo-600 font-medium hover:underline"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </section>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-96 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-indigo-600">
              Creating Account...
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {showSucess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-scaleUp">
            <h2 className="text-2xl font-bold text-green-600">
              Registration Successful
            </h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Register;
