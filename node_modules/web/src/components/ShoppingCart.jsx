
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Il carrello è vuoto',
        description: 'Aggiungi dei prodotti prima di procedere al checkout.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/checkout-success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

      clearCart();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Errore di Checkout',
        description: 'Si è verificato un problema. Riprova più tardi.',
        variant: 'destructive',
      });
    }
  }, [cartItems, clearCart, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-white/10 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-background/50">
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="h-6 w-6 text-primary" />
                <h2 className="font-bebas text-3xl tracking-wide text-foreground mt-1">Il tuo Carrello</h2>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full">
                <X size={24} />
              </Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center opacity-60">
                  <ShoppingCartIcon size={64} className="mb-6 text-primary/50" />
                  <p className="text-lg font-medium">Il tuo carrello è vuoto.</p>
                  <p className="text-sm mt-2">Scopri i nostri prodotti nel negozio.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 bg-background/50 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-card flex-shrink-0 border border-white/5">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-foreground truncate">{item.product.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{item.variant.title}</p>
                      <p className="text-sm text-secondary font-bold mt-1">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Button onClick={() => removeFromCart(item.variant.id)} size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                        <Trash2 size={16} />
                      </Button>
                      <div className="flex items-center border border-white/10 rounded-lg bg-background">
                        <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors">-</button>
                        <span className="px-2 text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="px-2 py-1 text-muted-foreground hover:text-primary transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-background/50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-muted-foreground font-medium">Totale</span>
                  <span className="font-bebas text-4xl text-secondary">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-lg rounded-xl shadow-lg shadow-primary/20">
                  Procedi al Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
