import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import Transaction from "./transaction";
import Dashboard from "./dashboard";
import Balance from "./balance";
import { logout } from "../Api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Profile from "./profile";
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const component = {
    dashboard: <Dashboard setActive={setActive} />,
    transaction: <Transaction />,
    balance: <Balance />,
    profile: <Profile />,
  };

  const logoutFn = useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      if (response.ok) {
        toast.success(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    },
  });
  return (
    <main className="font-poppins min-h-screen bg-gray-50">
      <header className="w-full sticky top-0 bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GiHamburgerMenu
            className="h-7 w-7 cursor-pointer text-gray-700 hover:scale-105 transition"
            onClick={() => setIsOpen(!isOpen)}
          />
          <h1 className="font-bold text-2xl text-gray-800 tracking-tight">
            Expenses Tracker
          </h1>
        </div>

        <div className="relative">
          <FaUserCircle
            className="h-7 w-7 cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="absolute right-0 mt-2  w-40 bg-white shadow-lg rounded-md p-2 z-50">
              <button
                className="w-full text-left px-4 py-2 transition transform duration-300  rounded-md hover:scale-105 hover:bg-black hover:text-white"
                onClick={() => setActive("profile")}
              >
                Profile
              </button>
              <button
                className="w-full mt-1 text-left px-4 py-2 transition transform duration-300  rounded-md hover:scale-105 hover:bg-black hover:text-white "
                onClick={() => logoutFn.mutate()}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <IoClose
              className="w-7 h-7 cursor-pointer text-gray-600 hover:text-red-500 transition"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <ul className="space-y-3 flex-1">
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "transaction", label: "Transaction" },
              { key: "balance", label: "Balance" },
            ].map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActive(item.key)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition duration-200
                    ${
                      active === item.key
                        ? "bg-green-500 text-white font-medium shadow"
                        : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                    }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <main className="ml-5 p-6">{component[active]}</main>
    </main>
  );
}

export default Sidebar;
