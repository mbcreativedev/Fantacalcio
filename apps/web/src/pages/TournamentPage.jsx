import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import pocketbaseClient from '@/lib/pocketbaseClient';

export default function TournamentPage() {
  const navigate = useNavigate();
  const [tornei, setTornei] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTornei = async () => {
      try {
        setLoading(true);
        const records = await pocketbaseClient.collection('tornei').getFullList({
          sort: 'data_inizio',
        });
        setTornei(records);
      } catch (err) {
        setError('Impossibile caricare i tornei. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    fetchTornei();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-bebas text-5xl tracking-wide mb-2">
              Tornei <span className="text-primary">Disponibili</span>
            </h1>
            <p className="text-muted-foreground">Scegli il torneo adatto a te e inizia a giocare.</p>
          </div>
        </div>

        {tornei.length === 0 ? (
          <div className="text-center text-muted-foreground py-24">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary/30" />
            <p className="text-xl font-medium">Nessun torneo disponibile al momento.</p>
            <p className="text-sm mt-2">Torna a controllare presto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tornei.map((torneo, index) => (
              <motion.div
                key={torneo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-card border-white/10 hover:border-primary/50 transition-colors duration-300 flex flex-col h-full">
                  <CardHeader className="pb-4 border-b border-white/5">
                    {/* Immagine torneo */}
                    {torneo.immagine && (
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                        <img
                          src={torneo.immagine}
                          alt={torneo.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="font-bebas text-3xl">
                      {torneo.nome}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 flex-1 space-y-3">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Trophy className="h-5 w-5 text-secondary" />
                        <span className="font-medium">Montepremi</span>
                      </div>
                      <span className="font-bebas text-3xl text-secondary">{torneo.premio}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-sm">Quota Iscrizione</span>
                      </div>
                      <span className="font-medium text-foreground">€{torneo.quota_iscrizione}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">Posti Disponibili</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {torneo.posti_disponibili} / {torneo.posti_totali}
                      </span>
                    </div>

                    {torneo.data_inizio && (
                      <div className="text-xs text-muted-foreground pt-1">
                        Inizio: {new Date(torneo.data_inizio).toLocaleDateString('it-IT', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-white/5">
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-12 transition-all active:scale-[0.98]"
                      onClick={() => navigate(`/tournament/${torneo.id}`)}
                      disabled={torneo.posti_disponibili === 0}
                    >
                      {torneo.posti_disponibili === 0 ? 'Torneo Pieno' : 'Scopri di più'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}