
export enum ServiceType {
  CORTE = 'Corte',
  CORTE_BARBA = 'Corte + Barba',
  CORTE_PROGRESSIVA = 'Corte + Progressiva',
  LUZES = 'Luzes',
  PLATINADO = 'Platinado',
  DOMICILIO = 'Atendimento a Domicílio'
}

export interface Service {
  id: string;
  name: ServiceType;
  price: number | 'Sob Consulta';
  duration: number; // in minutes
  description: string;
}

export enum PaymentMethod {
  PIX_ANTECIPADO = 'Pix Antecipado',
  PIX_LOCAL = 'Pix no Salão',
  DINHEIRO = 'Dinheiro',
  DEBITO = 'Cartão de Débito',
  CREDITO = 'Cartão de Crédito',
  FIDELIDADE = 'Resgate Fidelidade (Grátis)'
}

export interface Appointment {
  id: string;
  customerName: string;
  whatsapp: string;
  address?: string; // For home service
  date: string; // ISO string
  time: string; // HH:mm
  service: ServiceType;
  price: number | 'Sob Consulta';
  paymentMethod: PaymentMethod;
  createdAt: string;
  completed?: boolean;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: ServiceType;
  barberName: string;
  description: string;
}
