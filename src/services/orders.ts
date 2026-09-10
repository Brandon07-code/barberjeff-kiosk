import { Order, OrderStatus, BarberSettings } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'barberjeff_orders';
const ORDER_COUNTER_KEY = 'barberjeff_order_counter';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('barberjeff_orders_channel')
  : null;

// Format COP Currency
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Generate sequential order number
function getNextOrderNumber(): number {
  const current = Number(localStorage.getItem(ORDER_COUNTER_KEY) || '100');
  const next = current + 1;
  localStorage.setItem(ORDER_COUNTER_KEY, String(next));
  return next;
}

// Get orders from LocalStorage
function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save orders to LocalStorage
function saveLocalOrders(orders: Order[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'ORDERS_UPDATED', orders });
  }
}

// Create a new order
export async function createOrder(
  data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>
): Promise<Order> {
  const orderNumber = getNextOrderNumber();
  const createdAt = Date.now();
  const newOrder: Order = {
    ...data,
    id: 'ord_' + Math.random().toString(36).substring(2, 9),
    orderNumber,
    status: 'pending',
    createdAt
  };

  // 1. Firebase sync if available
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...newOrder,
        orderNumber,
        status: 'pending',
        createdAt
      });
      newOrder.id = docRef.id;
    } catch (err) {
      console.error('Error saving to Firebase:', err);
    }
  }

  // 2. Always persist locally for offline/instant resilience
  const currentOrders = getLocalOrders();
  const updated = [newOrder, ...currentOrders];
  saveLocalOrders(updated);

  return newOrder;
}

// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (err) {
      console.error('Error updating Firebase order status:', err);
    }
  }

  const current = getLocalOrders();
  const updated = current.map(o => (o.id === orderId ? { ...o, status } : o));
  saveLocalOrders(updated);
}

// Listen for orders in real time
export function subscribeToOrders(callback: (orders: Order[], isNew?: boolean) => void): () => void {
  // If Firebase is configured, listen to Firestore
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
        });
        saveLocalOrders(orders);
        callback(orders);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firebase snapshot listener failed, falling back to local channel:', err);
    }
  }

  // Fallback / local realtime listener using BroadcastChannel and storage events
  callback(getLocalOrders());

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'ORDERS_UPDATED') {
      callback(e.data.orders, true);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      callback(getLocalOrders(), true);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

// Build WhatsApp text and URL
export function generateWhatsAppLink(order: Order, settings: BarberSettings): string {
  const paymentLabels: Record<string, string> = {
    nequi: 'Transferencia Nequi (QR)',
    bancolombia: 'Transferencia Bancolombia (QR)',
    efectivo: 'Efectivo en caja'
  };

  let msg = `💈 *NUEVO PEDIDO EN TABLET #${order.orderNumber}* 💈\n\n`;
  msg += `👤 *Cliente:* ${order.customerName}\n`;
  if (order.customerPhone) {
    msg += `📱 *Teléfono:* ${order.customerPhone}\n`;
  }
  msg += `\n*Detalle del Pedido:*\n`;

  order.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.name}* (x${item.quantity}) - ${formatCOP(item.price * item.quantity)}\n`;
    if (item.selectedTreatments && item.selectedTreatments.length > 0) {
      msg += `   ✨ _Tratamientos:_ ${item.selectedTreatments.join(', ')}\n`;
    }
    if (item.selectedDrink) {
      msg += `   🥤 _Bebida cortesía:_ ${item.selectedDrink}\n`;
    }
  });

  msg += `\n💰 *Total:* ${formatCOP(order.total)}\n`;
  msg += `💳 *Método de pago:* ${paymentLabels[order.paymentMethod] || order.paymentMethod}\n`;
  if (order.notes) {
    msg += `📝 *Nota:* ${order.notes}\n`;
  }
  msg += `\n_Enviado automáticamente desde la Tablet de BarberJeff._`;

  const encoded = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send?phone=${settings.phone}&text=${encoded}`;
}
