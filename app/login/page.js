"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Sun, Moon, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
      decorative1: "bg-teal-500/15",
      decorative2: "bg-cyan-500/15",
      title: "text-stone-800",
      subtitle: "text-stone-500",
      card: "bg-white/80 backdrop-blur-sm border-stone-300",
      label: "text-stone-600",
      input:
        "bg-white border-stone-300 text-stone-800 placeholder-stone-400 focus:border-teal-500 focus:ring-teal-500/50",
      error: "bg-red-500/10 border-red-400/30 text-red-600",
      button:
        "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-teal-500/20",
      divider: "border-stone-300",
      dividerText: "text-stone-400",
      linkText: "text-stone-500",
      link: "text-teal-600 hover:text-teal-500",
      toggleBtn: "bg-stone-200 text-stone-600 hover:bg-stone-300",
    },
    dark: {
      bg: "bg-stone-900",
      decorative1: "bg-teal-500/10",
      decorative2: "bg-cyan-500/10",
      title: "text-stone-100",
      subtitle: "text-stone-400",
      card: "bg-stone-800/50 backdrop-blur-sm border-stone-700",
      label: "text-stone-400",
      input:
        "bg-stone-900 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-teal-500 focus:ring-teal-500/50",
      error: "bg-red-500/10 border-red-500/30 text-red-400",
      button:
        "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-stone-950 shadow-lg shadow-teal-500/20",
      divider: "border-stone-700",
      dividerText: "text-stone-500",
      linkText: "text-stone-400",
      link: "text-teal-500 hover:text-teal-400",
      toggleBtn: "bg-stone-700 text-stone-300 hover:bg-stone-600",
    },
  };

  const t = darkMode ? theme.dark : theme.light;

  return (
    <div
      className={`min-h-screen ${t.bg} flex items-center justify-center px-4 transition-colors duration-300`}
    >
      {/* Dark/Light Mode Toggle - Fixed Position */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-2 rounded-lg ${t.toggleBtn} transition-colors duration-300 z-10`}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/3 -right-32 w-80 h-80 ${t.decorative1} rounded-full blur-3xl transition-colors duration-300`}
        />
        <div
          className={`absolute bottom-1/3 -left-32 w-80 h-80 ${t.decorative2} rounded-full blur-3xl transition-colors duration-300`}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-600 rounded-xl">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1
            className={`text-4xl font-light ${t.title} tracking-tight mb-2 transition-colors duration-300`}
          >
            Welcome Back
          </h1>
          <p
            className={`${t.subtitle} text-sm tracking-wide transition-colors duration-300`}
          >
            Sign in to continue
          </p>
        </div>

        {/* Form Card */}
        <div
          className={`${t.card} border rounded-2xl p-8 shadow-2xl transition-colors duration-300`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className={`${t.error} border rounded-lg px-4 py-3 transition-colors duration-300`}
              >
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-medium ${t.label} uppercase tracking-wider transition-colors duration-300`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors duration-300 ${t.input}`}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-medium ${t.label} uppercase tracking-wider transition-colors duration-300`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors duration-300 ${t.input}`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${t.button} font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className={`flex-1 border-t ${t.divider} transition-colors duration-300`} />
            <span
              className={`px-4 text-xs ${t.dividerText} transition-colors duration-300`}
            >
              or
            </span>
            <div className={`flex-1 border-t ${t.divider} transition-colors duration-300`} />
          </div>

          {/* Signup */}
          <p
            className={`text-center ${t.linkText} text-sm transition-colors duration-300`}
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              className={`${t.link} transition-colors font-medium`}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
