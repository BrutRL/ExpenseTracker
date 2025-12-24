import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authorized } from "../Api/auth";
function ProtectedRoutes({ children }) {
  const { data, isLoading } = useQuery({
    queryKey: ["authCheck"],
    queryFn: () => authorized(),
    retry: false,
  });

  if (isLoading)
    return (
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center h-screen font-poppin">
        <p className="text-6xl font-semibold">Loading...</p>
      </main>
    );
  if (!data?.ok) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoutes;
