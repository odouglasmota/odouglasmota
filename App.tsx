import React, { useState, useEffect } from 'react';
import { 
  Scissors, Calendar, MapPin, MessageSquare, Send, LayoutDashboard, 
  UserCircle, CheckCircle, Image as ImageIcon, Home,
  Phone, Trash2, DollarSign, Lock, Award, 
  Clock, History, Copy, Navigation, Edit3, Save
} from 'lucide-react';
import { Appointment, GalleryItem, ServiceType, PaymentMethod, Service } from './types';
import BookingFlow from './components/BookingFlow';
import MusicPlayer from './components/MusicPlayer';
import Gallery from './components/Gallery';
import CustomerDashboard from './components/CustomerDashboard';
import { getStyleAdvice } from './services/geminiService';
import { SHOP_ADDRESS, SHOP_PHONE, PIX_KEY, SERVICES as INITIAL_SERVICES } from './constants';

type View = 'home' | 'gallery' | 'booking' | 'contact' | 'admin' | 'customer_portal';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const [customerPhone, setCustomerPhone] = useState('');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'E aí! Sou o assistente do Victor Mota. Qual a boa hoje? Precisa de uma dica pro visual?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const savedApps = localStorage.getItem('vmb_appointments');
    if (savedApps) setAppointments(JSON.parse(savedApps));

    const savedGallery = localStorage.getItem('vmb_gallery');
    if (savedGallery) setGalleryItems(JSON.parse(savedGallery));

    const savedServices = localStorage.getItem('vmb_services');
    if (savedServices) setServices(JSON.parse(savedServices));

    const savedPhone = localStorage.getItem('vmb_customer_phone');
    if (savedPhone) {
      setCustomerPhone(savedPhone);
      setIsCustomerLoggedIn(true);
    }
  }, []);

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAppointment = (app: Appointment) => {
    const updated = [...appointments, app];
    setAppointments(updated);
    setLastAppointment(app);
    localStorage.setItem('vmb_appointments', JSON.stringify(updated));
    setActiveView('home');
    setShowConfirmation(true);
  };

  const deleteAppointment = (id: string) => {
    if (confirm("Deseja realmente remover este agendamento?")) {
      const updated = appointments.filter(app => app.id !== id);
      setAppointments(updated);
      localStorage.setItem('vmb_appointments', JSON.stringify(updated));
    }
  };

  const toggleCompleteAppointment = (id: string) => {
    const updated = appointments.map(app => 
      app.id === id ? { ...app, completed: !app.completed } : app
    );
    setAppointments(updated);
    localStorage.setItem('vmb_appointments', JSON.stringify(updated));
  };

  const updateService = (id: string) => {
    const updated: Service[] = services.map(s => {
      if (s.id === id) {
        const cleanedPrice = editPrice.replace('R$', '').trim();
        const priceValue: number | 'Sob Consulta' = cleanedPrice.toLowerCase().includes('consulta') 
          ? 'Sob Consulta' 
          : parseFloat(cleanedPrice.replace(',', '.'));
        return { ...s, price: priceValue, description: editDescription };
      }
      return s;
    });
    setServices(updated);
    localStorage.setItem('vmb_services', JSON.stringify(updated));
    setEditingServiceId(null);
  };

  const startEditingService = (service: Service) => {
    setEditingServiceId(service.id);
    setEditPrice(service.price.toString());
    setEditDescription(service.description);
  };

  const handleAdminLogin = () => {
    if (password === 'Player@07!') {
      setIsAdmin(true);
      setIsLoggingIn(false);
      setActiveView('admin');
      setPassword('');
    } else {
      alert('Senha incorreta, mestre!');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const advice = await getStyleAdvice(userMsg);
    setChatHistory(prev => [...prev, { role: 'ai', text: advice }]);
    setIsTyping(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500">
            <section className="relative h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden rounded-b-[3rem]">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
                  alt="Barber Background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="max-w-md">
                <h2 className="text-5xl font-oswald font-bold mb-4 tracking-tighter uppercase neon-text leading-tight">
                  ESTILO <br />
                  <span className="text-yellow-500">SEM LIMITES.</span>
                </h2>
                <p className="text-zinc-300 text-sm mb-8 font-light px-4">
                  Victor Mota Barber Shop: Onde seu estilo é levado a sério.
                </p>
                <div className="flex flex-col gap-3 items-center">
                  <button 
                    onClick={() => setActiveView('booking')}
                    className="w-full bg-yellow-500 text-black text-lg font-extrabold px-10 py-4 rounded-full shadow-xl shadow-yellow-500/20 uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Agendar Agora
                  </button>
                  <button 
                    onClick={() => setActiveView('customer_portal')}
                    className="w-full bg-zinc-900 text-white text-xs font-bold px-10 py-3 rounded-full border border-zinc-800 uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <History size={14} /> Meus Agendamentos
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case 'admin':
        const completedApps = appointments.filter(a => a.completed);
        const totalRevenue = completedApps.reduce((sum, app) => sum + (typeof app.price === 'number' ? app.price : 0), 0);
        return (
          <div className="p-6 pb-24 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 pt-4">
              <h2 className="text-3xl font-oswald font-bold uppercase flex items-center gap-3">
                <LayoutDashboard className="text-yellow-500" /> PAINEL ADMIN
              </h2>
              <button 
                onClick={() => { setIsAdmin(false); setActiveView('home'); }}
                className="bg-zinc-800 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-zinc-700 text-zinc-400"
              >
                SAIR
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="glass-card p-4 rounded-3xl border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Concluídos</span>
                </div>
                <p className="text-2xl font-oswald font-bold text-white">{completedApps.length}</p>
              </div>
              <div className="glass-card p-4 rounded-3xl border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <DollarSign size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Faturamento</span>
                </div>
                <p className="text-2xl font-oswald font-bold text-white">R$ {totalRevenue.toFixed(0)}</p>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Scissors size={14} /> GESTÃO DE PREÇOS
              </h3>
              <div className="space-y-3">
                {services.map(service => (
                  <div key={service.id} className="glass-card p-5 rounded-3xl border border-zinc-800/50">
                    {editingServiceId === service.id ? (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <p className="font-bold text-yellow-500 uppercase text-[10px]">{service.name}</p>
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-1">
                            <label className="text-[9px] text-zinc-500 font-bold uppercase">Preço (R$)</label>
                            <input 
                              type="text" 
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 font-bold uppercase">Descrição</label>
                          <textarea 
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingServiceId(null)} className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-3 rounded-xl text-[10px] uppercase">Cancelar</button>
                          <button onClick={() => updateService(service.id)} className="flex-1 bg-yellow-500 text-black font-extrabold py-3 rounded-xl text-[10px] uppercase flex items-center justify-center gap-2"><Save size={14} /> Salvar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white leading-none mb-1">{service.name}</p>
                          <p className="text-yellow-500 font-bold text-sm">
                            {typeof service.price === 'number' ? `R$ ${service.price.toFixed(2)}` : service.price}
                          </p>
                        </div>
                        <button 
                          onClick={() => startEditingService(service)}
                          className="p-3 bg-zinc-800 text-zinc-400 rounded-2xl border border-zinc-700"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'booking':
        return <BookingFlow onComplete={saveAppointment} existingAppointments={appointments} services={services} />;
      case 'gallery':
        return <Gallery items={galleryItems} isAdmin={isAdmin} onAddItem={(item) => {
          const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
          const updated = [newItem, ...galleryItems];
          setGalleryItems(updated);
          localStorage.setItem('vmb_gallery', JSON.stringify(updated));
        }} onRemoveItem={(id) => {
          const updated = galleryItems.filter(i => i.id !== id);
          setGalleryItems(updated);
          localStorage.setItem('vmb_gallery', JSON.stringify(updated));
        }} />;
      case 'customer_portal':
        return (
          <CustomerDashboard 
            appointments={appointments} 
            customerPhone={customerPhone}
            onLogin={(phone) => { setCustomerPhone(phone); setIsCustomerLoggedIn(true); localStorage.setItem('vmb_customer_phone', phone); }}
            onLogout={() => { setIsCustomerLoggedIn(false); setCustomerPhone(''); localStorage.removeItem('vmb_customer_phone'); }}
            onNewBooking={() => setActiveView('booking')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-black overflow-hidden">
      <MusicPlayer />
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-b border-zinc-900 safe-pt h-20 flex items-center px-6">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2" onClick={() => setActiveView('home')}>
            <div className="bg-yellow-500 p-1.5 rounded-lg rotate-6 shadow-lg"><Scissors className="text-black" size={18} /></div>
            <h1 className="text-lg font-oswald font-bold uppercase tracking-tighter">V. MOTA <span className="text-yellow-500">BARBER</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { if (isAdmin) setActiveView('admin'); else setIsLoggingIn(true); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${isAdmin ? 'bg-yellow-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              <Lock size={18} />
            </button>
          </div>
        </div>
      </header>

      {isLoggingIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/95 backdrop-blur-md">
          <div className="bg-zinc-900 border border-yellow-500/30 p-8 rounded-[3rem] text-center max-w-sm w-full">
            <Lock className="text-yellow-500 mx-auto mb-6" size={32} />
            <h3 className="text-2xl font-oswald mb-6 uppercase text-white">ÁREA DO MESTRE</h3>
            <input 
              type="password" 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-center text-xl font-bold mb-4 outline-none focus:border-yellow-500 text-white"
            />
            <div className="flex gap-2">
              <button onClick={() => setIsLoggingIn(false)} className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-4 rounded-2xl text-xs uppercase">VOLTAR</button>
              <button onClick={handleAdminLogin} className="flex-[2] bg-yellow-500 text-black font-extrabold py-4 rounded-2xl text-xs uppercase">ACESSAR</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow pt-20 safe-pb overflow-y-auto">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-zinc-900 pb-sab mobile-nav-shadow">
        <div className="flex justify-around items-center h-20 px-4">
          <button onClick={() => setActiveView('home')} className={`flex flex-col items-center gap-1 w-1/4 ${activeView === 'home' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <Home size={22} /><span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button onClick={() => setActiveView('gallery')} className={`flex flex-col items-center gap-1 w-1/4 ${activeView === 'gallery' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <ImageIcon size={22} /><span className="text-[10px] font-bold uppercase">Look</span>
          </button>
          <button onClick={() => setActiveView('booking')} className={`flex flex-col items-center gap-1 w-1/4 ${activeView === 'booking' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <div className={`p-3 rounded-full -mt-10 mb-1 border-4 border-black ${activeView === 'booking' ? 'bg-yellow-500 text-black scale-110 shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}><Calendar size={24} /></div>
            <span className="text-[10px] font-bold uppercase">Agendar</span>
          </button>
          <button onClick={() => setActiveView('customer_portal')} className={`flex flex-col items-center gap-1 w-1/4 ${activeView === 'customer_portal' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <History size={22} /><span className="text-[10px] font-bold uppercase">Agenda</span>
          </button>
        </div>
      </nav>

      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-[3rem] text-center max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce"><CheckCircle className="text-black" size={40} /></div>
            <h3 className="text-3xl font-oswald mb-3 uppercase text-yellow-500 neon-text">SUCESSO!</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Seu horário para <strong>{lastAppointment?.service}</strong> foi reservado!</p>
            
            {(lastAppointment?.paymentMethod === PaymentMethod.PIX_ANTECIPADO || lastAppointment?.paymentMethod === PaymentMethod.PIX_LOCAL) && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-3xl mb-6 text-left">
                <p className="text-[10px] text-yellow-500 font-black uppercase mb-1">Chave PIX</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xl font-mono">{PIX_KEY}</p>
                  <button onClick={copyPix} className="p-2 bg-yellow-500 text-black rounded-xl">{copied ? <CheckCircle size={18} /> : <Copy size={18} />}</button>
                </div>
              </div>
            )}
            <button onClick={() => setShowConfirmation(false)} className="w-full bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase shadow-xl">VALEU!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
