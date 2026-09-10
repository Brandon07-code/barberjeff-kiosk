import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Send, Banknote } from 'lucide-react';
import { CartItem, PaymentMethod, BarberSettings } from '../types';
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('nequi');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Generate QR code based on method and amount
  useEffect(() => {
    async function generateQR() {
      try {
        let payload = '';
        if (paymentMethod === 'nequi') {
          // Standard Colombian Nequi transfer URI or human readable reference
          payload = `nequi://transfer?phone=${settings.nequiNumber}&amount=${total}&reference=BarberJeff`;
        } else if (paymentMethod === 'bancolombia') {
          payload = `bancolombia://transfer?account=${settings.bancolombiaAccount}&amount=${total}&type=${settings.bancolombiaType}`;
        }

        if (payload) {
          const url = await QRCode.toDataURL(payload, {
            width: 280,
            margin: 1.5,
            color: {
              dark: '#0B0F17',
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
        paymentMethod,
        notes: notes.trim()
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">Finalizar Pedido</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Total a pagar: <strong className="text-gold-400 font-extrabold text-sm">{formatCOP(total)}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
                ¿A nombre de quién? *
              </label>
              <input
                type="text"
                required
                placeholder="Tu nombre (ej. Carlos)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
                Tu WhatsApp (Opcional)
              </label>
              <input
                type="tel"
                placeholder="310 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300">
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
                    ? 'bg-purple-900/30 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-dark-900/60 border-dark-700 text-slate-400 hover:text-white'
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
                    ? 'bg-amber-900/30 border-amber-400 text-white shadow-lg shadow-amber-400/10'
                    : 'bg-dark-900/60 border-dark-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-dark-900 font-black text-xs flex items-center justify-center">
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
                    ? 'bg-emerald-900/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-dark-900/60 border-dark-700 text-slate-400 hover:text-white'
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
              {qrDataUrl && (
                <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0">
                  <img src={qrDataUrl} alt="QR Nequi" className="w-36 h-36 object-contain" />
                  <p className="text-[10px] text-center text-dark-900 font-bold mt-1">Escanea desde Nequi</p>
                </div>
              )}

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Número Nequi:</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-0.5">
                    <span className="text-xl font-black text-white font-mono">{settings.nequiNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.nequiNumber)}
                      className="p-1.5 rounded-lg bg-purple-800/50 text-purple-300 hover:text-white transition-colors"
                      title="Copiar número"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Titular: {settings.nequiHolder}</p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-dark-900/60 p-2.5 rounded-xl border border-purple-900/40">
                  <p>1. Transfiere exactamente <strong>{formatCOP(total)}</strong></p>
                  <p>2. Presiona el botón amarillo para confirmar tu orden.</p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bancolombia' && (
            <div className="bg-amber-950/25 border border-amber-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              {qrDataUrl && (
                <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0">
                  <img src={qrDataUrl} alt="QR Bancolombia" className="w-36 h-36 object-contain" />
                  <p className="text-[10px] text-center text-dark-900 font-bold mt-1">Escanea con Bancolombia</p>
                </div>
              )}

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Cuenta {settings.bancolombiaType}:</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-0.5">
                    <span className="text-xl font-black text-white font-mono">{settings.bancolombiaAccount}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.bancolombiaAccount)}
                      className="p-1.5 rounded-lg bg-amber-800/50 text-amber-300 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Titular: {settings.bancolombiaHolder}</p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-dark-900/60 p-2.5 rounded-xl border border-amber-900/40">
                  <p>1. Transfiere <strong>{formatCOP(total)}</strong> a la cuenta</p>
                  <p>2. Presiona Confirmar para avisarle al barbero.</p>
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
                  Pagarás los <strong>{formatCOP(total)}</strong> directamente en caja una vez finalice tu servicio.
                </p>
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
              Indicaciones especiales o cómo te gusta el corte (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. 'Bien bajito a los lados', 'No tocar mucho la barba'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-400 text-sm"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-500 to-yellow-500 hover:from-gold-400 hover:to-amber-400 text-dark-900 font-extrabold text-base shadow-xl shadow-gold-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Enviando orden a Jeffer...' : 'Enviar Pedido y Notificar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
