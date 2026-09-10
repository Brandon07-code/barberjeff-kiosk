import React from 'react';
import { Sparkles, Scissors, Wine, QrCode, ArrowRight } from 'lucide-react';
import { soundService } from '../services/sound';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    soundService.playSuccessSound();
    onStart();
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-800 via-dark-700 to-dark-900 border border-dark-600/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-gold-500/15 border border-gold-500/30 text-gold-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Kiosco Táctil de Autoservicio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Bienvenido a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-yellow-500">
              BarberJeff
            </span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Personaliza tu estilo, elige tu paquete VIP con tratamiento y bebida de cortesía incluida, y disfruta del mejor servicio de barbería en Cartago.
          </p>
        </div>
      </div>

      {/* Feature Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 sm:my-8">
        <div className="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/20">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">Cortes & VIP</h4>
            <p className="text-xs text-slate-400 mt-1 leading-snug">
              Desde corte sencillo hasta experiencias completas con toalla caliente y masaje.
            </p>
          </div>
        </div>

        <div className="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">Bebida de Cortesía</h4>
            <p className="text-xs text-slate-400 mt-1 leading-snug">
              Gaseosa fría, café o té gratis con cualquiera de nuestros servicios.
            </p>
          </div>
        </div>

        <div className="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">Paga Fácil con QR</h4>
            <p className="text-xs text-slate-400 mt-1 leading-snug">
              Transfiere al instante con Nequi o Bancolombia escaneando la pantalla.
            </p>
          </div>
        </div>
      </div>

      {/* Main Touch CTA Button */}
      <div className="text-center pb-4">
        <button
          onClick={handleStart}
          className="w-full sm:w-auto min-w-[320px] py-5 px-8 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-500 to-yellow-500 hover:from-gold-400 hover:to-amber-400 text-dark-900 font-extrabold text-lg sm:text-xl shadow-xl shadow-gold-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 mx-auto"
        >
          <span>Toca Aquí Para Ordenar</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        <p className="text-xs text-slate-500 mt-3">
          Toma la tablet y selecciona a tu gusto • Jeffer recibirá tu orden al instante
        </p>
      </div>
    </div>
  );
};
