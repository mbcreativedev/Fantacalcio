import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils.js';

const MEDAL_COLORS = {
  0: { bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-400', label: 'Campione', emoji: '🥇' },
  1: { bg: 'bg-gray-300', text: 'text-gray-800', border: 'border-gray-300', label: 'Vice-campione', emoji: '🥈' },
  2: { bg: 'bg-amber-600', text: 'text-amber-100', border: 'border-amber-600', label: 'Terzo posto', emoji: '🥉' },
};

const PODIUM_ORDER = [1, 0, 2];

function PodiumCard({ entry, rank, isCurrentUser, onNavigate }) {
  const medal = MEDAL_COLORS[rank];
  const heights = { 0: 'h-56', 1: 'h-48', 2: 'h-44' };
  const isGold = rank === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className={cn(
        'relative flex flex-col items-center justify-between rounded-2xl border-2 p-4 w-36 md:w-44',
        heights[rank],
        medal.border,
        isGold ? 'bg-gradient-to-b from-yellow-900/40 to-green-950/60 shadow-lg shadow-yellow-400/20' : 'bg-gradient-to-b from-white/5 to-green-950/60',
        isCurrentUser ? 'ring-2 ring-primary' : ''
      )}
    >
      <span className={cn('absolute -top-3 -left-2 text-xs font-bold px-2 py-0.5 rounded-full', medal.bg, medal.text)}>
        {rank + 1}°
      </span>
      <div className={cn('w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 mt-2', medal.border, 'bg-green-900/60')}>
        {medal.emoji}
      </div>
      <div className="text-center mt-2">
        <p
          className="font-bold text-white text-sm truncate max-w-[120px] cursor-pointer hover:text-primary transition-colors"
          onClick={() => onNavigate(entry.user_id)}
          title="Vedi profilo"
        >
          {entry.squadra}
        </p>
        <p className={cn('text-xs mt-0.5', isGold ? 'text-yellow-400' : 'text-gray-400')}>
          {medal.label}
        </p>
        {isCurrentUser && <p className="text-xs text-primary font-bold mt-1">Tu</p>}
      </div>
      <div className="w-full mt-3">
        <div className="text-xs text-gray-400 mb-1 px-1">Punteggio</div>
        <div className={cn('w-full text-center py-1.5 rounded-lg font-bold text-sm', medal.bg, medal.text)}>
          PT {entry.punti}
        </div>
      </div>
    </motion.div>
  );
}

export default function ClassifichePage() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [selectedTournamentName, setSelectedTournamentName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const goToProfile = (userId) => navigate(`/giocatore/${userId}`);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const records = await pb.collection('tornei').getFullList({ sort: '-created', $autoCancel: false });
        setTournaments(records);
        if (records.length > 0) {
          setSelectedTournamentId(records[0].id);
          setSelectedTournamentName(records[0].nome);
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, []);

  const fetchLeaderboard = async (tournamentId) => {
    if (!tournamentId) return;
    try {
      setIsLoading(true);
      const records = await pb.collection('classifiche').getList(1, 100, {
        filter: `torneo_id="${tournamentId}"`,
        sort: '-punti',
        $autoCancel: false,
      });
      setLeaderboard(records.items);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedTournamentId);
    const interval = setInterval(() => fetchLeaderboard(selectedTournamentId), 10000);
    return () => clearInterval(interval);
  }, [selectedTournamentId]);

  const handleTournamentChange = (id) => {
    setSelectedTournamentId(id);
    const t = tournaments.find(t => t.id === id);
    if (t) setSelectedTournamentName(t.nome);
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-bebas text-5xl tracking-wide mb-2">Classifiche <span className="text-primary">Live</span></h1>
            <p className="text-muted-foreground">Clicca una squadra per vedere il profilo del giocatore.</p>
          </div>
          <Select value={selectedTournamentId} onValueChange={handleTournamentChange}>
            <SelectTrigger className="w-full md:w-[250px] bg-card border-white/10 focus:ring-primary">
              <SelectValue placeholder="Seleziona Torneo" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-24">
            <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="font-bebas text-2xl mb-2">Nessun dato disponibile</h3>
            <p className="text-muted-foreground">La classifica per questo torneo non è ancora stata generata.</p>
          </div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="mb-10">
                <h2 className="font-bebas text-3xl text-center mb-8 tracking-wide">🏆 Podio Top 3</h2>
                <div className="flex items-end justify-center gap-4">
                  {PODIUM_ORDER.map((rank) => {
                    const entry = top3[rank];
                    if (!entry) return <div key={rank} className="w-36 md:w-44" />;
                    return (
                      <PodiumCard
                        key={entry.id}
                        entry={entry}
                        rank={rank}
                        isCurrentUser={currentUser && entry.user_id === currentUser.id}
                        onNavigate={goToProfile}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-green-950/60 to-green-900/30 overflow-hidden">
              <div className="p-6 border-b border-white/10 text-center">
                <h2 className="font-bebas text-3xl tracking-wide">🏆 Classifica Top 10</h2>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest">{selectedTournamentName}</p>
              </div>

              <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <div className="col-span-1"></div>
                <div className="col-span-7">Squadra</div>
                <div className="col-span-2 text-center">PT</div>
                <div className="col-span-2 text-center">Pos</div>
              </div>

              {top3.map((entry, index) => {
                const medal = MEDAL_COLORS[index];
                const isCurrentUser = currentUser && entry.user_id === currentUser.id;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn('grid grid-cols-12 items-center px-6 py-4 border-b border-white/5 transition-colors', isCurrentUser ? 'bg-primary/10' : 'hover:bg-white/5')}
                  >
                    <div className="col-span-1 text-lg">{medal.emoji}</div>
                    <div className="col-span-7">
                      <span
                        className={cn('font-bold cursor-pointer hover:text-primary transition-colors underline-offset-2 hover:underline', isCurrentUser ? 'text-primary' : 'text-white')}
                        onClick={() => goToProfile(entry.user_id)}
                      >
                        {entry.squadra}
                      </span>
                      {isCurrentUser && <span className="ml-2 text-xs text-primary font-bold">Tu</span>}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={cn('px-2 py-1 rounded-lg text-xs font-bold', medal.bg, medal.text)}>{entry.punti}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-primary/20 text-primary">{entry.posizione}</span>
                    </div>
                  </motion.div>
                );
              })}

              {rest.map((entry, index) => {
                const isCurrentUser = currentUser && entry.user_id === currentUser.id;
                const pos = index + 4;
                const isLast = pos === 10;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index + 3) * 0.05 }}
                    className={cn('grid grid-cols-12 items-center px-6 py-4 transition-colors', !isLast && 'border-b border-white/5', isCurrentUser ? 'bg-primary/10' : 'hover:bg-white/5', isLast && 'border-l-4 border-l-red-500')}
                  >
                    <div className="col-span-1 font-bebas text-xl text-muted-foreground">{pos}</div>
                    <div className="col-span-7">
                      <span
                        className={cn('font-medium cursor-pointer hover:text-primary transition-colors underline-offset-2 hover:underline', isCurrentUser ? 'text-primary' : 'text-white')}
                        onClick={() => goToProfile(entry.user_id)}
                      >
                        {entry.squadra}
                      </span>
                      {isCurrentUser && <span className="ml-2 text-xs text-primary font-bold">Tu</span>}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-white/10 text-white">{entry.punti}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-white/5 text-muted-foreground">{entry.posizione}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
