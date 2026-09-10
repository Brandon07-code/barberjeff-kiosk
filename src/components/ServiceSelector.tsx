import React from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { ServiceItem, ExtraProduct, CartItem } from '../types';
import { SERVICES, EXTRA_PRODUCTS } from '../data/catalog';
import { formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface ServiceSelectorProps {
  activeTab: 'servicios' | 'extras';
  onTabChange: (tab: 'servicios' | 'extras') => void;
  onSelectService: (service: ServiceItem) => void;
  onAddExtraToCart: (extra: ExtraProduct) => void;
  cartItems: CartItem[];
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  activeTab,
  onTabChange,
  onSelectService,
  onAddExtraToCart,
  cartItems
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-8 py-4 animate-fadeIn">
      {/* Category Pills Navigation */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => {
            soundService.playTapSound();
            onTabChange('servicios');
          }}
          className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md ${
            activeTab === 'servicios'
              ? 'bg-gold-500 text-dark-900 shadow-gold-500/20 scale-105'
              : 'bg-dark-800 text-slate-300 hover:text-white border border-dark-700'
          }`}
        >
          ✂️ Cortes & Paquetes VIP
        </button>

        <button
          onClick={() => {
            soundService.playTapSound();
            onTabChange('extras');
          }}
          className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md ${
            activeTab === 'extras'
              ? 'bg-gold-500 text-dark-900 shadow-gold-500/20 scale-105'
              : 'bg-dark-800 text-slate-300 hover:text-white border border-dark-700'
          }`}
        >
          🍺 Bebidas, Perfumes & Extras
        </button>
      </div>

      {/* Services Grid */}
      {activeTab === 'servicios' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service) => {
            const isAlreadyInCart = cartItems.some((ci) => ci.baseId === service.id);
            return (
              <div
                key={service.id}
                onClick={() => {
                  soundService.playTapSound();
                  onSelectService(service);
                }}
                className="group bg-dark-800 border border-dark-700 hover:border-gold-500/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-dark-900">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>

                    {service.badge && (
                      <span className="absolute top-3 right-3 bg-gold-500 text-dark-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg">
                        {service.badge}
                      </span>
                    )}

                    {service.includedTreatmentsCount > 0 && (
                      <span className="absolute bottom-3 left-3 bg-dark-900/80 backdrop-blur-md border border-dark-700 text-gold-400 text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{service.includedTreatmentsCount} Tratamiento(s) Gratis</span>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-gold-400 transition-colors">
                        {service.name}
                      </h3>
                      <span className="font-extrabold text-lg text-gold-400">
                        {formatCOP(service.price)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                      isAlreadyInCart
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-dark-700 group-hover:bg-gold-500 text-slate-200 group-hover:text-dark-900 shadow-sm'
                    }`}
                  >
                    {isAlreadyInCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>En tu orden (Editar o sumar)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{service.includedTreatmentsCount > 0 ? 'Personalizar Paquete' : 'Seleccionar Corte'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Extras Grid */}
      {activeTab === 'extras' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {EXTRA_PRODUCTS.map((extra) => {
            const inCart = cartItems.find((ci) => ci.baseId === extra.id);
            return (
              <div
                key={extra.id}
                className="bg-dark-800 border border-dark-700 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-dark-600 transition-colors"
              >
                <div className="flex space-x-4 items-start">
                  {extra.image ? (
                    <img
                      src={extra.image}
                      alt={extra.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-dark-700 shrink-0 bg-dark-900"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-dark-700/80 border border-dark-600 flex items-center justify-center text-2xl shrink-0">
                      ✨
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base leading-snug">{extra.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{extra.description}</p>
                    <p className="text-base font-extrabold text-gold-400 pt-1">{formatCOP(extra.price)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dark-700/60 flex items-center justify-between">
                  {inCart ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-emerald-400 font-semibold">Agregado ({inCart.quantity})</span>
                      <button
                        onClick={() => {
                          soundService.playSuccessSound();
                          onAddExtraToCart(extra);
                        }}
                        className="bg-dark-700 hover:bg-dark-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 border border-dark-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Sumar otro</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        soundService.playSuccessSound();
                        onAddExtraToCart(extra);
                      }}
                      className="w-full bg-dark-700 hover:bg-gold-500 text-slate-200 hover:text-dark-900 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar a mi Orden</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
