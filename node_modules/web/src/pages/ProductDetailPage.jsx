import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, Plus, Minus, ShieldCheck, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const formatPrice = (priceInCents) => {
  if (!priceInCents && priceInCents !== 0) return '';
  return `€${(priceInCents / 100).toFixed(2)}`;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const record = await pb.collection('products').getOne(id, { $autoCancel: false });
        setProduct(record);
      } catch (err) {
        setError('Prodotto non trovato.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const priceInCents = Math.round((product.price || 0) * 100);

    const variant = {
      id: `pb-${product.id}`,
      title: product.name,
      price_in_cents: priceInCents,
      price_formatted: formatPrice(priceInCents),
      manage_inventory: false,
      currency_info: { symbol: '€', code: 'EUR' },
    };

    const productForCart = {
      id: product.id,
      name: product.name,
      title: product.name,
      image: product.image_url || null,
      price_in_cents: priceInCents,
    };

    addToCart(productForCart, variant, quantity, 999).then(() => {
      toast({
        title: 'Aggiunto al Carrello! 🛒',
        description: `${quantity} x ${product.name} aggiunto al carrello.`,
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>{error || 'Prodotto non trovato.'}</p>
        <Button variant="ghost" onClick={() => navigate('/shop')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Negozio
        </Button>
      </div>
    );
  }

  const priceInCents = Math.round((product.price || 0) * 100);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-primary -ml-4"
          onClick={() => navigate('/shop')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Negozio
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Immagine */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Nessuna immagine
                </div>
              )}
            </div>
          </motion.div>

          {/* Dettagli */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            {product.category && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium uppercase tracking-widest">{product.category}</span>
              </div>
            )}

            <h1 className="font-bebas text-5xl tracking-wide mb-4">{product.name}</h1>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            )}

            <Card className="bg-card border-primary/20 mb-6">
              <CardContent className="p-6">
                <div className="text-center pb-6 border-b border-white/10 mb-6">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Prezzo</p>
                  <p className="font-bebas text-5xl text-foreground">{formatPrice(priceInCents)}</p>
                </div>

                {/* Quantità */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-muted-foreground font-medium">Quantità</span>
                  <div className="flex items-center border border-white/10 rounded-lg bg-background">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-bold text-foreground min-w-[40px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Pagamento sicuro
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Spedizione tracciata
                  </li>
                </ul>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 shadow-lg shadow-primary/20"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Aggiungi al Carrello
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
