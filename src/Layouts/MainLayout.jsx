import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <main>
        <div>
            <Outlet />
        </div>
        <Navbar />
      </main>
    </div>
  );
}

