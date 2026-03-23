"use client"
import Image from "next/image";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/Home/HeroSection";
import ProductSection from "./Components/Home/ProductSection";
import './css/Home.css';
import Ticker from "./Components/Home/Ticker";
export default function Home() {
  return (
    <>
    <HeroSection/>
    <ProductSection/>
    <Ticker/>
   
   
    </>
   
  );
}
