// src/app/login/page.jsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Phone, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// --- E-Commerce Green Theme ---
const LoginPage = () => {
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState({ 
    phone: ""
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // Format phone number
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) return cleaned;
    return cleaned.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const fullPhone = `${countryCode}${formData.phone}`;

    try {
      setIsLoading(true);
      // Simulate API call - Replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("OTP sent to:", fullPhone);
      
      toast.success("OTP sent successfully!");
      setOtpSent(true);
      setTimer(120);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  // Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Login validation
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!otpSent) {
      toast.error("Please request OTP first");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call - Replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fullPhone = `${countryCode}${formData.phone}`;
      console.log("Login with:", fullPhone, "OTP:", otp);
      
      toast.success("Login successful!");
      
      // Store token and user data (mock)
      localStorage.setItem("token", "mock-token-123");
      localStorage.setItem("user", JSON.stringify({ phone: fullPhone }));
      
      router.push("/");
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F7E6] to-[#E0EBD0]">
      <div className="flex flex-col md:flex-row w-[90%] max-w-[1000px] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Panel - Brand & Visual */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-10 bg-gradient-to-br from-[#1A4D3E] to-[#0F3A2E] text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#8BC34A] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5A9E4E] opacity-10 rounded-full translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-12 h-12 text-[#8BC34A]" />
                <h1 className="text-4xl font-bold  tracking-tight ">AVILINE</h1>
              </div>
              <p className="text-sm text-[#B8D9C5] tracking-wide">Sustainable Fashion</p>
            </div>

            <div className="w-full flex justify-center mb-8">
              <div className="relative w-full  h-64">
                <Image
                  src="/login.png"
                  alt="Fashion Model"
                  fill
                  className="object-cover opacity-90"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300";
                  }}
                />
              </div>
            </div>

            <blockquote className="text-center italic text-[#B8D9C5] max-w-[280px] text-sm leading-relaxed">
              "Style is a reflection of your attitude and your personality."
            </blockquote>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-[#B8D9C5]">
                Join the sustainable fashion movement
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex justify-center items-center bg-white p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#1A4D3E]">Welcome Back</h2>
              <p className="text-sm text-[#8A9B6E] mt-2">Sign in to continue shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number with Country Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A4D3E]">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 max-sm:w-fit  px-3 py-3 rounded-xl border max-sm:text-xs max-sm:px-1 border-[#D0E0C0] bg-[#F5F9F0] text-[#1A4D3E] font-medium focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+49">🇩🇪 +49</option>
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      className="w-full px-5 py-3 rounded-xl border border-[#D0E0C0] bg-[#F5F9F0] text-[#1A4D3E] placeholder:text-[#8A9B6E] focus:outline-none focus:ring-2 focus:ring-[#8BC34A] transition-all  max-sm:placeholder:text-transparent "
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A9B6E]" />
                  </div>
                </div>
              </div>

              {/* Send OTP Button */}
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !formData.phone || formData.phone.length !== 10}
                  className="w-full py-3 rounded-xl bg-[#8BC34A] text-white font-semibold hover:bg-[#5A9E4E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}

              {/* OTP Input */}
              {otpSent && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#1A4D3E]">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                      }}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-5 py-3 text-center text-xl tracking-[8px] font-mono rounded-xl border border-[#D0E0C0] bg-[#F5F9F0] text-[#1A4D3E] focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                    />
                  </div>
                  
                  {timer > 0 ? (
                    <p className="text-center text-sm text-[#8A9B6E]">
                      OTP expires in <span className="font-semibold text-[#1A4D3E]">{formatTime(timer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full text-center text-sm text-[#8BC34A] hover:text-[#5A9E4E] font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`w-full py-3.5 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  hover
                    ? "bg-[#1A4D3E] text-white"
                    : "bg-[#8BC34A] text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    <span>Login</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D0E0C0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#8A9B6E]">New to Aviline?</span>
                </div>
              </div>

              {/* Guest Checkout Option */}
              <Link
                href="/"
                className="block w-full py-3 text-center text-[#1A4D3E] border border-[#D0E0C0] rounded-xl hover:bg-[#F5F9F0] transition-all font-medium"
              >
                Continue as Guest
              </Link>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-xs text-[#8A9B6E]">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-[#8BC34A] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#8BC34A] hover:underline">
                  Privacy Policy
                </Link>
              </p>
              <p className="text-xs text-[#8A9B6E]">
                Need help?{" "}
                <Link href="/contact" className="text-[#8BC34A] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;