
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import DeliveryModal from './components/DeliveryModal';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Flame, Instagram, Facebook, Twitter, MapPin, Phone } from 'lucide-react';

const App: React.FC = () => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <DeliveryModal />
          <Navbar />
          <main className="flex-grow animate-in fade-in duration-500">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 fancy-gradient rounded-xl flex items-center justify-center text-white">
                      <Flame className="w-6 h-6 fill-white/20" />
                    </div>
                    <span className="text-xl font-serif font-black tracking-tighter">GRILL HUT</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm leading-relaxed mb-6">
                    Authentic open-flame cooking. Experience the real taste of grilled excellence since 2012.
                  </p>
                  <div className="flex gap-4">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                    {['Our Menu', 'Order Online', 'Gift Cards', 'Careers'].map(link => (
                      <li key={link}><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium">{link}</a></li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Help & Support</h4>
                  <ul className="space-y-4">
                    {['FAQ', 'Track Order', 'Privacy Policy', 'Contact Us'].map(link => (
                      <li key={link}><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium">{link}</a></li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Visit Us</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                      <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>123 Flame Ave, BBQ District,<br/>Grill City, GC 55432</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                      <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>+1 (555) 000-FIRE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  &copy; 2024 GRILL HUT. PURE SMOKE & FLAVOR.
                </p>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
                  <a href="#" className="hover:text-orange-500 transition-colors">Cookies</a>
                  <a href="#" className="hover:text-orange-500 transition-colors">Sitemap</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
