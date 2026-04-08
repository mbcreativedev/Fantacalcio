import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import TournamentPage from '@/pages/TournamentPage.jsx';
import TournamentDetailPage from '@/pages/TournamentDetailPage.jsx';
import ClassifichePage from '@/pages/ClassifichePage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import PublicProfilePage from '@/pages/PublicProfilePage.jsx';
import ShopPage from '@/pages/ShopPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage.jsx';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/tornei" element={<TournamentPage />} />
                <Route path="/tournament/:id" element={<TournamentDetailPage />} />
                <Route path="/classifiche" element={<ClassifichePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
                <Route path="/giocatore/:id" element={<PublicProfilePage />} />
                <Route
                  path="/profilo"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <h1 className="font-bebas text-6xl text-primary mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">Pagina non trovata</p>
                    <a href="/" className="text-primary hover:underline">Torna alla Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
