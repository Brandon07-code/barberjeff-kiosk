import React from 'react';
import { Sparkles, Plus, Check, ArrowRight, X } from 'lucide-react';
import { ExtraProduct, CartItem } from '../types';
import { EXTRA_PRODUCTS } from '../data/catalog';
import { formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface CrossSellingModalProps {
  onContinueToPayment: () => void;
  onAddExtra: (extra: ExtraProduct) => void;
  cartItems: CartItem[];
  onClose: () => void;
}

export const CrossSellingModal: React.FC<CrossSellingModalProps> = ({
  onContinueToPayment,
  onAddExtra,
  cartItems,
  onClose
}) => {
  // Top recommended upsells: Beer, Perfume with pheromones, Snack
  const featuredExtras = EXTRA_PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                ¿Te provoca algo mientras te atendemos?
              </h3>
              <p className="text-xs text-slate-400">Añade una bebida fría, perfume o snack con un solo toque</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of recommended items */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {featuredExtras.map((item) => {
            const inCart = cartItems.find((ci) => ci.baseId === item.id);
            return (
              <div
                key={item.id}
                className="bg-dark-900/70 border border-dark-700 rounded-2xl p-4 flex items-center justify-between space-x-3 hover:border-dark-600 transition-colors"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-dark-700"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                  <p className="text-sm font-extrabold text-gold-400 mt-1">{formatCOP(item.price)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playSuccessSound();
                    onAddExtra(item);
                  }}
                  className={`p-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center justify-center transition-all ${
                    inCart
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gold-500 text-dark-900 hover:bg-gold-400 shadow-sm active:scale-90'
                  }`}
                  title={inCart ? 'Sumar otro' : 'Agregar'}
                >
                  {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="p-5 sm:p-6 border-t border-dark-700 bg-dark-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onContinueToPayment}
            className="w-full sm:w-auto text-xs text-slate-400 hover:text-white py-2 px-3 text-center transition-colors"
          >
            No, gracias. Ir directo al pago →
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playTapSound();
              onContinueToPayment();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 text-dark-900 font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Continuar al Pago</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
