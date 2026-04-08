import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Clock, BookOpen, Gift, ShieldCheck, ShoppingCart, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/hooks/use-toast';
import pocketbaseClient from '@/lib/pocketbaseClient';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        setLoading(true);
        const record = await pocketbaseClient.collection('tornei').getOne(id);
        setTorneo(record);
      } catch (err) {
        setError('Torneo non trovato.');
      } finally {
        setLoading(false);
      }
    };
    fetchTorneo();
  }, [id]);

  const handleAddToCart = () => {
    if (!torneo) return;

    const product = {
      id: torneo.id,
      title: torneo.nome,
      name: torneo.nome,
      image: torneo.immagine || 'https://via.placeholder.com/400x300?text=Torneo',
    };

    const priceInCents = Math.round(torneo.quota_iscrizione * 100);

    const variant = {
      id: `torneo-${torneo.id}`,
      title: 'Iscrizione Torneo',
      price_in_cents: priceInCents,
      price_formatted: `€${torneo.quota_iscrizione.toFixed(2)}`,
      currency_info: {
        symbol: '€',
        code: 'EUR',
      },
      manage_inventory: false,
    };

    addToCart(product, variant, 1, 999);

    toast({
      title: 'Aggiunto al carrello',
      description: `L'iscrizione a ${torneo.nome} è stata aggiunta al tuo carrello.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !torneo) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p>{error || 'Torneo non trovato.'}</p>
        <Button variant="ghost" onClick={() => navigate('/tornei')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna ai Tornei
        </Button>
      </div>
    );
  }

  const details = [
    { icon: <Trophy className="h-5 w-5 text-primary" />, label: 'Tipo di torneo', value: torneo.nome },
    { icon: <Users className="h-5 w-5 text-primary" />, label: 'Posti totali', value: `Max ${torneo.posti_totali}` },
    { icon: <Users className="h-5 w-5 text-primary" />, label: 'Posti disponibili', value: torneo.posti_disponibili },
    { icon: <Clock className="h-5 w-5 text-primary" />, label: 'Data inizio', value: new Date(torneo.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) },
    { icon: <Gift className="h-5 w-5 text-primary" />, label: 'Montepremi', value: torneo.premio },
    { icon: <CreditCard className="h-5 w-5 text-primary" />, label: 'Quota iscrizione', value: `€${torneo.quota_iscrizione}` },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={torneo.immagine || 'https://via.placeholder.com/1200x600?text=Torneo'}
            alt={torneo.nome}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="w-fit mb-6 text-muted-foreground hover:text-primary hover:bg-white/5 -ml-4"
            onClick={() => navigate('/tornei')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Torna ai Tornei
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-bebas text-6xl md:text-8xl tracking-wide text-foreground mb-4">
              {torneo.nome.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} className="text-primary"> {word}</span>
                  : <span key={i}>{word} </span>
              )}
            </h1>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-secondary/10 border border-secondary/20 backdrop-blur-md">
              <span className="text-lg font-medium text-muted-foreground uppercase tracking-wider">Montepremi dal valore di</span>
              <span className="font-bebas text-4xl text-secondary">{torneo.premio}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start justify-between">

          {/* Action Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-[400px] shrink-0 lg:order-2"
          >
            <Card className="bg-card border-primary/20 shadow-2xl shadow-primary/5">
              <CardContent className="p-6 space-y-6">
                <div className="text-center pb-6 border-b border-white/10">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Quota di Iscrizione</p>
                  <p className="font-bebas text-5xl text-foreground">€{torneo.quota_iscrizione}</p>
                </div>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Pagamento sicuro
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" /> Montepremi garantito: {torneo.premio}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {torneo.posti_disponibili} posti ancora disponibili
                  </li>
                </ul>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  onClick={handleAddToCart}
                  disabled={torneo.posti_disponibili === 0}
                >
                  {torneo.posti_disponibili === 0
                    ? 'Torneo Pieno'
                    : <><ShoppingCart className="mr-2 h-5 w-5" /> Aggiungi al Carrello</>
                  }
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <div className="flex-1 lg:order-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-bebas text-3xl mb-6 text-foreground">Caratteristiche del Torneo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.map((detail, index) => (
                  <Card key={index} className="bg-card/50 border-white/5 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-white/5">{detail.icon}</div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
                        <p className="font-medium text-foreground">{detail.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Regolamento */}
            {torneo.regolamento && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-bebas text-2xl text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Regolamento
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {torneo.regolamento}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}