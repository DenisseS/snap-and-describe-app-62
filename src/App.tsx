
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAProvider } from "@/contexts/PWAContext";
import Home from "./pages/Home";
import ExplorePage from "./pages/ExplorePage";
import FavoritesPage from "./pages/FavoritesPage";
import RecipesPage from "./pages/RecipesPage";
import CameraPage from "./pages/CameraPage";
import ProductDetail from "./pages/ProductDetail";
import AuthCallback from "./pages/AuthCallback";
import ShoppingListsPage from "./pages/ShoppingListsPage";
import ShoppingListDetailPage from "./pages/ShoppingListDetailPage";
import LegalPage from "./pages/LegalPage";
import SupportPage from "./pages/SupportPage";
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ShareAcceptPage from "./pages/ShareAcceptPage";
import CookieConsent from './components/CookieConsent';
import NotFound from "./pages/NotFound";
import { UserDataProvider } from "@/contexts/UserDataContext";

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <UserDataProvider>
            <NavigationProvider>
              <PWAProvider>
              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/camera" element={<CameraPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/product/:productSlug" element={<ProductDetail />} />
                <Route path="/shopping-lists" element={<ShoppingListsPage />} />
                <Route path="/shopping-lists/:listId" element={<ShoppingListDetailPage />} />
                <Route path="/share/accept" element={<ShareAcceptPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/legal/:slug" element={<LegalPage />} />
                {/* Developer page removed as requested */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
              </PWAProvider>
            </NavigationProvider>
          </UserDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
