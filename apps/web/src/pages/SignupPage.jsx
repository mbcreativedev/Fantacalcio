
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    squadra: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Le password non coincidono.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      toast({
        title: "Registrazione completata",
        description: "Benvenuto su FantaLega!",
      });
      navigate('/profilo');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di registrazione",
        description: error.message || "Si è verificato un errore durante la registrazione.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-panel border-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-bebas text-4xl tracking-wider">Registrati</CardTitle>
            <CardDescription className="text-muted-foreground">
              Crea il tuo account e inizia a giocare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Mario Rossi"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squadra">Nome Squadra</Label>
                <Input
                  id="squadra"
                  placeholder="Real Madrid FC"
                  value={formData.squadra}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mario@esempio.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="bg-background/50 border-white/10 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm">Conferma</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="bg-background/50 border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Creazione in corso...' : 'Crea Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Hai già un account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Accedi
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
