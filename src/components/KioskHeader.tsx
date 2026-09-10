import React, { useState } from 'react';
import { Wifi, ShoppingBag, ShieldCheck, X } from 'lucide-react';
import { BarberSettings } from '../types';
import { soundService } from '../services/sound';

interface KioskHeaderProps {
  settings: BarberSettings;
  cartCount: number;
  onOpenCart: () => void;
  onGoToDashboard: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onGoToDashboard
}) => {
  const [showWifiModal, setShowWifiModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <img
                src="https://assets.olaclick.app/companies/logos/92be0531-97f1-4a9b-9555-c715fc1e0cb1.png"
                alt="BarberJeff"
                className="w-11 h-11 rounded-full object-cover border-2 border-gold-400 shadow-lg shadow-gold-500/20"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-dark-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-lg text-white tracking-wide">BarberJeff</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded">VIP</span>
              </div>
              <p className="text-xs text-slate-400">Barbería & Perfumería JM</p>
            </div>
          </div>

          {/* Quick Actions for Client */}
          <div className="flex items-center space-x-2.5">
            {/* WiFi Button */}
            <button
              onClick={() => {
                soundService.playTapSound();
                setShowWifiModal(true);
              }}
              className="flex items-center space-x-1.5 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-medium border border-dark-600/60 transition-colors shadow-sm active:scale-95"
              title="Ver clave de WiFi"
            >
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">WiFi Gratis</span>
            </button>

            {/* Cart Button with Counter */}
            <button
              onClick={() => {
                soundService.playTapSound();
                onOpenCart();
              }}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-dark-900 font-bold px-4 py-2 rounded-xl text-sm transition-transform active:scale-95 shadow-md shadow-gold-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Mi Orden</span>
              {cartCount > 0 && (
                <span className="bg-dark-900 text-gold-400 text-xs px-2 py-0.5 rounded-full font-extrabold shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hidden / Subtle Admin access button */}
            <button
              onClick={onGoToDashboard}
              className="p-2 text-dark-600 hover:text-slate-400 rounded-lg transition-colors"
              title="Panel Barbero (Jeffer)"
            >
              <ShieldCheck className="w-4 h-4" />
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
