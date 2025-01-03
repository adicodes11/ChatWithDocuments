"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, FileText, Sparkles, Brain, Search, Lock } from "lucide-react";

const HomePage = () => {
  const [activeChat, setActiveChat] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveChat((prev) => (prev + 1) % chatExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const chatExamples = [
    {
      question: "What are the key findings in this research paper?",
      answer: "The study shows a 45% improvement in efficiency with the new method...",
      docType: "Research Paper"
    },
    {
      question: "Summarize the financial results for Q2",
      answer: "Revenue increased by 32% YoY, with strong growth in all segments...",
      docType: "Financial Report"
    },
    {
      question: "What are the main contract terms?",
      answer: "The agreement term is 24 months with automatic renewal...",
      docType: "Legal Contract"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-block"
            >
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                AI-Powered Document Intelligence
              </span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Documents,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Now Interactive
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Transform static documents into dynamic conversations. Get instant answers, 
              insights, and analysis through natural dialogue.
            </p>

            {/* Interactive Chat Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 mb-16"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {chatExamples[activeChat].docType}
                  </span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-2xl p-4">
                        <p className="text-gray-800">{chatExamples[activeChat].question}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 bg-blue-50 rounded-2xl p-4">
                        <p className="text-gray-800">{chatExamples[activeChat].answer}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
                <p className="text-gray-600">Advanced AI understands context and provides relevant insights</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Search</h3>
                <p className="text-gray-600">Find any information within your documents in seconds</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">Enterprise-grade security for your sensitive documents</p>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Try For Free
              </motion.button>
              <p className="mt-4 text-sm text-gray-500">No credit card required</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;