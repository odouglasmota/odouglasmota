
import React, { useState, useEffect } from 'react';
import { 
  Scissors, Calendar, MapPin, Instagram, Facebook, 
  MessageSquare, Send, LayoutDashboard, UserCircle, 
  LogOut, CheckCircle, Image as ImageIcon, Home,
  Phone, Trash2, DollarSign, Lock, Award, ChevronRight,
  Clock, History, Copy, Navigation, Edit3, Save, X
} from 'lucide-react';
import { Appointment, GalleryItem, ServiceType, PaymentMethod, Service } from './types.ts';
import BookingFlow from './components/BookingFlow.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import Gallery from './components/Gallery.tsx';
import CustomerDashboard from './components/CustomerDashboard.tsx';
import { getStyleAdvice } from './services/geminiService.ts';
import { SHOP_ADDRESS, SHOP_PHONE, INSTAGRAM_USER, PIX_KEY, SERVICES as INITIAL_SERVICES } from './constants.tsx';

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
  
  // Define copyPix function to handle copying the PIX key to clipboard
  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Service Editing State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  // Customer Login State
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  // AI Chat State
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
    const updated = services.map(s => {
      if (s.id === id) {
        const priceValue = editPrice.toLowerCase().includes('consulta') ? 'Sob Consulta' : parseFloat(editPrice.replace(',', '.'));
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

  const addGalleryItem = (newItem: Omit<GalleryItem, 'id'>) => {
    const itemWithId: GalleryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updated = [itemWithId, ...galleryItems];
    setGalleryItems(updated);
    localStorage.setItem('vmb_gallery', JSON.stringify(updated));
  };

  const removeGalleryItem = (id: string) => {
    if (confirm("Remover esta foto da galeria?")) {
      const updated = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updated);
      localStorage.setItem('vmb_gallery', JSON.stringify(updated));
    }
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

  const handleCustomerLogout = () => {
    setIsCustomerLoggedIn(false);
    setCustomerPhone('');
    localStorage.removeItem('vmb_customer_phone');
    setActiveView('home');
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

            <section className="py-12 px-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-3xl text-center border-zinc-800/50">
                  <div className="text-yellow-500 text-3xl font-oswald font-bold mb-1 uppercase">NOVO</div>
                  <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Atendimento Domicílio</p>
                </div>
                <div className="glass-card p-6 rounded-3xl text-center border-yellow-500/30">
                  <div className="text-yellow-500 text-3xl font-oswald font-bold mb-1">10/1</div>
                  <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Fidelidade</p>
                </div>
              </div>
              
              <div className="mt-8 glass-card p-8 rounded-[2.5rem] flex flex-col items-center gap-4 text-center border-zinc-800/50">
                <Award className="text-yellow-500 mb-2" size={32} />
                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">PLANO FIDELIDADE</h3>
                <p className="text-zinc-400 text-sm font-light">A cada 10 procedimentos, você ganha um corte por nossa conta. Valorizamos sua preferência!</p>
                <button 
                  onClick={() => setActiveView('customer_portal')}
                  className="text-yellow-500 font-bold text-sm uppercase tracking-widest border-b-2 border-yellow-500 pb-1 mt-4 active:scale-95 transition-all"
                >
                  Ver Meu Progresso
                </button>
              </div>
            </section>
          </div>
        );
      case 'gallery':
        return <Gallery items={galleryItems} isAdmin={isAdmin} onAddItem={addGalleryItem} onRemoveItem={removeGalleryItem} />;
      case 'booking':
        return (
          <div className="animate-in fade-in duration-500 pt-6">
             <BookingFlow onComplete={saveAppointment} existingAppointments={appointments} services={services} />
          </div>
        );
      case 'customer_portal':
        return (
          <CustomerDashboard 
            appointments={appointments} 
            customerPhone={customerPhone}
            onLogin={(phone) => {
              setCustomerPhone(phone);
              setIsCustomerLoggedIn(true);
              localStorage.setItem('vmb_customer_phone', phone);
            }}
            onLogout={handleCustomerLogout}
            onNewBooking={() => setActiveView('booking')}
          />
        );
      case 'contact':
        return (
          <div className="p-8 animate-in fade-in duration-500 min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-4xl font-oswald font-bold mb-8 uppercase text-center tracking-tighter">CONTATO <span className="text-yellow-500">& LOCAL</span></h2>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border-zinc-800/50">
                <div className="bg-yellow-500/10 p-4 rounded-2xl text-yellow-500">
                  <MapPin size={24} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-lg text-white">Nosso Salão</p>
                  <p className="text-zinc-400 text-sm leading-tight mb-4">{SHOP_ADDRESS}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_ADDRESS)}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
                  >
                    <Navigation size={14} /> Abrir no Google Maps
                  </a>
                </div>
              </div>
              <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border-zinc-800/50">
                <div className="bg-yellow-500/10 p-4 rounded-2xl text-yellow-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg text-white">WhatsApp / Pix</p>
                  <p className="text-zinc-400 text-sm font-mono tracking-tight">{SHOP_PHONE}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'admin':
        const completedApps = appointments.filter(a => a.completed);
        const totalRevenue = completedApps.reduce((sum, app) => sum + (typeof app.price === 'number' ? app.price : 0), 0);
        return (
          <div className="p-6 animate-in fade-in duration-500 pb-24">
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

            <div className="grid grid-cols-2 gap-4 mb-8">
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

            {/* Gestão de Serviços */}
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
                              placeholder="Ex: 50.00 ou Sob Consulta"
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
                          <p className="text-[10px] text-zinc-500 mt-1">{service.description}</p>
                        </div>
                        <button 
                          onClick={() => startEditingService(service)}
                          className="p-3 bg-zinc-800 text-zinc-400 rounded-2xl border border-zinc-700 active:scale-95 transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Próximos Clientes</h3>
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-1 rounded font-bold uppercase">Gestão VMB</span>
              </div>
              
              {appointments.length === 0 ? (
                <div className="glass-card p-12 rounded-[2.5rem] text-center border-dashed border-zinc-800">
                  <Calendar className="mx-auto text-zinc-700 mb-4" size={32} />
                  <p className="text-zinc-500 italic text-sm">Nenhum agendamento ativo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...appointments].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()).map(app => (
                    <div key={app.id} className={`glass-card p-5 rounded-3xl border transition-all ${app.completed ? 'opacity-40 border-zinc-900 bg-zinc-950 scale-95' : 'border-zinc-800/50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow">
                          <p className="font-bold text-lg leading-tight mb-1 text-white">{app.customerName}</p>
                          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs">
                            <span className="text-white bg-zinc-800 px-2 py-0.5 rounded-full">{app.date.split('-').reverse().join('/')} - {app.time}</span>
                          </div>
                          {app.address && (
                            <div className="mt-2 text-[11px] text-zinc-300 font-medium flex items-center gap-2 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
                              <MapPin size={14} className="text-yellow-500 shrink-0" />
                              <span>{app.address}</span>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => deleteAppointment(app.id)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-2xl active:bg-red-500 active:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/30 mb-4 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-zinc-500 uppercase font-bold tracking-tighter text-[9px]">Serviço</span>
                          <span className="font-bold text-yellow-500">{app.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 uppercase font-bold tracking-tighter text-[9px]">Pagamento</span>
                          <span className="font-bold text-zinc-300">{app.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between mt-1 pt-1 border-t border-zinc-800/20">
                           <span className="text-zinc-500 uppercase font-bold tracking-tighter text-[9px]">Valor</span>
                           <span className="font-bold text-white">
                             {typeof app.price === 'number' ? `R$ ${app.price.toFixed(2)}` : app.price}
                           </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleCompleteAppointment(app.id)}
                          className={`flex-grow py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
                            app.completed 
                            ? 'bg-zinc-800 text-zinc-500 border-zinc-700' 
                            : 'bg-yellow-500 text-black border-yellow-500 shadow-md shadow-yellow-500/10'
                          }`}
                        >
                          {app.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {app.completed ? 'CONCLUÍDO' : 'CONCLUIR'}
                        </button>
                        <a 
                          href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`E aí ${app.customerName.split(' ')[0]}! Sou o Victor Mota, passando pra confirmar seu ${app.service} para ${app.date.split('-').reverse().join('/')} às ${app.time}. No aguardo, brabo!`)}`} 
                          target="_blank"
                          className="bg-green-500 text-white p-4 rounded-2xl active:scale-95 transition-transform"
                        >
                          <MessageSquare size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-16">
               <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6">Trabalhos na Galeria</h3>
               <Gallery items={galleryItems} isAdmin={true} onAddItem={addGalleryItem} onRemoveItem={removeGalleryItem} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-black overflow-hidden">
      <MusicPlayer />

      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-b border-zinc-900 safe-pt h-20 flex items-center px-6">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2" onClick={() => setActiveView('home')}>
            <div className="bg-yellow-500 p-1.5 rounded-lg rotate-6 shadow-lg shadow-yellow-500/20 active:rotate-0 transition-transform">
              <Scissors className="text-black" size={18} />
            </div>
            <h1 className="text-lg font-oswald font-bold tracking-tighter uppercase">
              V. MOTA <span className="text-yellow-500">BARBER</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveView('customer_portal')}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isCustomerLoggedIn ? 'bg-zinc-800 border-yellow-500/50 shadow-lg shadow-yellow-500/5' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              <UserCircle size={20} className={isCustomerLoggedIn ? 'text-yellow-500' : ''} />
            </button>
            <button 
              onClick={() => {
                if (isAdmin) setActiveView('admin');
                else setIsLoggingIn(true);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isAdmin && activeView === 'admin' ? 'bg-yellow-500 border-yellow-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
            >
              {isAdmin && activeView === 'admin' ? <LayoutDashboard size={18} className="text-black" /> : <Lock size={18} />}
            </button>
          </div>
        </div>
      </header>

      {isLoggingIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsLoggingIn(false)}></div>
          <div className="bg-zinc-900 border border-yellow-500/30 p-8 rounded-[3rem] text-center max-w-sm w-full relative animate-in zoom-in duration-300 shadow-2xl shadow-yellow-500/5">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-2xl font-oswald mb-6 uppercase tracking-tighter text-white">ÁREA DO MESTRE</h3>
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-center text-xl font-bold tracking-widest outline-none focus:border-yellow-500 text-white"
              />
              <div className="flex gap-2">
                <button onClick={() => setIsLoggingIn(false)} className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-4 rounded-2xl text-xs uppercase active:scale-95 transition-all">VOLTAR</button>
                <button onClick={handleAdminLogin} className="flex-[2] bg-yellow-500 text-black font-extrabold py-4 rounded-2xl text-xs uppercase active:scale-95 transition-all shadow-lg shadow-yellow-500/10">ACESSAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow pt-20 safe-pb overflow-y-auto overflow-x-hidden">
        {renderView()}
      </main>

      {!chatOpen && activeView !== 'booking' && activeView !== 'admin' && (
        <button 
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 left-6 z-30 bg-yellow-500 p-4 rounded-full text-black shadow-2xl active:scale-90 transition-all shadow-yellow-500/30"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 animate-in slide-in-from-bottom duration-300">
          <div className="bg-yellow-500 p-6 flex justify-between items-center safe-pt">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-xl shadow-lg"><Scissors className="text-yellow-500" size={20} /></div>
              <div>
                <h3 className="text-black font-extrabold uppercase tracking-widest text-sm">Victor Assistant</h3>
                <p className="text-black/60 text-[10px] font-bold">DISPONÍVEL AGORA</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors">✕</button>
          </div>
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${chat.role === 'user' ? 'bg-yellow-500 text-black font-semibold rounded-br-none shadow-lg shadow-yellow-500/10' : 'bg-zinc-900 text-zinc-300 rounded-bl-none border border-zinc-800'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 p-4 rounded-3xl animate-pulse text-zinc-500 text-xs">Pensando no seu estilo...</div>
              </div>
            )}
          </div>
          <div className="p-6 pb-10 border-t border-zinc-900 bg-black flex gap-3">
            <input type="text" placeholder="Dicas de degradê ou barba?" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-grow bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:border-yellow-500 outline-none text-white" />
            <button onClick={handleSendMessage} className="bg-yellow-500 p-4 rounded-2xl text-black active:scale-95 transition-all"><Send size={20} /></button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-zinc-900 pb-sab mobile-nav-shadow">
        <div className="flex justify-around items-center h-20 px-4">
          <button onClick={() => setActiveView('home')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeView === 'home' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <Home size={22} /><span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => setActiveView('gallery')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeView === 'gallery' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <ImageIcon size={22} /><span className="text-[10px] font-bold uppercase tracking-widest">Look</span>
          </button>
          <button onClick={() => setActiveView('booking')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeView === 'booking' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <div className={`p-3 rounded-full -mt-10 mb-1 border-4 border-black transition-all ${activeView === 'booking' ? 'bg-yellow-500 text-black scale-110 shadow-lg shadow-yellow-500/30' : 'bg-zinc-800 text-zinc-500'}`}><Calendar size={24} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Agendar</span>
          </button>
          <button onClick={() => setActiveView('customer_portal')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeView === 'customer_portal' ? 'text-yellow-500' : 'text-zinc-600'}`}>
            <History size={22} /><span className="text-[10px] font-bold uppercase tracking-widest">Agenda</span>
          </button>
        </div>
      </nav>

      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowConfirmation(false)}></div>
          <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-[3rem] text-center max-w-sm w-full relative animate-in zoom-in duration-300 shadow-2xl shadow-yellow-500/10">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-500/40 animate-bounce"><CheckCircle className="text-black" size={48} /></div>
            <h3 className="text-3xl font-oswald mb-3 uppercase tracking-tighter text-yellow-500 neon-text">SUCESSO!</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-light">Seu horário para <strong>{lastAppointment?.service}</strong> foi reservado com sucesso!</p>
            
            {/* Chave PIX - Exibição clara na confirmação final */}
            {(lastAppointment?.paymentMethod === PaymentMethod.PIX_ANTECIPADO || lastAppointment?.paymentMethod === PaymentMethod.PIX_LOCAL) && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-3xl mb-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-1">Pagamento via PIX (Chave Celular)</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xl font-mono">{PIX_KEY}</p>
                  <button onClick={copyPix} className="p-2 bg-yellow-500 text-black rounded-xl active:scale-90 transition-all shadow-md">
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-[9px] text-zinc-500 mt-2 italic font-medium leading-none">Realize o pagamento agora para confirmar sua reserva.</p>
              </div>
            )}

            {/* Endereço do Salão com botão de mapa na confirmação */}
            {lastAppointment?.service !== ServiceType.DOMICILIO && (
               <div className="bg-zinc-800/50 border border-zinc-700 p-5 rounded-3xl mb-10 text-left animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={10} /> Local do Atendimento</p>
                 <p className="text-zinc-300 text-[11px] leading-tight mb-4 font-medium">{SHOP_ADDRESS}</p>
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_ADDRESS)}`}
                   target="_blank"
                   className="flex items-center justify-center gap-2 bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-2xl active:scale-95 transition-all border border-zinc-600"
                 >
                   <Navigation size={14} /> Abrir no Google Maps
                 </a>
               </div>
            )}

            <button onClick={() => setShowConfirmation(false)} className="w-full bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-yellow-500/20">VALEU, ATÉ LÁ!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
