import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { ConsultingProvider } from "./contexts/ConsultingContext";
import { RequireAuth } from "./components/RequireAuth";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" storageKey="berry-theme">
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/" element={
              <RequireAuth><HomePage /></RequireAuth>
            } />
            <Route path="/admin" element={
              <RequireAuth><Admin /></RequireAuth>
            } />
            <Route path="/projetos" element={
              <RequireAuth>
                <ConsultingProvider><Index projectType="real" /></ConsultingProvider>
              </RequireAuth>
            } />
            <Route path="/simulacao" element={
              <RequireAuth>
                <ConsultingProvider><Index projectType="simulation" /></ConsultingProvider>
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
