
import React, { useState, useEffect } from 'react';
import { Calendar, Scissors, User, Phone, CheckCircle2, QrCode, CreditCard, Banknote, Landmark, ChevronLeft, Award, MapPin, Copy } from 'lucide-react';
import { BUSINESS_HOURS, PIX_KEY } from '../constants';
import { ServiceType, PaymentMethod, Appointment, Service } from '../types';

interface BookingFlowProps {
  onComplete: (appointment: Appointment) => void;
  existingAppointments: Appointment[];
  services: Service[];
}

const BookingFlow: React.FC<BookingFlowProps> = ({ onComplete, existingAppointments, services }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoyaltyReward, setIsLoyaltyReward] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check loyalty reward when phone is entered
  useEffect(() => {
    if (whatsapp.length > 5) {
      const myCompleted = existingAppointments.filter(app => app.whatsapp === whatsapp && app.completed);
      const redeems = existingAppointments.filter(app => app.whatsapp === whatsapp && app.paymentMethod === PaymentMethod.FIDELIDADE).length;
      const rewardsAvailable = Math.floor(myCompleted.length / 10) - redeems;
      setIsLoyaltyReward(rewardsAvailable > 0);
    }
  }, [whatsapp, existingAppointments]);

  const getPrice = () => {
    if (isLoyaltyReward && selectedService === ServiceType.CORTE) return 0;
    const service = services.find(s => s.name === selectedService);
    return service?.price || 0;
  };

  const isTimeOccupied = (time: string) => existingAppointments.some(app => app.date === selectedDate && app.time === time);
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!selectedService || !paymentMethod) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      whatsapp,
      address: selectedService === ServiceType.DOMICILIO ? address : undefined,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
      price: getPrice(),
      paymentMethod: isLoyaltyReward && selectedService === ServiceType.CORTE ? PaymentMethod.FIDELIDADE : paymentMethod,
      createdAt: new Date().toISOString()
    });
  };

  const isAddressRequired = selectedService === ServiceType.DOMICILIO;
  const currentPrice = getPrice();

  return (
    <div className="w-full max-w-lg mx-auto p-4 md:p-6 pb-20">
      <div className="flex justify-between mb-8 px-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step >= s ? 'bg-yellow-500 border-yellow-500 text-black font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-600 text-xs'}`}>{step > s ? <CheckCircle2 size={16} /> : s}</div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] p-6 min-h-[500px] flex flex-col animate-in slide-in-from-right-10 duration-500">
        
        {step === 1 && (
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-oswald mb-6 flex items-center gap-3 uppercase tracking-tighter"><Calendar className="text-yellow-500" size={24} /> DATA E HORA</h3>
            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">Quando?</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-yellow-500 outline-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">Horário</label>
                <div className="grid grid-cols-3 gap-2">
                  {BUSINESS_HOURS.map(time => (
                    <button key={time} disabled={isTimeOccupied(time)} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl border text-sm transition-all ${selectedTime === time ? 'bg-yellow-500 border-yellow-500 text-black font-bold' : isTimeOccupied(time) ? 'opacity-20 bg-zinc-950 text-zinc-800 cursor-not-allowed' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{time}</button>
                  ))}
                </div>
              </div>
            </div>
            <button disabled={!selectedTime} onClick={handleNext} className="w-full bg-yellow-500 text-black font-extrabold py-5 rounded-2xl mt-8 uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-yellow-500/20">PRÓXIMO</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-oswald mb-6 flex items-center gap-3 uppercase tracking-tighter"><Scissors className="text-yellow-500" size={24} /> SERVIÇO</h3>
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[400px] no-scrollbar pr-2">
              {services.map(service => (
                <button key={service.id} onClick={() => setSelectedService(service.name)} className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedService === service.name ? 'bg-yellow-500/10 border-yellow-500' : 'bg-zinc-900/50 border-zinc-800'}`}>
                  <div className="text-left">
                    <p className="font-bold text-sm md:text-base text-white">{service.name}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{service.description}</p>
                  </div>
                  <p className="text-yellow-500 font-bold text-sm md:text-lg whitespace-nowrap ml-2">
                    {typeof service.price === 'number' ? `R$ ${service.price.toFixed(2)}` : service.price}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-8"><button onClick={handleBack} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button><button disabled={!selectedService} onClick={handleNext} className="flex-grow bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 shadow-lg shadow-yellow-500/20">PRÓXIMO</button></div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-oswald mb-6 flex items-center gap-3 uppercase tracking-tighter"><User className="text-yellow-500" size={24} /> SEUS DADOS</h3>
            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">Nome Completo</label>
                <input type="text" placeholder="Seu nome" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none text-white focus:border-yellow-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">WhatsApp</label>
                <input type="tel" placeholder="(00) 00000-0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none text-white focus:border-yellow-500" />
              </div>
              
              {isAddressRequired && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2 flex items-center gap-1">
                    <MapPin size={10} /> Seu Endereço para Atendimento
                  </label>
                  <textarea 
                    placeholder="Rua, número, bairro e complemento" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm outline-none text-white focus:border-yellow-500 min-h-[80px]"
                  />
                  <p className="text-[9px] text-zinc-600 italic px-2">Calcularemos a taxa de deslocamento a partir do nosso salão no Jardim das Oliveiras.</p>
                </div>
              )}

              {isLoyaltyReward && !isAddressRequired && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl flex items-center gap-3 animate-bounce">
                  <Award className="text-yellow-500" size={24} />
                  <div><p className="text-xs font-bold text-yellow-500">RESGATE DISPONÍVEL!</p><p className="text-[10px] text-zinc-400">Você tem um corte grátis pelo seu histórico.</p></div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-8">
              <button onClick={handleBack} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button>
              <button disabled={!customerName || !whatsapp || (isAddressRequired && !address)} onClick={handleNext} className="flex-grow bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 shadow-lg shadow-yellow-500/20">PRÓXIMO</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-oswald mb-6 flex items-center gap-3 uppercase tracking-tighter"><CreditCard className="text-yellow-500" size={24} /> PAGAMENTO</h3>
            <div className="space-y-4 flex-grow">
              {isLoyaltyReward && selectedService === ServiceType.CORTE ? (
                <div className="bg-yellow-500/10 border border-yellow-500 p-6 rounded-2xl text-center">
                  <Award className="text-yellow-500 mx-auto mb-3" size={40} />
                  <p className="font-bold text-white mb-1">Corte Grátis Selecionado</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Resgate de Fidelidade Victor Mota</p>
                  <button onClick={() => setPaymentMethod(PaymentMethod.FIDELIDADE)} className={`w-full mt-4 p-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${paymentMethod === PaymentMethod.FIDELIDADE ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>CONFIRMAR RESGATE</button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.PIX_ANTECIPADO)} 
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${paymentMethod === PaymentMethod.PIX_ANTECIPADO ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/10' : 'bg-zinc-900/50 border-zinc-800'}`}
                  >
                    <QrCode className="text-yellow-500" />
                    <div className="text-left">
                      <p className="font-bold text-white">Pix {isAddressRequired ? 'pelo Whats' : 'Antecipado'}</p>
                      <p className="text-[10px] uppercase text-zinc-500">{isAddressRequired ? 'Aguarde o cálculo da taxa' : 'Pague agora para agilizar'}</p>
                    </div>
                  </button>
                  
                  {/* Chave PIX Sempre visível se Pix Antecipado for selecionado */}
                  {(paymentMethod === PaymentMethod.PIX_ANTECIPADO || paymentMethod === PaymentMethod.PIX_LOCAL) && (
                    <div className="bg-zinc-900/80 border border-yellow-500/30 p-5 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Chave PIX (Telefone)</p>
                        {copied && <span className="text-[9px] text-yellow-500 font-bold uppercase animate-pulse">Copiado!</span>}
                      </div>
                      <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-zinc-800">
                        <p className="text-white font-bold text-xl tracking-tight font-mono">{PIX_KEY}</p>
                        <button onClick={copyPix} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors">
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[PaymentMethod.PIX_LOCAL, PaymentMethod.DINHEIRO, PaymentMethod.DEBITO, PaymentMethod.CREDITO].map((method) => (
                      <button key={method} onClick={() => setPaymentMethod(method)} className={`p-4 rounded-2xl border text-[10px] font-bold uppercase text-center transition-all ${paymentMethod === method ? 'bg-yellow-500/10 border-yellow-500' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>{method}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-8"><button onClick={handleBack} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button><button disabled={!paymentMethod} onClick={handleNext} className="flex-grow bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 shadow-lg shadow-yellow-500/20">REVISAR</button></div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col h-full text-center">
            <h3 className="text-3xl font-oswald mb-8 text-yellow-500 uppercase tracking-tighter neon-text">CONFIRMAÇÃO</h3>
            <div className="bg-black/40 rounded-[2rem] p-6 space-y-4 mb-6 text-left border border-zinc-800/50">
              <div className="flex justify-between border-b border-zinc-800 pb-3"><span className="text-zinc-500 text-[10px] uppercase font-bold">Serviço</span><span className="font-bold text-sm text-white">{selectedService}</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-3"><span className="text-zinc-500 text-[10px] uppercase font-bold">Horário</span><span className="font-bold text-sm text-yellow-500">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</span></div>
              
              {isAddressRequired && (
                <div className="flex flex-col border-b border-zinc-800 pb-3 gap-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold">Endereço de Atendimento</span>
                  <span className="font-medium text-xs text-zinc-300">{address}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="text-zinc-500 text-sm uppercase font-bold">Total a pagar</span>
                <span className="font-extrabold text-2xl text-yellow-500">
                  {typeof currentPrice === 'number' ? `R$ ${currentPrice.toFixed(2)}` : currentPrice}
                </span>
              </div>
            </div>

            {/* Chave PIX exibida na revisão final se for método PIX ou Domicílio */}
            {(paymentMethod === PaymentMethod.PIX_ANTECIPADO || paymentMethod === PaymentMethod.PIX_LOCAL || isAddressRequired) && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-3xl mb-8 text-left">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Pague via PIX (Chave Celular)</p>
                   {copied && <span className="text-[9px] text-white font-bold bg-yellow-500 px-2 py-0.5 rounded">Copiado!</span>}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-white font-bold text-lg font-mono truncate">{PIX_KEY}</p>
                  <button onClick={copyPix} className="shrink-0 p-3 bg-yellow-500 text-black rounded-2xl active:scale-90 transition-all">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            )}

            <button onClick={handleSubmit} className="w-full bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-yellow-500/20">AGENDAR E FINALIZAR</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
