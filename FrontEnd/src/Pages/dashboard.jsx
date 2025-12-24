import { FaBoxArchive } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { ImTicket } from "react-icons/im";
import { userBalance } from "../Api/balance";
import {
  userTransactionCount,
  userTotalExpense,
  all,
  weeklyExpenses,
} from "../Api/transaction";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

import { Pie } from "react-chartjs-2";
import { FaArrowTrendDown } from "react-icons/fa6";
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard({ setActive }) {
  const { data: currentBalance, isSuccess: initialBalanceSuccess } = useQuery({
    queryKey: ["currentBalance"],
    queryFn: () => userBalance(),
  });
  const { data: transactionCount } = useQuery({
    queryKey: ["transactionCount"],
    queryFn: () => userTransactionCount(),
  });

  const { data: totalExpense, isSuccess: expenseSuccess } = useQuery({
    queryKey: ["totalExpense"],
    queryFn: () => userTotalExpense(),
  });
  const { data: transactions = [], isSuccess: transactionSuccess } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => all(),
  });
  const { data: weeklyExpense, isSuccess: weeklySuccess } = useQuery({
    queryKey: ["weeklyExpenses"],
    queryFn: () => weeklyExpenses(),
  });

  const labels = weeklyExpense?.map((item) =>
    new Date(item._id).toLocaleDateString("en-US", { weekday: "short" })
  );

  const values = weeklyExpense?.map((item) => item.totalWeeklyExpense);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: values,
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        fill: true,
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₱${context.raw.toLocaleString("en-US")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 12 } },
      },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#6B7280",
          callback: (value) => `₱${value}`,
        },
      },
    },
  };

  const pieData = {
    labels: ["Current Balance", "Transactions", "Total Expense"],
    datasets: [
      {
        data: [currentBalance || 0, transactionCount || 0, totalExpense || 0],
        backgroundColor: ["#3869EB", "#7C3AED", "#F59E0B"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <main className="">
      <section className="flex flex-col space-y-3 lg:grid grid-cols-3 lg:gap-10 lg:p-5">
        <div className="bg-[#3869EB] text-white p-5 rounded-md flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <FaBoxArchive className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-xl">
              {`₱${(currentBalance || 0).toLocaleString("en-US")}`}
            </p>
            <p className="font-medium">Current Balance</p>
          </div>
        </div>

        <div className="bg-[#7C3AED] text-white p-5 rounded-md flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <FaShoppingCart className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-xl">{transactionCount}</p>
            <p className="font-medium">Transaction</p>
          </div>
        </div>

        <div className="bg-[#F59E0B] text-white p-5 rounded-md flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <FaMoneyCheckDollar className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-xl">
              {`₱${totalExpense?.toLocaleString("en-Us")}`}
            </p>
            <p className="font-medium">Total Expense</p>
          </div>
        </div>
      </section>

      <section className="mt-5 lg:flex justify-center gap-10 ">
        <div className="bg-white p-5 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-3">Financial Overview</h2>
          <div className="w-full max-w-md h-64 mx-auto ">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-white p-6 mt-5 rounded-xl shadow-md lg:max-w-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Weekly Spending
          </h2>
          <p className="text-sm text-gray-500 mb-4">Last 7 days trend</p>
          <Line data={data} options={options} />
        </div>
      </section>
      <section className="">
        <div className="shadow rounded-md p-5 mt-7">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg">Recent Transaction</h2>
            <button
              onClick={() => {
                setActive("transaction");
              }}
              className="flex gap-3  bg-gray-200 p-2 rounded-lg border border-gray-300 transition transform duration-300 hover:scale-110"
            >
              See All
              <FaLongArrowAltRight className="mt-1" />
            </button>
          </div>
          {transactionSuccess && transactions.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No transactions to display
              <ImTicket className="flex justify-self-center h-15 w-15 mt-5" />
            </p>
          ) : (
            transactions.slice(0, 5).map((data) => (
              <div key={data._id} className="flex justify-between mt-5">
                <div>
                  <p className="font-medium">{data.name}</p>
                  <p>
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="mt-2  bg-red-200 rounded-md text-center p-3  flex justify-between gap-2">
                  <p className="text-red-600">{`-₱${data.amount?.toLocaleString(
                    "en-Us"
                  )}`}</p>
                  <FaArrowTrendDown className="text-red-600 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
