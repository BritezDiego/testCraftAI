import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializePaddle } from "./lib/paddle";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import History from "./pages/History";
import GenerationDetail from "./pages/GenerationDetail";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import SharedGeneration from "./pages/SharedGeneration";
import Templates from "./pages/Templates";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";

export default function App() {
  useEffect(() => { initializePaddle(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/share/:slug" element={<SharedGeneration />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />

        {/* Routes with shared layout (navbar) */}
        <Route element={<Layout />}>
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/generation/:id" element={<ProtectedRoute><GenerationDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
