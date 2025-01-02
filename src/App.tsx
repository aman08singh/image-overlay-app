import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Credits from "@/pages/Credits";
import SignIn from "@/pages/SignIn";

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/auth/signin" element={<SignIn />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;