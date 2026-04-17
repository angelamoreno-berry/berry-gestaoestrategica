import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConsultingProvider } from "./contexts/ConsultingContext";
import { ConsultingProviderV2 } from "./contexts-v2/ConsultingContextV2";
import Index from "./pages/Index";
import IndexV2 from "./pages/IndexV2";
import HomePage from "./pages/HomePage";
import HomePageV2 from "./pages/HomePageV2";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ConsultingProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projetos" element={<Index projectType="real" />} />
            <Route path="/simulacao" element={<Index projectType="simulation" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ConsultingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
