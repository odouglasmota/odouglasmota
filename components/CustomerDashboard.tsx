
import React, { useState } from 'react';
import { Appointment, PaymentMethod } from '../types';
import { Calendar, Award, Phone, History, Scissors, LogOut, ChevronRight, CheckCircle2, Star, Clock, MapPin } from 'lucide-react';

interface CustomerDashboardProps {
  appointments: Appointment[];
  customerPhone: string;
  onLogin: (phone: string) => void;
  onLogout: () => void;
  onNewBooking: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ appointments, customerPhone, onLogin, onLogout, onNewBooking }) => {
  const [phoneInput, setPhoneInput] = useState('');
  
  const myAppointments = appointments.filter(app => app.whatsapp === customerPhone);
  const completedCount = myAppointments.filter(app => app.completed).length;
  const currentProgress = completedCount % 10;
  const rewardsAvailable = Math.floor(completedCount / 10) - myAppointments.filter(app => app.paymentMethod === PaymentMethod.FIDELIDADE).length;

  if (!customerPhone) {
    return (
      <div className="p-8 animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-[2rem] flex items-center justify-center mb-8">
          <History className="text-yellow-500" size={32} />
        </div>
        <h2 className="text-3xl font-oswald font-bold mb-3 uppercase text-center tracking-tighter">SUA <span className="text-yellow-500">AGENDA</span></h2>
        <p className="text-zinc-500 text-sm text-center mb-8 max-w-[250px]">Entre com seu WhatsApp para ver seus horários e pontos de fidelidade.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="tel"
                placeholder="(00) 00000-0000"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
          <button 
            disabled={!phoneInput}
            onClick={() => onLogin(phoneInput)}
            className="w-full bg-yellow-500 text-black font-extrabold py-5 rounded-2xl uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-yellow-500/10 disabled:opacity-50"
          >
            ACESSAR MINHA CONTA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in slide-in-from-right-10 duration-500 pb-24">
      <div className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h2 className="text-2xl font-oswald font-bold uppercase leading-none mb-1">E AÍ, <span className="text-yellow-500">CHEFIA!</span></h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{customerPhone}</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 bg-zinc-900 text-zinc-500 rounded-2xl border border-zinc-800"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Loyalty Card */}
      <div className="glass-card p-6 rounded-[2.5rem] mb-8 border-yellow-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={80} className="text-yellow-500" />
        </div>
        <h3 className="text-lg font-oswald font-bold uppercase flex items-center gap-2 mb-6">
          <Award className="text-yellow-500" size={20} /> CARTÃO FIDELIDADE
        </h3>
        
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                i < currentProgress 
                ? 'bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-500/30 text-black' 
                : i === 9 
                ? 'bg-zinc-950 border-dashed border-yellow-500/30 text-yellow-500/50'
                : 'bg-zinc-950 border-zinc-800 text-zinc-800'
              }`}
            >
              {i === 9 ? <Star size={16} /> : <Scissors size={16} />}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Faltam {10 - currentProgress} para o prêmio</p>
            <p className="text-xs text-zinc-300 font-semibold mt-1">
              {rewardsAvailable > 0 
                ? `Você tem ${rewardsAvailable} corte(s) grátis disponível!` 
                : 'Complete os 10 selos e ganhe um corte grátis.'}
            </p>
          </div>
          {rewardsAvailable > 0 && (
            <div className="bg-yellow-500 text-black text-[10px] font-black px-3 py-2 rounded-xl animate-bounce">
              RESGATE DISPONÍVEL!
            </div>
          )}
        </div>
      </div>

      {/* Agenda Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Meus Horários</h3>
          <button onClick={onNewBooking} className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest border-b border-yellow-500">Novo Agendamento</button>
        </div>

        {myAppointments.length === 0 ? (
          <div className="glass-card p-12 rounded-[2.5rem] text-center border-dashed border-zinc-800">
            <Calendar className="mx-auto text-zinc-700 mb-4" size={32} />
            <p className="text-zinc-500 italic text-sm">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...myAppointments].reverse().map(app => (
              <div key={app.id} className={`glass-card p-5 rounded-3xl border ${app.completed ? 'opacity-50 border-zinc-900 bg-zinc-950/30' : 'border-zinc-800/50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {app.completed ? <CheckCircle2 className="text-green-500" size={14} /> : <Clock className="text-yellow-500" size={14} />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${app.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                        {app.completed ? 'CONCLUÍDO' : 'CONFIRMADO'}
                      </span>
                    </div>
                    <p className="font-bold text-lg">{app.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-white">{app.time}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{app.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                
                {app.address && (
                  <div className="mb-4 bg-black/40 p-3 rounded-2xl flex items-start gap-2 border border-zinc-800/30">
                    <MapPin size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-zinc-400">{app.address}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Forma: {app.paymentMethod}</span>
                  <span className="text-sm font-bold text-yellow-500">
                    {typeof app.price === 'number' ? `R$ ${app.price.toFixed(2)}` : app.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
