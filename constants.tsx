
import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    name: ServiceType.CORTE,
    price: 50.00,
    duration: 30,
    description: 'Corte moderno personalizado para o seu estilo.'
  },
  {
    id: '2',
    name: ServiceType.CORTE_BARBA,
    price: 70.00,
    duration: 60,
    description: 'O combo completo: cabelo na régua e barba alinhada.'
  },
  {
    id: '3',
    name: ServiceType.CORTE_PROGRESSIVA,
    price: 90.00,
    duration: 90,
    description: 'Corte + alisamento progressivo de alta performance.'
  },
  {
    id: '4',
    name: ServiceType.LUZES,
    price: 60.00,
    duration: 90,
    description: 'Realce seu visual com reflexos modernos.'
  },
  {
    id: '5',
    name: ServiceType.PLATINADO,
    price: 55.00,
    duration: 120,
    description: 'Estilo radical com descoloração total e matização.'
  },
  {
    id: '6',
    name: ServiceType.DOMICILIO,
    price: 'Sob Consulta',
    duration: 60,
    description: 'Conforto total: o barbeiro vai até você. Preço varia conforme a distância.'
  }
];

export const BUSINESS_HOURS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const PIX_KEY = "970570433";
export const SHOP_ADDRESS = "R. Manuel Vila D'Alba, 447 - Jardim das Oliveiras, São Paulo - SP, 08111-570";
export const SHOP_PHONE = "(11) 970570433";
export const INSTAGRAM_USER = "eovictormota";
