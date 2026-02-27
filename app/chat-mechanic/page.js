"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, User, Bot, Wrench, Sun, Moon, ArrowLeft } from "lucide-react";

export default function RelationshipMechanicChat() {
  // --- STATE ---
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I am the Relationship Mechanic. I help you recalibrate your reality. Let's begin. \n\n1) What is happening in your relationship right now?\n2) What are you feeling most intensely?\n3) What action or decision feels hardest for you to make?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  // --- EFFECTS ---

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLERS ---

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput(""); // Clear input immediately

    // 1. Add User Message to UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setIsLoading(true);

    try {
      // 2. Call Backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botResponse =
        data.message || data.response || "System Error: No response.";

      // 3. Add Assistant Message to UI
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botResponse },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection failure. My diagnostic systems are offline. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- RENDER HELPERS ---

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const Avatar = ({ children, className = "" }) => (
    <div
      className={`relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );

  const AvatarFallback = ({ children, className = "" }) => (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full ${className}`}
    >
      {children}
    </div>
  );

  // Loading spinner matching dashboard style
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Theme classes
  const theme = {
    light: {
      bg: "bg-stone-100",
      header: "border-stone-300 bg-white",
      title: "text-stone-800",
      subtitle: "text-stone-500",
      card: "bg-white/80 border-stone-300",
      botAvatar: "bg-stone-200 border border-stone-300 text-teal-600",
      botMessage: "bg-stone-50 border border-stone-200 text-stone-700",
      inputArea: "border-stone-200",
      input:
        "bg-white border-stone-300 text-stone-800 placeholder:text-stone-400 focus:ring-offset-white",
      toggleBtn: "bg-stone-200 text-stone-600 hover:bg-stone-300",
    },
    dark: {
      bg: "bg-stone-900",
      header: "border-stone-700 bg-stone-800",
      title: "text-stone-100",
      subtitle: "text-stone-400",
      card: "bg-stone-800/80 border-stone-700",
      botAvatar: "bg-stone-700 border border-stone-600 text-teal-400",
      botMessage: "bg-stone-800 border border-stone-700 text-stone-300",
      inputArea: "border-stone-700",
      input:
        "bg-stone-900 border-stone-700 text-stone-100 placeholder:text-stone-500 focus:ring-offset-stone-800",
      toggleBtn: "bg-stone-700 text-stone-300 hover:bg-stone-600",
    },
  };

  const t = darkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`border-b ${t.header} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-light ${t.title} transition-colors duration-300`}
              >
                Relationship Mechanic
              </h1>
              <p
                className={`text-xs ${t.subtitle} font-mono uppercase tracking-wider transition-colors duration-300`}
              >
                Diagnostic Engine // Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Back to Dashboard */}
            <Link
              href="/dashboard"
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors duration-300 flex items-center gap-2`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">Dashboard</span>
            </Link>
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors duration-300`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div
          className={`${t.card} backdrop-blur-sm border rounded-2xl flex flex-col h-[calc(100vh-180px)] shadow-sm transition-colors duration-300`}
        >
          {/* Chat Area */}
          <div
            className="flex-1 overflow-y-auto p-6"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="flex flex-col gap-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 w-full max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="mt-1">
                    {msg.role === "assistant" ? (
                      <AvatarFallback
                        className={`${t.botAvatar} transition-colors duration-300`}
                      >
                        <Bot size={16} />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-teal-600 text-white">
                        <User size={16} />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-300 ${
                      msg.role === "user"
                        ? "bg-teal-600 text-white"
                        : t.botMessage
                    }`}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 w-full max-w-[85%]">
                  <Avatar className="mt-1">
                    <AvatarFallback
                      className={`${t.botAvatar} transition-colors duration-300`}
                    >
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`${t.botMessage} rounded-xl px-4 py-3 flex items-center gap-3 transition-colors duration-300`}
                  >
                    <LoadingSpinner />
                    <span
                      className={`text-xs ${t.subtitle} font-mono uppercase tracking-wider`}
                    >
                      Calibrating Response...
                    </span>
                  </div>
                </div>
              )}

              {/* Invisible element for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div
            className={`p-4 border-t ${t.inputArea} transition-colors duration-300`}
          >
            <div className="flex w-full items-end gap-3">
              <input
                type="text"
                placeholder="Describe the situation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className={`flex-1 min-h-12 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 ${t.input}`}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 inline-flex items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shrink-0 transition-colors"
              >
                {isLoading ? <LoadingSpinner /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
