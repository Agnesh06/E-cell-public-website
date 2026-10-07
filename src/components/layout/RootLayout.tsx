import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function RootLayout() {
  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      <Outlet />
    </div>
  );
}
