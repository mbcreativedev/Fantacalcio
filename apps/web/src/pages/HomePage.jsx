import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext.jsx';
export default function HomePage() {
  const {
    isAuthenticated
  } = useAuth();
  const features = [{
    icon: <Trophy className="h-10 w-10 text-secondary" />,
    title: "Tornei Fantacalcio",
    description: "Partecipa a tornei giornalieri, settimanali o mensili. Scegli la quota di iscrizione adatta a te e sfida migliaia di fanta-allenatori."
  }, {
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
    title: "Classifiche Live",
    description: "Segui l'andamento della tua squadra in tempo reale. I punteggi vengono aggiornati istantaneamente durante le partite."
  }, {
    icon: <ShieldCheck className="h-10 w-10 text-secondary" />,
    title: "Pagamenti Sicuri",
    description: "Transazioni protette e sicure. Montepremi garantito e distribuito personalmente dallo staff."
  }];
  const featuredTournaments = [{
    name: "Daily Cup",
    fee: 5,
    prize: 500,
    spots: "95/100"
  }, {
    name: "Weekly Cup",
    fee: 10,
    prize: 2000,
    spots: "180/200"
  }, {
    name: "Monthly Cup",
    fee: 20,
    prize: 10000,
    spots: "450/500"
  }];
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1654273453213-fba26421b043?q=80&w=2000&auto=format&fit=crop" alt="Stadio di calcio illuminato" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }} className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Stagione 2025/2026 Aperta
            </div>
            <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl tracking-wide leading-none mb-6 text-balance">
              <span className="text-secondary">Vinci</span> Premi Veri con il <span className="text-primary">Fantacalcio</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-balance">
              Metti alla prova le tue abilità manageriali. Partecipa ai Tornei, crea la tua squadra migliore e scala le classifiche per vincere fantastici Montepremi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to={isAuthenticated ? "/tornei" : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8">
                  Inizia Ora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/classifiche">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/5 hover:text-primary text-lg h-14 px-8">
                  Vedi Classifiche
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} className="flex-1 hidden lg:block">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <Card className="glass-panel border-white/10 relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <CardHeader className="pb-2 border-b border-white/10">
                  <CardTitle className="font-bebas text-2xl flex justify-between items-center">
                    <span>Top Manager della Settimana</span>
                    <Trophy className="text-secondary h-6 w-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="font-bebas text-xl text-muted-foreground w-4">{i}</span>
                        <div>
                          <p className="font-medium">AC Inte</p>
                          <p className="text-xs text-primary">15{5 - i} pt</p>
                        </div>
                      </div>
                      <span className="text-secondary font-bold">€{300 / i}</span>
                    </div>)}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-4xl md:text-5xl mb-4">Perché Scegliere FantaLega?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Tutto ciò di cui hai bisogno per vivere l'esperienza definitiva del fantacalcio competitivo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <Card className="bg-background/50 border-white/5 h-full hover:border-primary/50 transition-colors duration-300">
                  <CardContent className="pt-8 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-2xl bg-white/5">
                      {feature.icon}
                    </div>
                    <h3 className="font-bebas text-2xl mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-bebas text-4xl md:text-5xl mb-2">Tornei in Evidenza</h2>
              <p className="text-muted-foreground">Iscriviti ora prima che i posti si esauriscano.</p>
            </div>
            <Link to="/tornei">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                Vedi tutti i tornei <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTournaments.map((t, i) => <motion.div key={i} initial={{
            opacity: 0,
            scale: 0.95
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: i * 0.1
          }}>
                <Card className="border-white/10 bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-bebas text-3xl text-center">{t.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Montepremi</p>
                      <p className="font-bebas text-5xl text-secondary">€{t.prize}</p>
                    </div>
                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-muted-foreground">Quota Iscrizione</span>
                        <span className="font-bold text-primary">€{t.fee}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-muted-foreground">Posti Disponibili</span>
                        <span className="font-bold">{t.spots}</span>
                      </div>
                    </div>
                    <Link to="/tornei" className="mt-auto">
                      <Button className="w-full bg-white/10 hover:bg-primary hover:text-primary-foreground text-foreground transition-colors">
                        Iscriviti Ora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary/5 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Mail className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-bebas text-4xl md:text-5xl mb-4">Resta Aggiornato</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Iscriviti alla nostra newsletter per ricevere notifiche sui nuovi tornei e promozioni esclusive.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <Input type="email" placeholder="La tua email" className="h-12 bg-background border-white/20 focus-visible:ring-primary" required />
            <Button type="submit" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
              Iscriviti
            </Button>
          </form>
        </div>
      </section>
    </div>;
}