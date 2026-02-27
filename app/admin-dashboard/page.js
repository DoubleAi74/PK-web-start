"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllUsers, deleteUser, updateUserTargetDays } from "@/actions/adminActions";
import {
  Sun,
  Moon,
  Shield,
  Users,
  Trash2,
  LogOut,
  Calendar,
  Target,
  Mail,
  Clock,
  MessageSquare,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editedDeadlines, setEditedDeadlines] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUsers();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUsers = async () => {
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.users);
      const deadlines = {};
      result.users.forEach((u) => {
        deadlines[u.id] = {
          message: u.deadlineMessage || "",
          days: u.targetDays || "",
        };
      });
      setEditedDeadlines(deadlines);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}?`)) {
      return;
    }

    setDeletingId(userId);
    const result = await deleteUser(userId);

    if (result.success) {
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      alert(result.error || "Failed to delete user");
    }
    setDeletingId(null);
  };

  const handleDeadlineChange = (userId, field, value) => {
    setEditedDeadlines((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleSaveDeadline = async (userId) => {
    setSavingId(userId);
    const deadline = editedDeadlines[userId];
    const days = parseInt(deadline.days, 10);

    if (!days || days < 1) {
      alert("Please enter a valid number of days (at least 1)");
      setSavingId(null);
      return;
    }

    console.log("Saving target days:", { userId, message: deadline.message, days });

    const result = await updateUserTargetDays(
      userId,
      days,
      deadline.message
    );

    console.log("updateUserTargetDays result:", result);

    if (result.success) {
      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
                ...u,
                targetDays: days,
                deadlineMessage: deadline.message,
              }
            : u
        )
      );
    } else {
      alert(result.error || "Failed to save target days");
    }
    setSavingId(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleExpanded = (userId) => {
    setExpandedId(expandedId === userId ? null : userId);
  };

  const LoadingSpinner = ({ size = "h-6 w-6" }) => (
    <svg className={`animate-spin ${size}`} viewBox="0 0 24 24">
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

  const theme = {
    light: {
      bg: "bg-stone-100",
      header: "border-stone-300 bg-white",
      title: "text-stone-800",
      subtitle: "text-stone-500",
      card: "bg-white/80 backdrop-blur-sm border-stone-300",
      innerCard: "bg-stone-50 border-stone-200",
      cardLabel: "text-stone-500",
      cardValue: "text-stone-800",
      cardValueAccent: "text-teal-600",
      cardValueMono: "text-stone-600",
      signOut: "text-stone-500 hover:text-stone-700",
      toggleBtn: "bg-stone-200 text-stone-600 hover:bg-stone-300",
      userCard: "bg-white border-stone-200 hover:border-stone-300",
      userCardExpanded: "bg-white border-teal-300",
      tableText: "text-stone-700",
      tableTextMuted: "text-stone-500",
      deleteBtn: "text-red-500 hover:text-red-700 hover:bg-red-50",
      saveBtn: "bg-teal-600 hover:bg-teal-700 text-white",
      input: "bg-white border-stone-300 text-stone-800 focus:border-teal-500 focus:ring-teal-500",
      expandBtn: "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
    },
    dark: {
      bg: "bg-stone-900",
      header: "border-stone-700 bg-stone-800",
      title: "text-stone-100",
      subtitle: "text-stone-400",
      card: "bg-stone-800/50 backdrop-blur-sm border-stone-700",
      innerCard: "bg-stone-900 border-stone-800",
      cardLabel: "text-stone-500",
      cardValue: "text-stone-300",
      cardValueAccent: "text-teal-500",
      cardValueMono: "text-stone-400",
      signOut: "text-stone-400 hover:text-stone-200",
      toggleBtn: "bg-stone-700 text-stone-300 hover:bg-stone-600",
      userCard: "bg-stone-800/50 border-stone-700 hover:border-stone-600",
      userCardExpanded: "bg-stone-800/50 border-teal-600",
      tableText: "text-stone-300",
      tableTextMuted: "text-stone-500",
      deleteBtn: "text-red-400 hover:text-red-300 hover:bg-red-900/30",
      saveBtn: "bg-teal-600 hover:bg-teal-500 text-white",
      input: "bg-stone-900 border-stone-700 text-stone-200 focus:border-teal-500 focus:ring-teal-500",
      expandBtn: "text-stone-400 hover:text-stone-200 hover:bg-stone-700",
    },
  };

  const t = darkMode ? theme.dark : theme.light;

  if (loading) {
    return (
      <div
        className={`min-h-screen ${t.bg} flex items-center justify-center transition-colors duration-300`}
      >
        <div className={`flex items-center gap-3 ${t.subtitle}`}>
          <LoadingSpinner />
          <span className="text-sm font-mono uppercase tracking-wider">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Header */}
      <header
        className={`border-b ${t.header} transition-colors duration-300`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-light ${t.title} transition-colors duration-300`}
              >
                Admin Dashboard
              </h1>
              <p
                className={`text-xs ${t.subtitle} font-mono uppercase tracking-wider transition-colors duration-300`}
              >
                User Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 text-sm ${t.signOut} transition-colors duration-300`}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Card */}
        <div
          className={`${t.card} border rounded-2xl p-8 mb-8 transition-colors duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600/10 rounded-xl">
              <Users className="h-8 w-8 text-teal-500" />
            </div>
            <div>
              <p
                className={`text-xs font-medium ${t.cardLabel} uppercase tracking-wider transition-colors duration-300`}
              >
                Total Users
              </p>
              <p
                className={`text-4xl font-light ${t.cardValueAccent} transition-colors duration-300`}
              >
                {users.length}
              </p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((userItem) => (
            <div
              key={userItem.id}
              className={`${
                expandedId === userItem.id ? t.userCardExpanded : t.userCard
              } border rounded-xl transition-all duration-300`}
            >
              {/* User Header Row */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-teal-600/10 rounded-lg">
                      <Mail className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className={`${t.tableText} truncate`}>
                      {userItem.email}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="p-2 bg-teal-600/10 rounded-lg">
                      <Target className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className={`${t.cardValueAccent} font-medium`}>
                      {userItem.targetDays} days
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="p-2 bg-teal-600/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className={`${t.tableTextMuted} text-sm`}>
                      {new Date(userItem.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpanded(userItem.id)}
                    className={`p-2 rounded-lg ${t.expandBtn} transition-colors duration-300`}
                    aria-label={
                      expandedId === userItem.id
                        ? "Collapse deadline settings"
                        : "Expand deadline settings"
                    }
                  >
                    {expandedId === userItem.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteUser(userItem.id, userItem.email)
                    }
                    disabled={deletingId === userItem.id}
                    className={`p-2 rounded-lg ${t.deleteBtn} transition-colors duration-300 disabled:opacity-50`}
                    aria-label={`Delete ${userItem.email}`}
                  >
                    {deletingId === userItem.id ? (
                      <LoadingSpinner size="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Deadline Section */}
              {expandedId === userItem.id && (
                <div
                  className={`px-6 pb-6 pt-2 border-t ${
                    darkMode ? "border-stone-700" : "border-stone-200"
                  }`}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Deadline Message */}
                    <div>
                      <label
                        className={`flex items-center gap-2 text-xs font-medium ${t.cardLabel} uppercase tracking-wider mb-2`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Countdown Message
                      </label>
                      <input
                        type="text"
                        value={editedDeadlines[userItem.id]?.message || ""}
                        onChange={(e) =>
                          handleDeadlineChange(userItem.id, "message", e.target.value)
                        }
                        placeholder="e.g., Time until your next session"
                        className={`w-full px-4 py-3 rounded-lg border ${t.input} transition-colors duration-300 focus:outline-none focus:ring-2`}
                      />
                    </div>

                    {/* Target Days */}
                    <div>
                      <label
                        className={`flex items-center gap-2 text-xs font-medium ${t.cardLabel} uppercase tracking-wider mb-2`}
                      >
                        <Clock className="h-4 w-4" />
                        Target Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editedDeadlines[userItem.id]?.days || ""}
                        onChange={(e) =>
                          handleDeadlineChange(userItem.id, "days", e.target.value)
                        }
                        placeholder="e.g., 30"
                        className={`w-full px-4 py-3 rounded-lg border ${t.input} transition-colors duration-300 focus:outline-none focus:ring-2`}
                      />
                    </div>
                  </div>

                  {/* Current countdown preview */}
                  {userItem.targetDays && userItem.targetDaysSetAt && (
                    <div
                      className={`mt-4 p-3 rounded-lg ${t.innerCard} border`}
                    >
                      <p className={`text-xs ${t.cardLabel} uppercase tracking-wider mb-1`}>
                        Current Countdown
                      </p>
                      <p className={`${t.tableText} text-sm`}>
                        {userItem.deadlineMessage || "No message set"} —{" "}
                        {(() => {
                          const now = new Date().getTime();
                          const setAt = new Date(userItem.targetDaysSetAt).getTime();
                          const deadline = setAt + (userItem.targetDays * 24 * 60 * 60 * 1000);
                          const diff = deadline - now;
                          const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
                          if (daysLeft <= 0) return "Expired";
                          return `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`;
                        })()}
                      </p>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveDeadline(userItem.id)}
                      disabled={savingId === userItem.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${t.saveBtn} transition-colors duration-300 disabled:opacity-50`}
                    >
                      {savingId === userItem.id ? (
                        <LoadingSpinner size="h-4 w-4" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Deadline
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {users.length === 0 && (
            <div
              className={`${t.card} border rounded-2xl p-12 text-center transition-colors duration-300`}
            >
              <p className={t.tableTextMuted}>No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
