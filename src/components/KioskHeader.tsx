import React, { useState } from 'react';
import { Wifi, ShoppingBag, ShieldCheck, X } from 'lucide-react';
import { BarberSettings } from '../types';
import { soundService } from '../services/sound';

interface KioskHeaderProps {
  settings: BarberSettings;
  cartCount: number;
  onOpenCart: () => void;
  onGoToDashboard: () => void;
  onOpenQueue: () => void;
  activeOrdersCount: number;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onGoToDashboard,
  onOpenQueue,
  activeOrdersCount
}) => {
  const [showWifiModal, setShowWifiModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-gold-500/20 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-black via-dark-800 to-gold-600/40 border-2 border-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20 text-gold-400 font-black text-sm tracking-wider">
                JyM
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-lg text-white tracking-wider">JyM</h1>
                <span className="text-[10px] uppercase font-extrabold tracking-widest bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded border border-gold-500/30">
                  VIP
                </span>
              </div>
              <p className="text-xs text-gold-400/80 font-medium">Barbería & Perfumería</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* WiFi Button */}
            <button
              onClick={() => {
                soundService.playTapSound();
                setShowWifiModal(true);
              }}
              className="flex items-center space-x-1.5 bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-medium border border-dark-700 transition-colors shadow-sm active:scale-95"
              title="Ver clave de WiFi"
            >
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">WiFi Gratis</span>
            </button>

            {/* Turnos / Cola en vivo */}
            <button
              onClick={() => {
                soundService.playTapSound();
                onOpenQueue();
              }}
              className="flex items-center space-x-1.5 bg-dark-850 hover:bg-dark-800 text-gold-400 px-3 py-2 rounded-xl text-xs font-semibold border border-gold-500/30 transition-all active:scale-95"
              title="Ver turnos en sala"
            >
              <span>💈 Turnos</span>
              {activeOrdersCount > 0 && (
                <span className="bg-gold-500 text-black text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Cart Button with Counter */}
            <button
              onClick={() => {
                soundService.playTapSound();
                onOpenCart();
              }}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-extrabold px-4 py-2 rounded-xl text-sm transition-transform active:scale-95 shadow-lg shadow-gold-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Mi Orden</span>
              {cartCount > 0 && (
                <span className="bg-black text-gold-400 text-xs px-2 py-0.5 rounded-full font-black shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Access (Jeffer) */}
            <button
              onClick={onGoToDashboard}
              className="flex items-center space-x-1 p-2 bg-dark-850 hover:bg-dark-800 border border-dark-700 hover:border-gold-500/40 text-slate-400 hover:text-gold-400 rounded-xl text-xs transition-colors"
              title="Panel Jeffer (Admin)"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline font-semibold">Jeffer</span>
            </button>
          </div>
        </div>
      </header>

      {/* WiFi Modal */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowWifiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-dark-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <Wifi className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Conéctate al WiFi</h3>
                <p className="text-xs text-slate-400 mt-1">Disfruta de internet de alta velocidad mientras te atendemos</p>
              </div>

              <div className="bg-dark-900/80 rounded-2xl p-4 border border-dark-700 space-y-2 text-left">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Red (SSID):</span>
                  <p className="text-base font-bold text-white tracking-wide">{settings.wifiSsid}</p>
                </div>
                <div className="border-t border-dark-700/60 pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Contraseña:</span>
                  <p className="text-lg font-mono font-bold text-gold-400 tracking-wider">{settings.wifiPass}</p>
                </div>
              </div>

              <button
                onClick={() => setShowWifiModal(false)}
                className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
