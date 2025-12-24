import { all, create, destroy, update } from "../Api/transaction";
import { userBalance } from "../Api/balance";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { ImTicket } from "react-icons/im";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { useBalance } from "../BalanceContext/balanceContext";
import { toast } from "sonner";
function Transaction() {
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { data: balanceData, isLoading, error } = useBalance();
  const defaultFormData = {
    name: "",
    category: "",
    amount: "",
    date: "",
    note: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const { data: Transactions, isSuccess: transactionSucess } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => all(),
  });
  const deleteFn = useMutation({
    mutationFn: (id) => destroy(id),
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        queryClient.invalidateQueries(["transactions"]);
        queryClient.invalidateQueries(["currentBalance"]);
      } else {
        toast.error(response.message);
      }
    },
  });
  const createFn = useMutation({
    mutationFn: (data) => create(data),
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        setFormData(defaultFormData);
        setShowCreate(false);
        queryClient.invalidateQueries(["transactions"]);
        queryClient.invalidateQueries(["currentBalance"]);
      } else {
        toast.error(response.message);
      }
    },
  });

  const updateFn = useMutation({
    mutationFn: ({ id, data }) => update(id, data),
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        queryClient.invalidateQueries(["transactions"]);
        queryClient.invalidateQueries(["currentBalance"]);
        setShowUpdate(false);
      } else {
        toast.error(response.message);
      }
    },
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitCreate = useCallback(
    (e) => {
      e.preventDefault();
      createFn.mutate(formData);
    },
    [formData]
  );

  const updateSubmit = useCallback(
    (e) => {
      e.preventDefault();
      updateFn.mutate({ id: formData._id, data: formData });
    },
    [formData]
  );
  const deleteSubmit = useCallback((id) => {
    deleteFn.mutate(id);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!Transactions) return [];
    if (!searchTerm) return Transactions;
    const lower = searchTerm.toLowerCase();
    return Transactions.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.note?.toLowerCase().includes(lower)
    );
  }, [Transactions, searchTerm]);
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4 lg:px-20">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
            Track Your Spending
          </h1>
          <h2 className="text-gray-600 text-base lg:text-lg mt-2 max-w-xl">
            Stay in control of your finances by recording each expense as it
            happens. Monitor, reflect, and grow.
          </h2>
        </div>

        <button
          className={`font-medium px-5 py-3 rounded-lg shadow-md transition duration-300 ${
            balanceData > 0
              ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
              : "bg-green-300 text-white cursor-not-allowed"
          }`}
          onClick={() => setShowCreate(true)}
          disabled={!balanceData || balanceData <= 0}
        >
          {balanceData > 0 ? "+ Add Expense" : "Add Balance First"}
        </button>
      </div>

      <section className="  rounded-md mt-5 lg:px-20">
        <input
          type="text"
          className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transactions..."
        />
        {transactionSucess && filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-5">
            No transactions to display
            <ImTicket className="mx-auto h-10 w-10 mt-5 text-gray-400" />
          </p>
        ) : (
          <div className="grid gap-5 mt-5">
            {filteredTransactions?.map((data) => (
              <div
                key={data._id}
                className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {data.name}
                  </p>
                  <div className="flex gap-4 text-gray-600 text-sm mt-1">
                    <p>
                      {new Date(data.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p>{`₱${data.amount?.toLocaleString("en-us")}`}</p>
                  </div>
                  {data.note && (
                    <p className="mt-2 text-sm  text-gray-500">{data.note}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <CiEdit
                    className="w-9 h-9 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:scale-110 hover:bg-blue-600 transition"
                    onClick={() => {
                      setShowUpdate(true);
                      setFormData(data);
                    }}
                  />
                  <MdDeleteOutline
                    className="w-9 h-9 bg-red-500 text-white rounded-full p-2 cursor-pointer hover:scale-110 hover:bg-red-600 transition"
                    onClick={() => deleteSubmit(data._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showCreate && (
        <section className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center transform transition-all duration-300 scale-95 animate-scaleUp md:w-[600px] ">
            <h2 className="text-2xl font-semibold text-green-600 lg:text-3xl">
              Create Transaction
            </h2>
            <form action="" className="space-y-3 mt-3" onSubmit={submitCreate}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                required
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="text"
                placeholder="Category"
                name="category"
                required
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                min="0"
                required
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="date"
                placeholder="Date"
                name="date"
                required
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="text"
                placeholder="Note (Optional)"
                name="note"
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />

              <div className="flex gap-3">
                <button
                  className="bg-red-500 w-20 text-white p-3 rounded-md transition transform duration-300 hover:scale-105 hover:bg-red-700"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500  w-20 text-white p-3 rounded-md transition transform duration-300 hover:scale-105 hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {showUpdate && (
        <section className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center transform transition-all duration-300 scale-95 animate-scaleUp md:w-[600px] ">
            <h2 className="text-2xl font-semibold text-blue-600 lg:text-3xl">
              Update Transaction
            </h2>
            <form action="" className="space-y-3 mt-3" onSubmit={updateSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="text"
                placeholder="Category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                min="0"
                value={formData.amount}
                required
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="date"
                placeholder="Date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />
              <input
                type="text"
                placeholder="Note (Optional)"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-gray-100  p-3 rounded-md text-gray-700"
              />

              <div className="flex gap-3">
                <button
                  className="bg-red-500 w-20 text-white p-3 rounded-md transition transform duration-300 hover:scale-105 hover:bg-red-700"
                  onClick={() => setShowUpdate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500  w-20 text-white p-3 rounded-md transition transform duration-300 hover:scale-105 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}

export default Transaction;
