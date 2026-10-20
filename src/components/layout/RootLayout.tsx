import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollToTop from "../common/ScrollToTop";
import ContactFAB from "../common/ContactFAB";

export default function RootLayout() {
  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <ContactFAB />
    </div>
  );
}
