"use client"
import Image from "next/image";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/Home/HeroSection";
import ProductSection from "./Components/Home/ProductSection";
import './css/Home.css';
export default function Home() {
  return (
    <>
    <HeroSection/>
    <ProductSection/>
   
   
    </>
   
  );
}
