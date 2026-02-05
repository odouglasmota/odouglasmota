
import React, { useState } from 'react';
import { Camera, Plus, Trash2, X } from 'lucide-react';
import { GalleryItem, ServiceType } from '../types';

interface GalleryProps {
  items: GalleryItem[];
  isAdmin: boolean;
  onAddItem?: (item: Omit<GalleryItem, 'id'>) => void;
  onRemoveItem?: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, isAdmin, onAddItem, onRemoveItem }) => {
  const [filter, setFilter] = useState<ServiceType | 'Todos'>('Todos');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    imageUrl: '',
    category: ServiceType.CORTE,
    barberName: 'Victor Mota',
    description: ''
  });

  const filteredItems = filter === 'Todos' 
    ? items 
    : items.filter(item => item.category === filter);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.imageUrl && onAddItem) {
      onAddItem(newItem);
      setIsAdding(false);
      setNewItem({
        imageUrl: '',
        category: ServiceType.CORTE,
        barberName: 'Victor Mota',
        description: ''
      });
    }
  };

  return (
    <div className="pb-10">
      <div className="px-6 mb-8 pt-4">
        <h2 className="text-4xl font-oswald font-bold mb-2 uppercase tracking-tighter">
          NOSSO <span className="text-yellow-500">ESTILO</span>
        </h2>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-6">Explore os últimos trampos</p>
        
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {['Todos', ...Object.values(ServiceType)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-extrabold transition-all border uppercase tracking-widest ${
                filter === cat 
                ? 'bg-yellow-500 border-yellow-500 text-black' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="px-6 mb-10">
          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-4 rounded-2xl font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              <Plus size={18} /> Novo Trabalho
            </button>
          ) : (
            <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-zinc-900 flex justify-between items-center safe-pt">
                <h3 className="font-oswald font-bold text-xl uppercase">Postar Foto</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-zinc-900 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-grow overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Foto do Corte</label>
                    <div className="relative aspect-square w-full bg-zinc-900 rounded-[2rem] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                      {newItem.imageUrl ? (
                        <img src={newItem.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <Camera size={48} className="text-zinc-800" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Categoria</label>
                      <select 
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as ServiceType }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none appearance-none"
                      >
                        {Object.values(ServiceType).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Descrição</label>
                      <input 
                        type="text"
                        placeholder="Ex: Skin Fade na régua"
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="p-6 pb-10 border-t border-zinc-900">
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={!newItem.imageUrl}
                  className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-extrabold uppercase tracking-widest disabled:opacity-50"
                >
                  PUBLICAR AGORA
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="px-6 py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
            <Camera className="text-zinc-700" size={32} />
          </div>
          <p className="text-zinc-500 italic text-sm">Nada por aqui ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-6 pb-20">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative bg-zinc-950 rounded-[2rem] overflow-hidden aspect-[4/5] border border-zinc-900 group">
              <img 
                src={item.imageUrl} 
                alt={item.description}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                <span className="bg-yellow-500 text-black text-[8px] font-extrabold px-2 py-1 rounded w-fit mb-1 uppercase tracking-tighter leading-none">{item.category}</span>
                <p className="text-white font-bold text-xs truncate mb-0.5 leading-tight">{item.description}</p>
                
                {isAdmin && (
                  <button 
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-md p-2 rounded-full text-white active:scale-90 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
