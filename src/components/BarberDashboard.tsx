import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  DollarSign, 
  Settings, 
  Scissors,
  Check
} from 'lucide-react';
import { Order, OrderStatus, BarberSettings } from '../types';
import { subscribeToOrders, updateOrderStatus, formatCOP, generateWhatsAppLink } from '../services/orders';
import { soundService } from '../services/sound';

interface BarberDashboardProps {
  settings: BarberSettings;
  onUpdateSettings: (settings: BarberSettings) => void;
  onBackToKiosk: () => void;
}

export const BarberDashboard: React.FC<BarberDashboardProps> = ({
  settings,
  onUpdateSettings,
  onBackToKiosk
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [localSettings, setLocalSettings] = useState<BarberSettings>(settings);

  // Subscribe to real-time orders
  useEffect(() => {
    let initialLoad = true;

    const unsubscribe = subscribeToOrders((newOrders, isUpdate) => {
      setOrders(newOrders);
      // Play sound if a new order arrives after initial load
      if (!initialLoad && isUpdate && soundEnabled) {
        soundService.playOrderNotification();
      }
      initialLoad = false;
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    soundService.playTapSound();
    await updateOrderStatus(orderId, newStatus);
  };

  const handleTestSound = () => {
    soundService.playOrderNotification();
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter((o) => o.status === filter);

  // Calculate Metrics
  const totalIncome = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-dark-800 border-b border-dark-700 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToKiosk}
            className="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modo Kiosco Tablet</span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-dark-700"></div>

          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-white">Panel de Control Barbero</h1>
            <p className="text-xs text-slate-400">Atención en vivo para {settings.barberName}</p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-2.5">
          {/* Sound Test / Toggle */}
          <button
            onClick={handleTestSound}
            className="flex items-center space-x-1.5 bg-dark-700 hover:bg-dark-600 text-gold-400 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
            title="Probar timbre de notificación"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Probar Alerta</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-dark-700 text-slate-400 border-dark-600'
            }`}
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-300 hover:text-white transition-colors"
            title="Ajustes de la Barbería"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 shadow">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Estimado</p>
              <h3 className="text-lg sm:text-2xl font-black text-white">{formatCOP(totalIncome)}</h3>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pendientes</p>
              <h3 className="text-lg sm:text-2xl font-black text-amber-400">{pendingCount}</h3>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">En Atención</p>
              <h3 className="text-lg sm:text-2xl font-black text-blue-400">{inProgressCount}</h3>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-4 sm:p-5 flex items-center space-x-4 shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Atendidos</p>
              <h3 className="text-lg sm:text-2xl font-black text-emerald-400">{completedCount}</h3>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-gold-500 text-dark-900' : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'pending' ? 'bg-amber-500 text-dark-900' : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            🟡 Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            🔵 En Proceso ({inProgressCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'completed' ? 'bg-emerald-500 text-dark-900' : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            🟢 Completados ({completedCount})
          </button>
        </div>

        {/* Orders Feed */}
        {filteredOrders.length === 0 ? (
          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-dark-700 mx-auto flex items-center justify-center text-3xl">
              💈
            </div>
            <h4 className="text-lg font-bold text-white">No hay órdenes en esta lista</h4>
            <p className="text-xs">Cuando un cliente ordene desde la tablet aparecerá aquí automáticamente con sonido.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className={`bg-dark-800 border rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                    order.status === 'pending'
                      ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                      : order.status === 'in_progress'
                      ? 'border-blue-500/50'
                      : 'border-dark-700/80 opacity-90'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header of Card */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-base text-gold-400">#{order.orderNumber}</span>
                          <h4 className="font-bold text-white text-base">{order.customerName}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{formattedDate}</p>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : order.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {order.status === 'pending'
                          ? 'Pendiente'
                          : order.status === 'in_progress'
                          ? 'En Atención'
                          : 'Completado'}
                      </span>
                    </div>

                    {/* Items detail list */}
                    <div className="bg-dark-900/80 rounded-2xl p-3 border border-dark-700/60 space-y-2 text-xs">
                      {order.items.map((it) => (
                        <div key={it.id} className="border-b border-dark-700/40 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex justify-between font-semibold text-white">
                            <span>• {it.name} (x{it.quantity})</span>
                            <span className="text-gold-400">{formatCOP(it.price * it.quantity)}</span>
                          </div>
                          {it.selectedTreatments && it.selectedTreatments.length > 0 && (
                            <p className="text-[11px] text-slate-300 pl-2 mt-0.5">
                              ✨ <span className="text-gold-400">Tratamiento:</span> {it.selectedTreatments.join(', ')}
                            </p>
                          )}
                          {it.selectedDrink && (
                            <p className="text-[11px] text-slate-300 pl-2">
                              🥤 <span className="text-blue-400">Bebida:</span> {it.selectedDrink}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment & Notes */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="bg-dark-700 text-slate-300 px-2.5 py-1 rounded-lg font-medium uppercase text-[10px]">
                        💳 {order.paymentMethod}
                      </span>
                      <span className="text-base font-black text-white">{formatCOP(order.total)}</span>
                    </div>

                    {order.notes && (
                      <div className="bg-dark-900/60 p-2 rounded-xl text-[11px] text-amber-300 border border-dark-700">
                        <strong>Nota:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions for barber */}
                  <div className="mt-5 pt-3 border-t border-dark-700/70 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'in_progress')}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>Atender</span>
                        </button>
                      )}

                      {order.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Cobrado / Listo</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'pending')}
                          className="w-full bg-dark-700 hover:bg-dark-600 text-slate-400 py-2 rounded-xl text-xs transition-colors"
                        >
                          Reabrir orden
                        </button>
                      )}

                      {/* WhatsApp Chat link */}
                      <a
                        href={generateWhatsAppLink(order, settings)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-dark-700 hover:bg-[#25D366] hover:text-dark-900 text-slate-200 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Configuración del Local</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold">Número de WhatsApp Barbero (con código país):</label>
                <input
                  type="text"
                  value={localSettings.phone}
                  onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl p-2.5 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Número de Nequi:</label>
                <input
                  type="text"
                  value={localSettings.nequiNumber}
                  onChange={(e) => setLocalSettings({ ...localSettings, nequiNumber: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl p-2.5 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold">Cuenta Bancolombia / A la mano:</label>
                <input
                  type="text"
                  value={localSettings.bancolombiaAccount}
                  onChange={(e) => setLocalSettings({ ...localSettings, bancolombiaAccount: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl p-2.5 text-white mt-1"
                />
              </div>

              {/* QR Upload Section */}
              <div className="border-t border-dark-700/80 pt-3 space-y-3">
                <span className="text-gold-400 font-bold block text-xs uppercase tracking-wider">
                  📸 Fotos de tus Códigos QR Oficiales (Nequi / Bancolombia)
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Descarga o toma captura a tu QR en tu app Nequi/Bancolombia y súbelo aquí para que los clientes lo escaneen directamente sin errores.
                </p>

                {/* Nequi QR Uploader */}
                <div className="bg-dark-900/80 p-3 rounded-2xl border border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-bold text-xs">QR Oficial de Nequi</span>
                    {localSettings.nequiQrImage && (
                      <button
                        type="button"
                        onClick={() => setLocalSettings({ ...localSettings, nequiQrImage: undefined })}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                  {localSettings.nequiQrImage && (
                    <img
                      src={localSettings.nequiQrImage}
                      alt="Preview QR Nequi"
                      className="w-20 h-20 object-contain rounded-lg border border-purple-800/60 bg-white p-1"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setLocalSettings({ ...localSettings, nequiQrImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-300 hover:file:bg-purple-900/60 cursor-pointer"
                  />
                </div>

                {/* Bancolombia QR Uploader */}
                <div className="bg-dark-900/80 p-3 rounded-2xl border border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold text-xs">QR Oficial de Bancolombia</span>
                    {localSettings.bancolombiaQrImage && (
                      <button
                        type="button"
                        onClick={() => setLocalSettings({ ...localSettings, bancolombiaQrImage: undefined })}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                  {localSettings.bancolombiaQrImage && (
                    <img
                      src={localSettings.bancolombiaQrImage}
                      alt="Preview QR Bancolombia"
                      className="w-20 h-20 object-contain rounded-lg border border-amber-800/60 bg-white p-1"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setLocalSettings({ ...localSettings, bancolombiaQrImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-900/40 file:text-amber-300 hover:file:bg-amber-900/60 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold">WiFi Nombre (SSID):</label>
                  <input
                    type="text"
                    value={localSettings.wifiSsid}
                    onChange={(e) => setLocalSettings({ ...localSettings, wifiSsid: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl p-2.5 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">WiFi Contraseña:</label>
                  <input
                    type="text"
                    value={localSettings.wifiPass}
                    onChange={(e) => setLocalSettings({ ...localSettings, wifiPass: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl p-2.5 text-white mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-dark-700">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onUpdateSettings(localSettings);
                  setShowSettingsModal(false);
                }}
                className="bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
