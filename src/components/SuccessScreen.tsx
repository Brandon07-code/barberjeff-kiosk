import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { CheckCircle2, MessageCircle, RotateCcw, QrCode } from 'lucide-react';
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
  const [countdown, setCountdown] = useState(30);
  const [whatsappQrUrl, setWhatsappQrUrl] = useState<string>('');

  const whatsappUrl = generateWhatsAppLink(order, settings);

  useEffect(() => {
    // 1. Play success sound
    soundService.playSuccessSound();

    // 2. Confetti in Black & Gold
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5D77F', '#FFFFFF', '#AA820A']
      });
    } catch {
      // ignore
    }

    // 3. Generate WhatsApp direct QR code for client's personal phone!
    QRCode.toDataURL(whatsappUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then((url) => setWhatsappQrUrl(url))
      .catch((err) => console.error('Error generating WhatsApp QR:', err));

    // 4. Countdown to auto-reset tablet
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
  }, [onReset, whatsappUrl]);

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-dark-900 border border-gold-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-gold-500/10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-gold-500/15 text-gold-400 rounded-full flex items-center justify-center mx-auto border border-gold-500/40 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400 bg-gold-500/10 px-3.5 py-1 rounded-full border border-gold-500/30">
            Orden #{order.orderNumber} • Registrada
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            ¡Listo, {order.customerName}!
          </h2>
          <p className="text-sm text-slate-300">
            Tu pedido y turno quedaron registrados en el sistema de <strong className="text-gold-400">JyM</strong>.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-dark-850 rounded-2xl p-4 border border-dark-750 text-left space-y-2 text-xs text-slate-300">
          <div className="flex justify-between border-b border-dark-700/60 pb-2">
            <span className="font-semibold text-slate-400">Total a pagar:</span>
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

        {/* WhatsApp QR & Button for tablet flow */}
        <div className="bg-black/60 rounded-3xl p-5 border border-gold-500/25 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>Envía tu confirmación por WhatsApp a Jeffer</span>
          </div>

          {/* If on tablet: QR to scan from personal phone */}
          {whatsappQrUrl && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-dark-900 p-3.5 rounded-2xl border border-dark-750">
              <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg">
                <img src={whatsappQrUrl} alt="QR WhatsApp" className="w-28 h-28 object-contain" />
              </div>
              <div className="text-left text-xs space-y-1">
                <p className="font-bold text-white flex items-center space-x-1">
                  <QrCode className="w-3.5 h-3.5 text-gold-400" />
                  <span>¿Estás en la tablet del local?</span>
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Apunta la cámara de tu celular a este código para abrir WhatsApp en tu propio teléfono con el pedido ya redactado para Jeffer.
                </p>
              </div>
            </div>
          )}

          {/* Direct WhatsApp button (if customer is on their own device or tablet has WhatsApp) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-emerald-900/20 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-black" />
            <span>Abrir WhatsApp Ahora</span>
          </a>
        </div>

        {/* Return Button */}
        <div>
          <button
            onClick={onReset}
            className="w-full py-3 rounded-2xl bg-dark-800 hover:bg-dark-750 text-slate-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors border border-dark-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Volver al inicio ({countdown}s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
