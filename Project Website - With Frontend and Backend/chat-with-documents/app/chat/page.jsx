"use client";

import { useState, useRef, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { BsFileEarmarkPdf, BsFileEarmarkText } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import ProfileMenu from "@/components/ProfileMenu";

const ChatWithDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const data = await response.json();
      setIsProcessing(true);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", content: userInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      if (!response.ok) throw new Error("Chat API error");

      const data = await response.json();
      setChatMessages((prev) => [...prev, { type: "bot", content: data.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", content: "Sorry, I couldn't process your request." },
      ]);
    }
  };

  const FileIcon = ({ filename }) => {
    return filename?.toLowerCase().endsWith('.pdf') 
      ? <BsFileEarmarkPdf className="h-6 w-6" />
      : <BsFileEarmarkText className="h-6 w-6" />;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Documents</h2>
          <p className="text-gray-600 text-sm">Upload your documents to start chatting</p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center w-full"
            >
              <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT</span>
            </button>
          </div>

          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <FileIcon filename={selectedFile.name} />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {selectedFile.name}
                </span>
              </div>

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <ImSpinner8 className="animate-spin mr-2" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Chat with your documents</h1>
            <p className="text-sm text-gray-600">
              {isProcessing 
                ? "Ask questions about your uploaded documents"
                : "Upload a document to start chatting"
              }
            </p>
          </div>
          <ProfileMenu />
        </div>

        {/* Messages */}
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Your conversation will appear here</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder={isProcessing ? "Type your message..." : "Upload a document to start chatting"}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!isProcessing || !userInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <IoSendSharp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithDocuments;