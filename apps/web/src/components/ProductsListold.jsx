
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, formatCurrency } from '@/api/EcommerceApi';
import pb from '@/lib/pocketbaseClient';
import { useCart } from '@/hooks/useCart.jsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. Fetch from external Ecommerce API
        let apiProducts = [];
        try {
          const apiData = await getProducts();
          console.log("Ecommerce API Response:", apiData);
          
          // Map API products to a common format
          apiProducts = (apiData.products || []).map(p => ({
            id: p.id,
            name: p.title,
            price_in_cents: p.price_in_cents,
            image: p.image || (p.images && p.images.length > 0 ? p.images[0].url : null),
            source: 'api',
            original: p
          }));
        } catch (apiError) {
          console.error("Error fetching Ecommerce API products:", apiError);
        }

        // 2. Fetch from PocketBase database
        let pbProducts = [];
        try {
          const pbData = await pb.collection('products').getFullList({ 
            filter: 'active = true',
            $autoCancel: false 
          });
          console.log("PocketBase Products Response:", pbData);
          
          // Map PocketBase products to the same common format
          pbProducts = pbData.map(p => ({
            id: p.id,
            name: p.name,
            price_in_cents: p.price * 100, // Convert euros to cents for formatCurrency
            image: p.image_url,
            source: 'pb',
            original: p
          }));
        } catch (pbError) {
          console.error("Error fetching PocketBase products:", pbError);
        }

        // 3. Combine both sources
        const combinedProducts = [...pbProducts, ...apiProducts];
        console.log("Combined Products List:", combinedProducts);
        setProducts(combinedProducts);

      } catch (error) {
        console.error("Error in fetchProducts orchestration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Pass a default available quantity of 999 for now
    addToCart(product, null, 1, 999);
    toast({
      title: "Aggiunto al carrello",
      description: `${product.name} è stato aggiunto al tuo carrello.`,
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
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Nessuna immagine
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-1">
              <h3 className="font-bebas text-xl mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-primary font-bold text-lg">
                {formatCurrency(product.price_in_cents)}
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
      
      {products.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          Nessun prodotto disponibile al momento.
        </div>
      )}
    </div>
  );
}
