
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Trophy, Settings, LogOut, Edit2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', squadra: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setEditData({ name: currentUser.name || '', squadra: currentUser.squadra || '' });
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      // Fetch enrollments and expand tournament data
      const records = await pb.collection('iscrizioni').getList(1, 50, {
        filter: `user_id="${currentUser.id}"`,
        expand: 'torneo_id',
        sort: '-created',
        $autoCancel: false
      });
      setEnrollments(records.items);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('users').update(currentUser.id, editData, { $autoCancel: false });
      toast({ title: "Profilo aggiornato", description: "Le tue informazioni sono state salvate." });
      setIsEditing(false);
      // Force auth refresh to update context
      await pb.collection('users').authRefresh({ $autoCancel: false });
    } catch (error) {
      toast({ variant: "destructive", title: "Errore", description: "Impossibile aggiornare il profilo." });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-bebas text-5xl tracking-wide mb-8">Il Mio <span className="text-primary">Profilo</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / User Info */}
          <div className="space-y-6">
            <Card className="bg-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 border-2 border-primary">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="font-bebas text-2xl">{currentUser.name || 'Utente'}</h2>
                  <p className="text-primary font-medium">{currentUser.squadra || 'Nessuna squadra'}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Membro dal {new Date(currentUser.created).toLocaleDateString('it-IT')}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-primary">
                        <Edit2 className="mr-2 h-4 w-4" /> Modifica Profilo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10">
                      <DialogHeader>
                        <DialogTitle className="font-bebas text-2xl text-primary">Modifica Profilo</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input 
                            id="name" 
                            value={editData.name} 
                            onChange={e => setEditData({...editData, name: e.target.value})}
                            className="bg-background border-white/10 focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="squadra">Nome Squadra</Label>
                          <Input 
                            id="squadra" 
                            value={editData.squadra} 
                            onChange={e => setEditData({...editData, squadra: e.target.value})}
                            className="bg-background border-white/10 focus-visible:ring-primary"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Salva Modifiche
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button variant="destructive" className="w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Esci dall'account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content / Tournaments */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" /> I Miei Tornei
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full bg-white/5" />)}
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-12 bg-background/50 rounded-lg border border-white/5">
                    <p className="text-muted-foreground mb-4">Non sei iscritto a nessun torneo.</p>
                    <Button onClick={() => window.location.href = '/tornei'} variant="outline" className="border-white/10 hover:text-primary">
                      Esplora Tornei
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => {
                      const torneo = enrollment.expand?.torneo_id;
                      if (!torneo) return null;
                      
                      return (
                        <div key={enrollment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-background/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                          <div>
                            <h3 className="font-bebas text-xl text-foreground">{torneo.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              Iscritto il {new Date(enrollment.data_iscrizione).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                          <div className="mt-4 sm:mt-0 flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground uppercase">Quota Pagata</p>
                              <p className="font-bold text-primary">€{enrollment.importo_pagato || torneo.quota_iscrizione}</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                              {enrollment.stato.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
