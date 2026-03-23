"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";


export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    // 1. Check dynamic routes (e.g. /astrologers/chat/123)
    pathname.startsWith("/astrologers/call/") ||
    pathname.startsWith("/astrologers/chat/") ||
    // 2. Check exact paths
    [
      "/demo/user-call",
      "/demo/astrologer-call",
      "/Login",
      "/Signup",
      "/Astrologer/login",
      "/Astrologer/register",
      "/Astrologer",
      "/Astrologer/call-dashboard",
      "/Admin"
    ].includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
     

      {children}
      <Footer/>

     
    </>
  );
}