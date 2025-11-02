"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow bg-white sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/images/logo.png"
          alt="Bhakti Bites Logo"
          width={150}
          height={150}
          className="object-contain"
        />
        
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <li><Link href="#">Home</Link></li>
        <li><Link href="#products">Products</Link></li>
        <li><Link href="#values">Our Values</Link></li>
        <li><Link href="#story">About</Link></li>
        <li><Link href="#contact">Contact</Link></li>
      </ul>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-700"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <ul className="flex flex-col space-y-4 p-6 text-gray-700 font-medium">
            <li><Link href="#" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link href="#products" onClick={() => setOpen(false)}>Products</Link></li>
            <li><Link href="#values" onClick={() => setOpen(false)}>Our Values</Link></li>
            <li><Link href="#story" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link href="#contact" onClick={() => setOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
