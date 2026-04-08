import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart as CartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils.js';
import ShoppingCart from '@/components/ShoppingCart.jsx';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tornei', path: '/tornei' },
    { name: 'Classifiche', path: '/classifiche' },
    { name: 'Negozio', path: '/shop' },
  ];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="https://horizons-cdn.hostinger.com/0000523f-1fb8-4ea0-beed-e540c65722fa/9ef29f2d32272f1bb5d1f6c6f30e1141.png" 
                alt="FantaLega Logo" 
                className="h-10 md:h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Apri carrello"
              >
                <CartIcon size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-white/10 mx-2" />

              {isAuthenticated ? (
                <>
                  <Link to="/profilo">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                      Profilo
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="border-white/10 hover:bg-white/5 hover:text-primary">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                      Accedi
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Registrati
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <CartIcon size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-card"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium p-2 rounded-md transition-colors",
                      location.pathname === link.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profilo"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium p-2 text-muted-foreground hover:text-primary"
                    >
                      Profilo
                    </Link>
                    <Button variant="destructive" onClick={handleLogout} className="w-full mt-2">
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white/10 hover:text-primary">Accedi</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground">Registrati</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
}