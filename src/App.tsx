import { useState, useEffect } from 'react';
import { ServiceItem, ExtraProduct, CartItem, Order, PaymentMethod, BarberSettings, TurnType } from './types';
import { DEFAULT_BARBER_SETTINGS } from './data/catalog';
import { createOrder, subscribeToOrders, openWhatsAppDirectly } from './services/orders';
import { KioskHeader } from './components/KioskHeader';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ServiceSelector } from './components/ServiceSelector';
import { PackageCustomizerModal } from './components/PackageCustomizerModal';
import { CrossSellingModal } from './components/CrossSellingModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { SuccessScreen } from './components/SuccessScreen';
import { BarberDashboard } from './components/BarberDashboard';
import { QueueModal } from './components/QueueModal';

export function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'catalog' | 'success' | 'dashboard'>('welcome');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'servicios' | 'extras'>('servicios');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showCrossSelling, setShowCrossSelling] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [settings, setSettings] = useState<BarberSettings>(() => {
    const saved = localStorage.getItem('barberjeff_settings');
    return saved ? JSON.parse(saved) : DEFAULT_BARBER_SETTINGS;
  });

  // Track active orders count for queue button badge
  useEffect(() => {
    const unsubscribe = subscribeToOrders((allOrders) => {
      const active = allOrders.filter((o) => o.status === 'pending' || o.status === 'in_progress').length;
      setActiveOrdersCount(active);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateSettings = (newSettings: BarberSettings) => {
    setSettings(newSettings);
    localStorage.setItem('barberjeff_settings', JSON.stringify(newSettings));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add customized package / service to cart
  const handleAddCustomizedService = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setSelectedService(null);
    // After selecting a haircut/package, prompt cross-selling upsell!
    setShowCrossSelling(true);
  };

  // Direct add extra product to cart
  const handleAddExtra = (extra: ExtraProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.baseId === extra.id);
      if (existing) {
        return prev.map((ci) => (ci.baseId === extra.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
      }
      return [
        ...prev,
        {
          id: `${extra.id}-${Date.now()}`,
          baseId: extra.id,
          name: extra.name,
          price: extra.price,
          quantity: 1,
          type: 'extra',
          image: extra.image
        }
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToPayment = () => {
    setShowCrossSelling(false);
    setShowCartDrawer(false);
    setShowPaymentModal(true);
  };

  const handleSubmitOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    paymentMethod: PaymentMethod;
    turnType?: TurnType;
    preferredTime?: string;
    notes?: string;
  }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const created = await createOrder({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      turnType: orderData.turnType || 'sala_espera',
      preferredTime: orderData.preferredTime,
      paymentMethod: orderData.paymentMethod,
      items: cartItems,
      total,
      notes: orderData.notes
    });

    setLastOrder(created);
    setCartItems([]);
    setShowPaymentModal(false);
    setCurrentView('success');

    // Automatically trigger WhatsApp in background/tab
    openWhatsAppDirectly(created, settings);
  };

  const handleResetKiosk = () => {
    setCartItems([]);
    setSelectedService(null);
    setShowCrossSelling(false);
    setShowCartDrawer(false);
    setShowPaymentModal(false);
    setLastOrder(null);
    setCurrentView('welcome');
  };

  if (currentView === 'dashboard') {
    return (
      <BarberDashboard
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onBackToKiosk={() => setCurrentView('welcome')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-gold-500 selection:text-black">
      {/* Kiosk Header (Always present in kiosk mode) */}
      <KioskHeader
        settings={settings}
        cartCount={cartCount}
        onOpenCart={() => setShowCartDrawer(true)}
        onGoToDashboard={() => setCurrentView('dashboard')}
        onOpenQueue={() => setShowQueueModal(true)}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentView('catalog')} />
        )}

        {currentView === 'catalog' && (
          <ServiceSelector
            activeTab={activeCatalogTab}
            onTabChange={setActiveCatalogTab}
            onSelectService={(service) => {
              if (service.includedTreatmentsCount > 0 || service.allowsDrink) {
                setSelectedService(service);
              } else {
                handleAddCustomizedService({
                  id: `${service.id}-${Date.now()}`,
                  baseId: service.id,
                  name: service.name,
                  price: service.price,
                  quantity: 1,
                  type: 'service',
                  image: service.image
                });
              }
            }}
            onAddExtraToCart={handleAddExtra}
            cartItems={cartItems}
          />
        )}

        {currentView === 'success' && lastOrder && (
          <SuccessScreen
            order={lastOrder}
            settings={settings}
            onReset={handleResetKiosk}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      {selectedService && (
        <PackageCustomizerModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onAddToCart={handleAddCustomizedService}
        />
      )}

      {showCrossSelling && (
        <CrossSellingModal
          onClose={() => setShowCrossSelling(false)}
          onContinueToPayment={handleProceedToPayment}
          onAddExtra={handleAddExtra}
          cartItems={cartItems}
        />
      )}

      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToPayment}
      />

      {showPaymentModal && (
        <PaymentModal
          items={cartItems}
          settings={settings}
          onClose={() => setShowPaymentModal(false)}
          onSubmitOrder={handleSubmitOrder}
        />
      )}

      <QueueModal
        isOpen={showQueueModal}
        onClose={() => setShowQueueModal(false)}
        onOpenAdmin={() => {
          setShowQueueModal(false);
          setCurrentView('dashboard');
        }}
      />
    </div>
  );
}

export default App;
