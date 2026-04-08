
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-panel border-primary/20 text-center overflow-hidden">
          <div className="bg-primary/10 py-8 flex justify-center border-b border-primary/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-24 w-24 text-primary" />
            </motion.div>
          </div>
          <CardContent className="pt-8 pb-8 space-y-6">
            <div>
              <h1 className="font-bebas text-4xl tracking-wider text-primary mb-2">Ordine Confermato!</h1>
              <p className="text-muted-foreground">
                Grazie per il tuo acquisto. Abbiamo ricevuto il tuo ordine e lo stiamo elaborando.
              </p>
            </div>

            <div className="bg-background/50 rounded-lg p-4 border border-white/5 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Stato Ordine</span>
                <span className="text-primary font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Pagato
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ricevuta</span>
                <span className="text-foreground">Inviata via email</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Verrai reindirizzato alla home tra 5 secondi...
            </p>

            <div className="pt-4 flex flex-col gap-3">
              <Link to="/">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors h-12 text-lg font-medium">
                  Torna alla Home <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 h-12">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Continua lo Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
