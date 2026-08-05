import React from "react";
import Navbar from "../Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col overflow-hidden bg-[#f8fafc] select-none">
      <div className="shrink-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        {children}
      </div>
    </div>
  );
}
