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
        <Routes>
          {/* Original routes */}
          <Route path="/" element={
            <ConsultingProvider><HomePage /></ConsultingProvider>
          } />
          <Route path="/projetos" element={
            <ConsultingProvider><Index projectType="real" /></ConsultingProvider>
          } />
          <Route path="/simulacao" element={
            <ConsultingProvider><Index projectType="simulation" /></ConsultingProvider>
          } />

          {/* V2 isolated copy */}
          <Route path="/versaorecomendacao" element={
            <ConsultingProviderV2><HomePageV2 /></ConsultingProviderV2>
          } />
          <Route path="/versaorecomendacao/projetos" element={
            <ConsultingProviderV2><IndexV2 projectType="real" /></ConsultingProviderV2>
          } />
          <Route path="/versaorecomendacao/simulacao" element={
            <ConsultingProviderV2><IndexV2 projectType="simulation" /></ConsultingProviderV2>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
