import { Link } from "react-router-dom";
function NotFound() {
  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl font-semibold">404</h1>
      <p className="text-gray-700">Oops! Looks like you took a wrong turn.</p>
      <Link
        className="w-50 mt-3 bg-indigo-600 text-center text-white p-3 rounded-lg font-medium shadow transition transform duration-300 hover:bg-indigo-700 hover:scale-105"
        to="/login"
      >
        Go back to Login
      </Link>
    </main>
  );
}

export default NotFound;
