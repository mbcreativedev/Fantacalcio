import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Aggiunto al Carrello! 🛒",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) aggiunto.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);

    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);

      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await getProduct(id);

        try {
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: [fetchedProduct.id]
          });

          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });

          const productWithQuantities = {
            ...fetchedProduct,
            variants: fetchedProduct.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          };

          setProduct(productWithQuantities);

          if (productWithQuantities.variants && productWithQuantities.variants.length > 0) {
            setSelectedVariant(productWithQuantities.variants[0]);
          }
        } catch (quantityError) {
          throw quantityError;
        }
      } catch (err) {
        setError(err.message || 'Impossibile caricare il prodotto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} />
          Torna al Negozio
        </Link>
        <div className="text-center text-destructive bg-destructive/10 p-8 rounded-2xl border border-destructive/20">
          <XCircle className="mx-auto h-16 w-16 mb-4 opacity-80" />
          <p className="mb-6 text-lg">Errore nel caricamento del prodotto: {error}</p>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>{`${product.title} - FantaLega Shop`}</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft size={16} />
          Torna al Negozio
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 bg-card p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-96 md:h-[500px] bg-background/50 border border-white/5">
              <img
                src={!currentImage?.url ? placeholderImage : currentImage.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-primary hover:text-primary-foreground text-foreground p-3 rounded-full transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Immagine precedente"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-primary hover:text-primary-foreground text-foreground p-3 rounded-full transition-all backdrop-blur-sm border border-white/10"
                    aria-label="Immagine successiva"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-sm font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">
                  {product.ribbon_text}
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex justify-center gap-3 mt-6">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary scale-125' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Vai all'immagine ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {hasMultipleImages && (
              <div className="hidden md:flex gap-3 mt-6 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={!image.url ? placeholderImage : image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
            <h1 className="font-bebas text-5xl tracking-wide text-foreground mb-2">{product.title}</h1>
            {product.subtitle && <p className="text-xl text-muted-foreground mb-6">{product.subtitle}</p>}

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="font-bebas text-5xl text-secondary">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-2xl text-muted-foreground line-through">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:font-bebas prose-headings:tracking-wide max-w-none mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.additional_info?.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.additional_info
                  .sort((a, b) => a.order - b.order)
                  .map((info) => (
                    <div key={info.id} className="border-l-4 border-primary/50 pl-5 bg-background/30 py-3 pr-4 rounded-r-lg">
                      <h3 className="font-bebas text-2xl text-foreground mb-2">{info.title}</h3>
                      <div className="prose prose-invert prose-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: info.description }} />
                    </div>
                  ))}
              </div>
            )}

            {product.variants.length > 1 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Variante</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(variant => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => handleVariantSelect(variant)}
                      className={`transition-all h-12 px-6 ${
                        selectedVariant?.id === variant.id 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'border-white/20 text-foreground hover:bg-white/10 hover:border-white/40'
                      }`}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <div className="flex items-center justify-between border border-white/20 rounded-lg p-1 bg-background/50 w-full sm:w-auto">
                  <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/10 hover:text-primary"><Minus size={18} /></Button>
                  <span className="w-12 text-center text-foreground font-bold text-lg">{quantity}</span>
                  <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/10 hover:text-primary"><Plus size={18} /></Button>
                </div>
                
                <Button 
                  onClick={handleAddToCart} 
                  size="lg" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={!canAddToCart || !product.purchasable}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Aggiungi al Carrello
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Pagamento sicuro. Spedizione rapida.</span>
              </div>

              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm text-primary mt-4 flex items-center justify-center sm:justify-start gap-2 font-medium">
                  <CheckCircle size={16} /> {availableStock} disponibili in magazzino
                </p>
              )}

              {isStockManaged && !canAddToCart && product.purchasable && (
                 <p className="text-sm text-secondary mt-4 flex items-center justify-center sm:justify-start gap-2 font-medium">
                  <XCircle size={16} /> Quantità non sufficiente. Solo {availableStock} rimasti.
                </p>
              )}

              {!product.purchasable && (
                  <p className="text-sm text-destructive mt-4 flex items-center justify-center sm:justify-start gap-2 font-medium">
                    <XCircle size={16} /> Attualmente non disponibile
                  </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;