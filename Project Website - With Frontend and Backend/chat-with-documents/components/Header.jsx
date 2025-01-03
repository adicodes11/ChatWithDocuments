"use client";

import { useState } from "react";
import { ChevronDown, Menu, X, FileText, Users, Book, Gift, HelpCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const solutions = [
    { name: "Document Analysis", description: "AI-powered document understanding", icon: FileText },
    { name: "Team Collaboration", description: "Work together seamlessly", icon: Users },
    { name: "Knowledge Base", description: "Create and manage documentation", icon: Book },
  ];

  const resources = [
    { name: "Documentation", href: "#", icon: Book },
    { name: "API Reference", href: "#", icon: ExternalLink },
    { name: "Help Center", href: "#", icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-800 shadow-sm z-50">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <a href="/" className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Chat with Documents</span>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span>Solutions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 w-72 mt-2 bg-white rounded-xl shadow-lg py-2 px-3 border border-gray-100"
                    >
                      {solutions.map((item) => (
                        <a
                          key={item.name}
                          href="#"
                          className="flex items-center space-x-4 p-3 hover:bg-blue-50 rounded-lg group"
                        >
                          <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100">
                            <item.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{item.name}</p>
                            <p className="text-gray-500 text-sm">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown('resources')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 w-56 mt-2 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
                    >
                      {resources.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-gray-700"
                        >
                          <item.icon className="w-5 h-5 text-blue-600" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              
              <a href="#enterprise" className="text-gray-600 hover:text-blue-600 transition-colors">
                Enterprise
              </a>

              <div className="flex items-center space-x-4">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign in
                </motion.a>
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </motion.a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                <a href="#solutions" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                  Solutions
                </a>
                <a href="#resources" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                  Resources
                </a>
                <a href="#pricing" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                  Pricing
                </a>
                <a href="#enterprise" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                  Enterprise
                </a>
                <div className="pt-4 space-y-2">
                  <a href="/login" className="block px-3 py-2 text-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    Sign in
                  </a>
                  <a href="/register" className="block px-3 py-2 text-center rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
                    Start Free Trial
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;