"use client"
import Link from "next/link";
import {  ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import SignupPopup from "./Sections/SignupPopup";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Shop",
      href: "/shop",
    },
    {
      name: "Track Order",
      href: "/track-order",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  const { cart } = useCart();
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const { data: session } = useSession();
  
  

  return (
    <nav className=" text-white w-full overflow-x-hidden py-4 px-6 border-b border-gray-800 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <Image
            src={"/logo.svg"}
            width={30}
            height={80}
            alt="logo"
            className="object-cover"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="relative font-montserrat font-normal text-md xl:text-lg transition-colors duration-300
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:h-[2px] after:bg-[#CCFF00] after:transform-gpu  after:w-0 hover:after:w-full
             after:transition-all after:duration-300
             "
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="hover:text-[#CCFF00] relative">
            <ShoppingCart className="w-5 h-5" />
            <div className="absolute bg-[#c2e53a]  w-full h-full -top-2 -right-3 text-xs text-black  flex justify-center items-center rounded-full p-1">
              {cart.length > 0 ? cart.length : 0}
            </div>
          </Link>
          {session?.user ? (
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/profile"}>
                  <User className="..." />
                </Link>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => setShowSignupPopup(true)}>
                  <User className="..." />
                </button>
              )}
        </div>
      </div>
      {showSignupPopup && (
        <SignupPopup onClose={() => setShowSignupPopup(false)} />
      )}
    </nav>
  );
}
