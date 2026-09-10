import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, RotateCcw } from 'lucide-react';
import { Order, BarberSettings } from '../types';
import { formatCOP, generateWhatsAppLink } from '../services/orders';
import { soundService } from '../services/sound';

interface SuccessScreenProps {
  order: Order;
  settings: BarberSettings;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  order,
  settings,
  onReset
}) => {
  const [countdown, setCountdown] = useState(18);

  useEffect(() => {
    // 1. Play success sound
    soundService.playSuccessSound();

    // 2. Launch Confetti celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5C518', '#006EFF', '#22D380', '#FFFFFF']
      });
    } catch {
      // ignore
    }

    // 3. Countdown to auto-reset tablet
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReset]);

  const whatsappUrl = generateWhatsAppLink(order, settings);

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            Orden #{order.orderNumber}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            ¡Listo, {order.customerName}!
          </h2>
          <p className="text-sm text-slate-300">
            Jeffer ya recibió tu solicitud en tiempo real y te llamará en breve.
          </p>
        </div>

        {/* Order Details Mini-Card */}
        <div className="bg-dark-900/80 rounded-2xl p-4 border border-dark-700/80 text-left space-y-2 text-xs text-slate-300">
          <div className="flex justify-between border-b border-dark-700/60 pb-2">
            <span className="font-semibold text-slate-400">Total:</span>
            <span className="font-bold text-gold-400 text-sm">{formatCOP(order.total)}</span>
          </div>
          <div className="flex justify-between border-b border-dark-700/60 pb-2">
            <span className="font-semibold text-slate-400">Método de pago:</span>
            <span className="font-medium text-white uppercase text-[11px]">{order.paymentMethod}</span>
          </div>
          <div className="pt-1 text-[11px] text-slate-400">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between py-0.5">
                <span>• {it.name} (x{it.quantity})</span>
                <span>{formatCOP(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Button to open WhatsApp directly */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-dark-900 font-bold text-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <MessageCircle className="w-5 h-5 text-dark-900" />
            <span>Ver mi orden en WhatsApp</span>
          </a>

          <button
            onClick={onReset}
            className="w-full py-3 rounded-2xl bg-dark-700 hover:bg-dark-600 text-slate-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Volver al inicio ({countdown}s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
