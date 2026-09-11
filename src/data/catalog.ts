import { ServiceItem, ExtraProduct, BarberSettings } from '../types';

export const DEFAULT_BARBER_SETTINGS: BarberSettings = {
  barberName: 'Jeffer',
  shopName: 'Barbería & Perfumería JyM',
  phone: '573145549069',
  nequiNumber: '3145549069',
  nequiHolder: 'Jeffer Barber',
  bancolombiaAccount: '3145549069',
  bancolombiaType: 'Ahorros a la mano',
  bancolombiaHolder: 'Jeffer Barber',
  wifiSsid: 'Barbería JyM',
  wifiPass: 'Chepe2001'
};

export const COURTESY_DRINKS: string[] = [
  'Gaseosa Manzana',
  'Cerveza fría michelada (Cortesía VIP)',
  'Limonada natural',
  'Café negro caliente',
  'Agua mineral fría',
  'Té de manzanilla'
];

export const TREATMENTS_VIP_CLASICO: string[] = [
  'Parches de ojeras de colágeno',
  'Mascarilla facial',
  'Pigmentación de barba/cejas',
  'Perfume de autor'
];

export const TREATMENTS_VIP_FULL: string[] = [
  'Arreglo de barba con navaja',
  'Parches ojeras + Mascarilla + Masaje express',
  'Pigmentación capilar o de barba',
  'Perfume con feromonas'
];

export const TREATMENTS_PREMIUM: string[] = [
  'Toalla caliente aromática + Masaje capilar y facial',
  'Parches de ojeras con colágeno dorado',
  'Mascarilla de carbón activado exfoliante',
  'Pigmentación barba y perfilado',
  'Perfume de larga duración',
  'Perfilado y toalla caliente para barba'
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'corte-sencillo',
    name: 'Corte Sencillo',
    description: 'Corte clásico o degradado moderno a tu gusto con asesoría de imagen.',
    price: 17000,
    image: 'https://assets.olaclick.app/companies/products/images/800/9e515ee0-6157-45ed-a4d4-0161d1658a1c.jpeg',
    badge: 'Popular',
    includedTreatmentsCount: 0,
    allowsDrink: true
  },
  {
    id: 'con-barba',
    name: 'Corte + Barba',
    description: 'Corte completo con perfilado, rebaje y alineación de barba profesional.',
    price: 19000,
    image: 'https://assets.olaclick.app/companies/products/images/800/6478c69e-4cc3-48b2-8bbd-d1e6a9c928ea.png',
    badge: 'Recomendado',
    includedTreatmentsCount: 0,
    allowsDrink: true
  },
  {
    id: 'con-barba-cejas',
    name: 'Corte + Barba + Cejas',
    description: 'Combo completo de corte, alineado de barba y perfilado limpio de cejas.',
    price: 20000,
    image: 'https://assets.olaclick.app/companies/products/images/800/82c88ab5-4019-47fa-aba6-780e48c04279.jpeg',
    badge: 'Combo',
    includedTreatmentsCount: 0,
    allowsDrink: true
  },
  {
    id: 'vip-clasico',
    name: 'VIP Clásico',
    description: 'Corte + Bebida de cortesía + 1 Tratamiento facial o cuidado gratis.',
    price: 22000,
    image: 'https://assets.olaclick.app/companies/products/images/800/5af4f41c-fc34-48c4-a0d3-2f1e859afee8.png',
    badge: '⭐ VIP 1',
    includedTreatmentsCount: 1,
    allowsDrink: true,
    availableTreatments: TREATMENTS_VIP_CLASICO
  },
  {
    id: 'vip-full',
    name: 'VIP Full',
    description: 'Corte + Barba + Bebida + 1 Tratamiento especializado a elección.',
    price: 25000,
    image: 'https://assets.olaclick.app/companies/products/images/800/78f31b25-f321-4102-86a8-0ce112ed29d5.png',
    badge: '🔥 El Más Pedido',
    includedTreatmentsCount: 1,
    allowsDrink: true,
    availableTreatments: TREATMENTS_VIP_FULL
  },
  {
    id: 'premium-todo-incluido',
    name: 'Premium Todo Incluido',
    description: 'Experiencia completa: Corte + Barba + Bebida + 2 Tratamientos exclusivos.',
    price: 30000,
    image: 'https://assets.olaclick.app/companies/products/images/800/6333ce7d-98a8-4cd6-b4a6-2e681442ba13.png',
    badge: '👑 Experiencia Total',
    includedTreatmentsCount: 2,
    allowsDrink: true,
    availableTreatments: TREATMENTS_PREMIUM
  }
];

export const EXTRA_PRODUCTS: ExtraProduct[] = [
  {
    id: 'cerveza-michelada',
    name: 'Cerveza Fría Michelada',
    description: 'Cerveza bien fría servida con vaso escarchado de sal y limón.',
    price: 6000,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1608270199047-9ea822f30d89?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'perfume-30ml-feromonas',
    name: 'Perfume 30ml (Feromonas / Fijador Extra)',
    description: 'Aroma masculino de alta proyección con fijador reforzado.',
    price: 15000,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'perfume-30ml-sencillo',
    name: 'Perfume 30ml de Bolsillo',
    description: 'Fragancia compacta ideal para llevar siempre contigo.',
    price: 13000,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'perfume-60ml',
    name: 'Perfume 60ml JM Selección',
    description: 'Presentación grande con notas amaderadas y frescas duraderas.',
    price: 20000,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pigmentacion-barba',
    name: 'Pigmentación Barba Extra',
    description: 'Relleno de zonas claras y definición oscura de la barba.',
    price: 5000,
    category: 'servicios_extra'
  },
  {
    id: 'cejas-raya',
    name: 'Cejas y Raya Estilizada',
    description: 'Línea de diseño en el corte y perfilado fino de cejas.',
    price: 3000,
    category: 'servicios_extra'
  },
  {
    id: 'platanos-snack',
    name: 'Platanitos / Snack',
    description: 'Para acompañar tu bebida mientras esperas tu turno.',
    price: 2000,
    category: 'bebidas'
  },
  {
    id: 'estuche-silicon',
    name: 'Estuche de Silicón Protector',
    description: 'Para modelos iPhone y Android (consulta disponibilidad de colores).',
    price: 20000,
    category: 'accesorios'
  },
  {
    id: 'vidrio-templado',
    name: 'Vidrio Templado 9D Instalado',
    description: 'Protector de pantalla resistente anti-rayones y caídas.',
    price: 20000,
    category: 'accesorios'
  }
];
