import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LegalHelp from "./pages/LegalHelp";
import Constitution from "./pages/Constitution";
import ConstitutionalArticles from "./pages/ConstitutionalArticles";
import ArticleDetail from "./pages/ArticleDetail";
import WhatHappensIf from "./pages/WhatHappensIf";
import HowGovernmentWorks from "./pages/HowGovernmentWorks";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DocumentSummarizer from "./pages/DocumentSummarizer";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/legal-help" element={<LegalHelp />} />
            <Route path="/constitution" element={<Constitution />} />
            <Route path="/constitution/articles" element={<ConstitutionalArticles />} />
            <Route path="/constitution/article-detail" element={<ArticleDetail />} />
            <Route path="/constitution/what-happens-if" element={<WhatHappensIf />} />
            <Route path="/constitution/how-government-works" element={<HowGovernmentWorks />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/document-summarizer" element={<DocumentSummarizer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
