export type ServiceCategory = 'SERVICIOS' | 'EXTRAS';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  includedTreatmentsCount: number; // 0 para sencillos, 1 para VIP Clásico, 2 para VIP Full / Premium
  allowsDrink: boolean;
  availableTreatments?: string[];
}

export interface ExtraProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'perfumes' | 'bebidas' | 'servicios_extra' | 'accesorios';
  image?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  baseId: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'extra';
  selectedTreatments?: string[];
  selectedDrink?: string;
  image?: string;
}

export type PaymentMethod = 'nequi' | 'bancolombia' | 'efectivo';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: number; // timestamp
  notes?: string;
}

export interface BarberSettings {
  barberName: string;
  shopName: string;
  phone: string;
  nequiNumber: string;
  nequiHolder: string;
  bancolombiaAccount: string;
  bancolombiaType: string;
  bancolombiaHolder: string;
  wifiSsid: string;
  wifiPass: string;
}
