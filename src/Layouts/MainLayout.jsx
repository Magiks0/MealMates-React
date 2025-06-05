import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="p-3 h-16">
        <Navbar />
      </div>
    </div>
  );
}

