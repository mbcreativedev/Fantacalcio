import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.jsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatPrice = (priceInCents) => {
  if (!priceInCents && priceInCents !== 0) return '';
  return `€${(priceInCents / 100).toFixed(2)}`;
};

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Carica prodotti da PocketBase
        const pbData = await pb.collection('products').getFullList({
          filter: 'active = true',
          $autoCancel: false,
        });

        const mapped = pbData.map(p => ({
          id: p.id,
          name: p.name,
          price_in_cents: Math.round((p.price || 0) * 100),
          image: p.image_url || null,
          description: p.description || '',
          category: p.category || '',
          source: 'pb',
          original: p,
        }));

        setProducts(mapped);
      } catch (error) {
        console.error('Errore nel caricamento prodotti:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = {
      id: `pb-${product.id}`,
      title: product.name,
      price_in_cents: product.price_in_cents,
      price_formatted: formatPrice(product.price_in_cents),
      manage_inventory: false,
      currency_info: { symbol: '€', code: 'EUR' },
    };

    addToCart(product, variant, 1, 999).then(() => {
      toast({
        title: 'Aggiunto al carrello',
        description: `${product.name} è stato aggiunto al tuo carrello.`,
      });
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-white/10 overflow-hidden">
            <Skeleton className="h-48 w-full bg-white/5" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 w-full bg-white/5" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-24 text-muted-foreground">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-primary/30" />
        <p className="text-xl font-medium">Nessun prodotto disponibile al momento.</p>
        <p className="text-sm mt-2">Torna a controllare presto!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`}>
          <Card className="bg-card border-white/10 hover:border-primary/50 transition-colors duration-300 h-full flex flex-col overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-white/5">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Nessuna immagine
                </div>
              )}
              {product.category && (
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-bold">
                  {product.category}
                </span>
              )}
            </div>
            <CardContent className="p-4 flex-1">
              <h3 className="font-bebas text-xl mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              {product.description && (
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{product.description}</p>
              )}
              <p className="text-primary font-bold text-lg">
                {formatPrice(product.price_in_cents)}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => handleAddToCart(e, product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Aggiungi
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
