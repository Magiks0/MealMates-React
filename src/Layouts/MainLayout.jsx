import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
