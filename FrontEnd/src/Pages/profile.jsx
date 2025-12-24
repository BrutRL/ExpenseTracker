import { useState, useCallback, useMemo } from "react";
import { specific, update } from "../Api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { toast } from "sonner";
function Profile() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => specific(),
  });

  const updateFn = useMutation({
    mutationFn: (data) => update(data),
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        queryClient.setQueryData(["user"], (old) => ({
          ...old,
          data: { ...old.data, ...response.data },
        }));
        setShowUpdate(false);
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

  const updateSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (formData.password != formData.confirmpassword)
        return toast.error(`Password dont match`);
      updateFn.mutate(formData);
    },
    [formData]
  );
  if (isLoading) {
    return <p>Loading profile...</p>;
  }
  return (
    <main className="p-6 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-5">
        <div>
          <label className="text-gray-500 text-sm">Username</label>
          <p className="font-medium text-gray-900 text-lg">
            {userProfile.data?.username}
          </p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Email</label>
          <p className="font-medium text-gray-900 text-lg">
            {userProfile.data?.email}
          </p>
        </div>
        <button
          onClick={() => setShowUpdate(true)}
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
        >
          Update Profile
        </button>
      </div>
      {showUpdate && (
        <div className="fixed inset-0 flex items-center justify-center h-sreen bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center transform transition-all duration-300 scale-95 animate-scaleUp md:w-[600px] ">
            <h2 className="text-2xl  font-semibold text-gray-800 mb-6">
              Update Profile
            </h2>

            <form className="space-y-5" onSubmit={updateSubmit}>
              <input
                type="text"
                name="username"
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none "
                placeholder="Username"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none "
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none "
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmpassword"
                  className="w-full border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none "
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-indigo-600"
                >
                  {showConfirmPass ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </span>
              </div>
              <div className="flex justify-start gap-3">
                <button
                  type="button"
                  className="bg-red-500 text-white px-5 py-2 rounded-lg  transition transform duration-300 hover:scale-105 hover:bg-red-700 "
                  onClick={() => setShowUpdate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-5 py-2 rounded-lg  transition transform duration-300 hover:scale-105 hover:bg-green-600 "
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;
