"use client"

import React, {useState} from 'react'
import Link from 'next/link'
import { Menu, X } from "lucide-react"; // for icons
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { toast } from 'sonner';

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const {data: session} = useSession()
    const user = session?.user as User


    const handleSignOut = () => {
      signOut();
      console.log("User Logged out");
      
      toast.warning('User Logged out')
    }


  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Anonymous <span className="text-blue-600">Feedbacks</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-lg">
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-800 font-medium">
                  Hello, {user.username?.split(" ")[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="flex flex-col space-y-3 p-4">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>

            <div className="pt-3 border-t border-gray-200">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition mb-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar