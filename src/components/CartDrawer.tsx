import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-dark-800 border-l border-dark-700 h-full flex flex-col shadow-2xl animate-slideInRight">
        {/* Drawer Header */}
        <div className="p-5 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 text-white font-bold text-lg">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <span>Resumen de tu Orden</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-dark-700/60 flex items-center justify-center text-3xl">
                ✂️
              </div>
              <h4 className="text-base font-bold text-white">Aún no has agregado nada</h4>
              <p className="text-xs">Explora nuestro catálogo y selecciona tu corte o paquete favorito.</p>
              <button
                onClick={onClose}
                className="mt-2 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-dark-900/80 border border-dark-700 rounded-2xl p-4 space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between space-x-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm leading-snug">{item.name}</h4>
                    <p className="text-xs font-extrabold text-gold-400 mt-0.5">
                      {formatCOP(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundService.playTapSound();
                      onRemoveItem(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Customizations details */}
                {item.selectedTreatments && item.selectedTreatments.length > 0 && (
                  <div className="text-[11px] text-slate-300 bg-dark-800/80 rounded-xl p-2 border border-dark-700/60">
                    <span className="text-gold-400 font-semibold">Tratamiento gratis:</span>{' '}
                    {item.selectedTreatments.join(', ')}
                  </div>
                )}

                {item.selectedDrink && (
                  <div className="text-[11px] text-slate-300 bg-dark-800/80 rounded-xl p-2 border border-dark-700/60">
                    <span className="text-blue-400 font-semibold">Bebida cortesía:</span> {item.selectedDrink}
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="pt-1 flex items-center justify-between border-t border-dark-700/40">
                  <span className="text-xs text-slate-400">Cantidad</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        soundService.playTapSound();
                        onUpdateQuantity(item.id, -1);
                      }}
                      className="w-7 h-7 rounded-lg bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => {
                        soundService.playTapSound();
                        onUpdateQuantity(item.id, 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-dark-700 bg-dark-900/60 shrink-0 space-y-4">
            <div className="flex items-baseline justify-between text-white">
              <span className="text-sm text-slate-300 font-medium">Total Estimado:</span>
              <span className="text-2xl font-black text-gold-400">{formatCOP(total)}</span>
            </div>

            <button
              onClick={() => {
                soundService.playTapSound();
                onProceedToCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-500 to-yellow-500 hover:from-gold-400 hover:to-amber-400 text-dark-900 font-extrabold text-base shadow-xl shadow-gold-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Confirmar y Proceder al Pago</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
