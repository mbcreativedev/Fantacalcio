
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock Stripe Integration for frontend demonstration
export default function PaymentModal({ isOpen, onClose, tournament, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network request and payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Pagamento completato!",
        description: `Ti sei iscritto con successo a ${tournament?.nome}.`,
      });
      onSuccess();
    }, 2000);
  };

  if (!tournament) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-wide">Iscrizione Torneo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Completa il pagamento per iscriverti a <strong className="text-foreground">{tournament.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-background/50 p-4 rounded-lg border border-white/5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Quota di iscrizione</span>
            <span className="font-bold text-lg">€{tournament.quota_iscrizione}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Montepremi</span>
            <span className="text-secondary font-medium">€{tournament.premio}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome sulla carta</Label>
            <Input id="name" placeholder="Mario Rossi" required className="bg-background border-white/10" />
          </div>
          
          <div className="space-y-2">
            <Label>Dati Carta (Mock Stripe Elements)</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="0000 0000 0000 0000" 
                className="pl-10 bg-background border-white/10 font-mono"
                required
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input placeholder="MM/YY" required className="bg-background border-white/10 font-mono" />
              <Input placeholder="CVC" required className="bg-background border-white/10 font-mono" maxLength={4} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Pagamento sicuro elaborato da Stripe</span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isProcessing}>
              Annulla
            </Button>
            <Button type="submit" disabled={isProcessing} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]">
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Paga €${tournament.quota_iscrizione}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
