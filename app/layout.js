import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Auth App",
  description: "Next.js application with Firebase Auth and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-950 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}



