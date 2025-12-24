import { useState, useCallback, useMemo } from "react";
import { userBalance, addBalance, balanceHistory } from "../Api/balance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function Balance() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [Balance, setBalance] = useState({ currentBalance: "" });

  const { data: currentBalance, isSuccess: balanceSuccess } = useQuery({
    queryKey: ["currentBalance"],
    queryFn: () => userBalance(),
  });

  const { data: history = [], isSuccess: historySuccess } = useQuery({
    queryKey: ["balanceHistory"],
    queryFn: async () => {
      const res = await balanceHistory();
      return res.message;
    },
  });

  const handleChange = useCallback((e) => {
    setBalance({ ...Balance, [e.target.name]: e.target.value });
  }, []);

  const addBalanceFn = useMutation({
    mutationFn: (data) => addBalance(data),
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        queryClient.invalidateQueries(["currentBalance"]);
        queryClient.invalidateQueries(["balanceHistory"]);
        setShowCreate(false);
      } else {
        toast.error(response.message);
      }
    },
  });

  const addSubmit = useCallback(
    (e) => {
      e.preventDefault();
      addBalanceFn.mutate(Balance);
    },
    [Balance]
  );

  return (
    <main className="md:p-6">
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl rounded-2xl p-8 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight">
          ₱{currentBalance?.toLocaleString("en-US")}
        </h1>
        <p className="text-green-100 mt-2 text-lg">Your Current Balance</p>

        <button
          onClick={() => setShowCreate(true)}
          className="mt-6 bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-50 hover:scale-105 transition"
        >
          + Add Balance
        </button>
      </section>

      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center h-sreen bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center transform transition-all duration-300 scale-95 animate-scaleUp md:w-[600px] ">
            <h2 className="text-2xl  font-semibold text-gray-800 mb-6">
              Add Balance
            </h2>

            <form onSubmit={addSubmit} className="space-y-5">
              <input
                type="number"
                name="currentBalance"
                className="w-full border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none "
                placeholder="Enter amount"
                min="0"
                onChange={handleChange}
                required
              />

              <div className="flex justify-start gap-3">
                <button
                  type="button"
                  className="bg-red-500 text-white px-5 py-2 rounded-lg  transition transform duration-300 hover:scale-105 hover:bg-red-700 "
                  onClick={() => setShowCreate(false)}
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

      <section className="bg-white shadow-lg rounded-2xl p-6 mt-7">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Balance History
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center">No history yet</p>
        ) : (
          <div className="relative border-l border-gray-200 pl-6 space-y-6">
            {history.map((data) => (
              <div key={data._id} className="relative">
                <span className="absolute -left-3 top w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  {data.type === "add" ? (
                    <span className="text-green-600 font-bold ">+</span>
                  ) : (
                    <span className="text-red-600 font-bold">-</span>
                  )}
                </span>
                <div className="flex justify-between items-center">
                  <span
                    className={`font-medium ${
                      data.type == "add" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.type == "add" ? "+" : "-"} ₱
                    {data.amount?.toLocaleString("en-us")}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(data.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Balance;
