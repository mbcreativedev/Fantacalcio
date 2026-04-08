import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Mail, Phone } from 'lucide-react';
export default function Footer() {
  return <footer className="bg-card border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-6 group">
              <img src="https://horizons-cdn.hostinger.com/0000523f-1fb8-4ea0-beed-e540c65722fa/9ef29f2d32272f1bb5d1f6c6f30e1141.png" alt="FantaLega Logo" className="h-14 w-auto object-contain group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              La piattaforma definitiva per i tornei di fantacalcio a premi. Sfida i tuoi avversari, scala le classifiche e vinci premi reali.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bebas text-xl mb-4 text-foreground">Esplora</h4>
            <ul className="space-y-3">
              <li><Link to="/tornei" className="text-muted-foreground hover:text-primary transition-colors">Tornei Attivi</Link></li>
              <li><Link to="/classifiche" className="text-muted-foreground hover:text-primary transition-colors">Classifiche Live</Link></li>
              <li><Link to="/regolamento" className="text-muted-foreground hover:text-primary transition-colors">Regolamento</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bebas text-xl mb-4 text-foreground">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:support@fantalega.com" className="hover:text-primary transition-colors">info@fanta-lega.com</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <a href="tel:+39123456789" className="hover:text-primary transition-colors">+39 351 8037868</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FantaLega. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Termini di Servizio</Link>
          </div>
        </div>
      </div>
    </footer>;
}