import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Trophy, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [classifiche, setClassifiche] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        // Carica utente
        const userRecord = await pb.collection('users').getOne(id, { $autoCancel: false });
        setUser(userRecord);

        // Carica iscrizioni con dati torneo
        try {
          const iscrizioniRes = await pb.collection('iscrizioni').getList(1, 50, {
            filter: `user_id="${id}" && stato="attivo"`,
            expand: 'torneo_id',
            sort: '-created',
            $autoCancel: false,
          });
          setEnrollments(iscrizioniRes.items);
        } catch (e) {
          setEnrollments([]);
        }

        // Carica classifiche
        try {
          const classificheRes = await pb.collection('classifiche').getList(1, 50, {
            filter: `user_id="${id}"`,
            sort: '-punti',
            $autoCancel: false,
          });
          setClassifiche(classificheRes.items);
        } catch (e) {
          setClassifiche([]);
        }

      } catch (err) {
        setError('Profilo non trovato.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p>{error || 'Profilo non trovato.'}</p>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna indietro
        </Button>
      </div>
    );
  }

  const bestScore = classifiche.length > 0 ? Math.max(...classifiche.map(c => c.punti)) : null;
  const bestPosition = classifiche.length > 0 ? Math.min(...classifiche.map(c => c.posizione)) : null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-primary -ml-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna indietro
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header profilo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary flex-shrink-0">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-bebas text-4xl tracking-wide">
                {user.name || 'Giocatore'}
              </h1>
              <p className="text-primary font-medium text-lg mt-1">
                {user.squadra || 'Nessuna squadra'}
              </p>
              {isOwnProfile && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  Il tuo profilo
                </span>
              )}
            </div>
          </div>

          {/* Statistiche rapide */}
          {classifiche.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="rounded-xl bg-card border border-white/10 p-4 text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Tornei</p>
                <p className="font-bebas text-4xl text-primary">{enrollments.length}</p>
              </div>
              <div className="rounded-xl bg-card border border-white/10 p-4 text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Miglior punteggio</p>
                <p className="font-bebas text-4xl text-secondary">{bestScore ?? '-'}</p>
              </div>
              <div className="rounded-xl bg-card border border-white/10 p-4 text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Miglior posizione</p>
                <p className="font-bebas text-4xl text-yellow-400">{bestPosition ? `#${bestPosition}` : '-'}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tornei iscritto */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" /> Tornei
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">
                    Nessun torneo attivo.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((e) => {
                      const torneo = e.expand?.torneo_id;
                      return (
                        <div
                          key={e.id}
                          className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-white/5 hover:border-primary/20 transition-colors cursor-pointer"
                          onClick={() => navigate(`/tournament/${torneo?.id}`)}
                        >
                          <span className="font-medium text-foreground">{torneo?.nome || 'Torneo'}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {e.stato}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classifiche */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  🏆 Risultati
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classifiche.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">
                    Nessun risultato disponibile.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {classifiche.map((c) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-white/5"
                      >
                        <div>
                          <p className="font-medium text-foreground">{c.squadra}</p>
                          <p className="text-xs text-muted-foreground">Posizione #{c.posizione}</p>
                        </div>
                        <span className="font-bebas text-2xl text-secondary">{c.punti} PT</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
