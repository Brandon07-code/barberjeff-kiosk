import React, { useState } from 'react';
import { X, Check, Sparkles, Coffee, ArrowRight } from 'lucide-react';
import { ServiceItem, CartItem } from '../types';
import { COURTESY_DRINKS } from '../data/catalog';
import { formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface PackageCustomizerModalProps {
  service: ServiceItem;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const PackageCustomizerModal: React.FC<PackageCustomizerModalProps> = ({
  service,
  onClose,
  onAddToCart
}) => {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string>(COURTESY_DRINKS[0]);

  const maxTreatments = service.includedTreatmentsCount;
  const treatmentsList = service.availableTreatments || [];

  const toggleTreatment = (treatment: string) => {
    soundService.playTapSound();
    if (selectedTreatments.includes(treatment)) {
      setSelectedTreatments(selectedTreatments.filter((t) => t !== treatment));
    } else {
      if (selectedTreatments.length < maxTreatments) {
        setSelectedTreatments([...selectedTreatments, treatment]);
      } else if (maxTreatments === 1) {
        setSelectedTreatments([treatment]);
      }
    }
  };

  const isFormValid = maxTreatments === 0 || selectedTreatments.length === maxTreatments;

  const handleConfirm = () => {
    soundService.playSuccessSound();
    const cartItem: CartItem = {
      id: `${service.id}-${Date.now()}`,
      baseId: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      type: 'service',
      selectedTreatments,
      selectedDrink,
      image: service.image
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={service.image}
              alt={service.name}
              className="w-12 h-12 rounded-xl object-cover border border-dark-600 shadow"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">{service.name}</h3>
                {service.badge && (
                  <span className="text-[10px] uppercase font-extrabold bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-gold-400">{formatCOP(service.price)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Treatments Section (if applicable) */}
          {maxTreatments > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Elige tu Tratamiento Gratis</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-dark-700 text-slate-300">
                  {selectedTreatments.length} de {maxTreatments} seleccionados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {treatmentsList.map((treatment) => {
                  const isSelected = selectedTreatments.includes(treatment);
                  return (
                    <button
                      key={treatment}
                      type="button"
                      onClick={() => toggleTreatment(treatment)}
                      className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all duration-150 ${
                        isSelected
                          ? 'bg-gold-500/15 border-gold-500 text-white shadow-md shadow-gold-500/10'
                          : 'bg-dark-900/60 border-dark-700 text-slate-300 hover:border-dark-600'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium pr-2 leading-snug">{treatment}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-gold-500 text-dark-900 font-bold' : 'border border-dark-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 strokeWidth={3}" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Courtesy Drinks Section */}
          {service.allowsDrink && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold">
                <Coffee className="w-4 h-4 text-blue-400" />
                <span>Bebida de Cortesía (Incluida a $0)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COURTESY_DRINKS.map((drink) => {
                  const isSelected = selectedDrink === drink;
                  return (
                    <button
                      key={drink}
                      type="button"
                      onClick={() => {
                        soundService.playTapSound();
                        setSelectedDrink(drink);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-400 text-white font-semibold'
                          : 'bg-dark-900/50 border-dark-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs leading-tight">{drink}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-dark-700 bg-dark-900/40 shrink-0 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total a pagar</span>
            <p className="text-xl font-extrabold text-gold-400">{formatCOP(service.price)}</p>
          </div>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleConfirm}
            className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center space-x-2 shadow-lg transition-all ${
              isFormValid
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-900 hover:from-gold-400 hover:to-amber-400 active:scale-95 shadow-gold-500/20 cursor-pointer'
                : 'bg-dark-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{isFormValid ? 'Agregar a mi Orden' : `Elige ${maxTreatments - selectedTreatments.length} tratamiento`}</span>
            {isFormValid && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
