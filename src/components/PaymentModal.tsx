import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Send, Banknote, Clock, Calendar } from 'lucide-react';
import { CartItem, PaymentMethod, BarberSettings, TurnType } from '../types';
import { formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface PaymentModalProps {
  items: CartItem[];
  settings: BarberSettings;
  onClose: () => void;
  onSubmitOrder: (data: {
    customerName: string;
    customerPhone: string;
    paymentMethod: PaymentMethod;
    turnType?: TurnType;
    preferredTime?: string;
    notes?: string;
  }) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  items,
  settings,
  onClose,
  onSubmitOrder
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [turnType, setTurnType] = useState<TurnType>('sala_espera');
  const [preferredTime, setPreferredTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('nequi');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Generate QR fallback
  useEffect(() => {
    async function generateQR() {
      try {
        let payload = '';
        if (paymentMethod === 'nequi') {
          payload = `nequi://transfer?phone=${settings.nequiNumber}&amount=${total}&reference=BarberiaJyM`;
        } else if (paymentMethod === 'bancolombia') {
          payload = `bancolombia://transfer?account=${settings.bancolombiaAccount}&amount=${total}&type=${settings.bancolombiaType}`;
        }

        if (payload) {
          const url = await QRCode.toDataURL(payload, {
            width: 280,
            margin: 1.5,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error('Error generating QR:', err);
      }
    }

    if (paymentMethod === 'nequi' || paymentMethod === 'bancolombia') {
      generateQR();
    }
  }, [paymentMethod, total, settings]);

  const copyToClipboard = (text: string) => {
    soundService.playTapSound();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        turnType,
        preferredTime: turnType === 'cita_previa' ? preferredTime : undefined,
        paymentMethod,
        notes: notes.trim()
      });
    } catch (err) {
      console.error('Error in order submit:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-dark-900 border border-gold-500/30 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-gold-500/10 relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-dark-750 flex items-center justify-between shrink-0 bg-black/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">JyM Barbería</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">Finalizar Pedido & Turno</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Total a pagar: <strong className="text-gold-400 font-extrabold text-base">{formatCOP(total)}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors border border-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Modalidad de Atención */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-gold-400">
              ¿Cómo deseas ser atendido hoy?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundService.playTapSound();
                  setTurnType('sala_espera');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  turnType === 'sala_espera'
                    ? 'bg-gold-500/15 border-gold-500 text-white shadow-md shadow-gold-500/10'
                    : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${turnType === 'sala_espera' ? 'bg-gold-500 text-black' : 'bg-dark-750 text-slate-400'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Turno en Sala de Espera</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Atención por orden de llegada con Jeffer</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playTapSound();
                  setTurnType('cita_previa');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  turnType === 'cita_previa'
                    ? 'bg-gold-500/15 border-gold-500 text-white shadow-md shadow-gold-500/10'
                    : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${turnType === 'cita_previa' ? 'bg-gold-500 text-black' : 'bg-dark-750 text-slate-400'}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Cita Previa Agendada</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ya cuadré el turno por WhatsApp</p>
                </div>
              </button>
            </div>

            {turnType === 'cita_previa' && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                  Hora acordada con Jeffer (ej. 4:30 PM):
                </label>
                <input
                  type="text"
                  placeholder="Ej. 4:00 PM"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-dark-950 border border-gold-500/30 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>
            )}
          </div>

          {/* 2. Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gold-400 mb-1.5">
                ¿A nombre de quién? *
              </label>
              <input
                type="text"
                required
                placeholder="Tu nombre (ej. Carlos)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gold-400 mb-1.5">
                Tu WhatsApp
              </label>
              <input
                type="tel"
                placeholder="310 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>
          </div>

          {/* 3. Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-bold text-gold-400">
              Selecciona Método de Pago
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* Nequi */}
              <button
                type="button"
                onClick={() => {
                  soundService.playTapSound();
                  setPaymentMethod('nequi');
                }}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  paymentMethod === 'nequi'
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-dark-950 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                  N
                </div>
                <span className="text-xs font-bold">Nequi</span>
              </button>

              {/* Bancolombia */}
              <button
                type="button"
                onClick={() => {
                  soundService.playTapSound();
                  setPaymentMethod('bancolombia');
                }}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  paymentMethod === 'bancolombia'
                    ? 'bg-amber-950/40 border-amber-400 text-white shadow-lg shadow-amber-400/10'
                    : 'bg-dark-950 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-dark-950 font-black text-xs flex items-center justify-center">
                  B
                </div>
                <span className="text-xs font-bold">Bancolombia</span>
              </button>

              {/* Efectivo */}
              <button
                type="button"
                onClick={() => {
                  soundService.playTapSound();
                  setPaymentMethod('efectivo');
                }}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-dark-950 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Efectivo</span>
              </button>
            </div>
          </div>

          {/* Dynamic Payment Details Area */}
          {paymentMethod === 'nequi' && (
            <div className="bg-purple-950/25 border border-purple-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
                <img 
                  src={settings.nequiQrImage || qrDataUrl} 
                  alt="QR Nequi Oficial" 
                  className="w-40 h-40 object-contain rounded-lg" 
                />
                <span className="text-[10px] text-purple-900 font-extrabold mt-1 uppercase tracking-wider">
                  {settings.nequiQrImage ? 'QR Oficial Nequi' : 'Escanea desde Nequi'}
                </span>
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Número Nequi:</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-0.5">
                    <span className="text-2xl font-black text-white font-mono tracking-wide">{settings.nequiNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.nequiNumber)}
                      className="p-2 rounded-xl bg-purple-800/50 text-purple-300 hover:text-white transition-colors flex items-center space-x-1 text-xs font-bold"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Titular: <strong className="text-slate-200">{settings.nequiHolder}</strong></p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-black/60 p-3 rounded-xl border border-purple-900/40 leading-relaxed">
                  <p>1. Transfiere exactamente <strong className="text-gold-400 font-bold">{formatCOP(total)}</strong>.</p>
                  <p>2. Al tocar el botón dorado, se enviará el pedido a Jeffer.</p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bancolombia' && (
            <div className="bg-amber-950/25 border border-amber-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
                <img 
                  src={settings.bancolombiaQrImage || qrDataUrl} 
                  alt="QR Bancolombia Oficial" 
                  className="w-40 h-40 object-contain rounded-lg" 
                />
                <span className="text-[10px] text-dark-900 font-extrabold mt-1 uppercase tracking-wider">
                  {settings.bancolombiaQrImage ? 'QR Oficial Bancolombia' : 'Escanea con Bancolombia'}
                </span>
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Cuenta {settings.bancolombiaType}:</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-0.5">
                    <span className="text-2xl font-black text-white font-mono tracking-wide">{settings.bancolombiaAccount}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.bancolombiaAccount)}
                      className="p-2 rounded-xl bg-amber-800/50 text-amber-300 hover:text-white transition-colors flex items-center space-x-1 text-xs font-bold"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Titular: <strong className="text-slate-200">{settings.bancolombiaHolder}</strong></p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-black/60 p-3 rounded-xl border border-amber-900/40 leading-relaxed">
                  <p>1. Transfiere <strong className="text-gold-400 font-bold">{formatCOP(total)}</strong>.</p>
                  <p>2. Al confirmar, se abrirá el WhatsApp para enviar la orden.</p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'efectivo' && (
            <div className="bg-emerald-950/25 border border-emerald-900/50 rounded-2xl p-4 sm:p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Banknote className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white">Pago en Efectivo</h4>
                <p className="text-xs text-slate-400">
                  Pagarás los <strong className="text-gold-400 font-bold">{formatCOP(total)}</strong> en caja al terminar tu servicio.
                </p>
              </div>
            </div>
          )}

          {/* 4. Indicaciones opcionales */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
              Indicaciones especiales o notas para Jeffer (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. 'Degradado medio en V', 'No bajar mucho arriba', etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-gold-400 text-sm"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-black text-base shadow-xl shadow-gold-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Guardando orden...' : 'Confirmar Pedido y Enviar a WhatsApp'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Se guardará tu turno en el sistema y se abrirá WhatsApp con el resumen listo para Jeffer.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
