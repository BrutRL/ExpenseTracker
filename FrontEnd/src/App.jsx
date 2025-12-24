import { useState } from "react";
import { Toaster } from "sonner";
import "./App.css";
import Login from "./Authentication/login";
import Register from "./Authentication/registration";
import Sidebar from "./Pages/sidebar";
import NotFound from "./Pages/404";
import ProtectedRoutes from "./Authentication/ProtectedRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Sidebar />
            </ProtectedRoutes>
          }
        ></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
