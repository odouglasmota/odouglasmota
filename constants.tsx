
import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  { id: '1', name: ServiceType.CORTE, price: 50.00, duration: 30, description: 'Corte moderno personalizado.' },
  { id: '2', name: ServiceType.CORTE_BARBA, price: 70.00, duration: 60, description: 'Combo cabelo e barba.' },
  { id: '3', name: ServiceType.CORTE_PROGRESSIVA, price: 90.00, duration: 90, description: 'Corte e alisamento.' },
  { id: '4', name: ServiceType.LUZES, price: 60.00, duration: 90, description: 'Reflexos modernos.' },
  { id: '5', name: ServiceType.PLATINADO, price: 55.00, duration: 120, description: 'Descoloração total.' },
  { id: '6', name: ServiceType.DOMICILIO, price: 'Sob Consulta', duration: 60, description: 'Barbeiro vai até você.' }
];

export const BUSINESS_HOURS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
export const PIX_KEY = "970570433";
export const SHOP_ADDRESS = "R. Manuel Vila D'Alba, 447 - Jardim das Oliveiras, SP";
export const SHOP_PHONE = "(11) 970570433";
