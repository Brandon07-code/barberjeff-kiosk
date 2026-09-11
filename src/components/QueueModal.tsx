import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, Scissors } from 'lucide-react';
import { Order } from '../types';
import { subscribeToOrders, formatCOP } from '../services/orders';
import { soundService } from '../services/sound';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress');
  const completedRecent = orders.filter((o) => o.status === 'completed').slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-dark-900 border border-gold-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-gold-500/10 relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-dark-700/80 flex items-center justify-between shrink-0 bg-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
              💈
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Turnos & Pedidos en Vivo — JyM
              </h3>
              <p className="text-xs text-slate-400">Estado de atención en sala en tiempo real</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors border border-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Turno Actual en Atención */}
          {inProgressOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <Scissors className="w-4 h-4 animate-spin" />
                <span>En Sillón / Siendo Atendido Ahora</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inProgressOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-blue-950/25 border border-blue-500/40 rounded-2xl p-4 space-y-1.5 shadow-lg shadow-blue-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-black text-sm">Turno #{o.orderNumber}</span>
                      <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                        Atendiendo
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base">{o.customerName}</h4>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {o.items.map((it) => it.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Turnos en Espera */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gold-400 font-bold text-sm uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>En Sala de Espera ({pendingOrders.length})</span>
              </div>
              <span className="text-[11px] text-slate-400">Por orden de llegada</span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="bg-dark-850/60 border border-dark-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                ✨ ¡No hay turnos en cola! Pasa de una vez al sillón con Jeffer.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingOrders.map((o, idx) => (
                  <div
                    key={o.id}
                    className="bg-dark-850 border border-dark-750 hover:border-gold-500/30 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 flex items-center justify-center font-black text-sm">
                        {idx + 1}º
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-sm">{o.customerName}</span>
                          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/15 px-2 py-0.5 rounded">
                            #{o.orderNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {o.items.map((it) => it.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-gold-400">{formatCOP(o.total)}</span>
                      <p className="text-[10px] text-slate-500 uppercase">{o.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atendidos Hoy */}
          {completedRecent.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-dark-800">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Atendidos Recientemente</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {completedRecent.map((o) => (
                  <span
                    key={o.id}
                    className="bg-dark-850 border border-dark-750 text-slate-400 text-xs px-2.5 py-1 rounded-xl flex items-center space-x-1"
                  >
                    <span>✓ #{o.orderNumber} {o.customerName}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-dark-800 bg-black/60 shrink-0 flex items-center justify-between">
          <button
            onClick={() => {
              soundService.playTapSound();
              onClose();
              onOpenAdmin();
            }}
            className="text-xs text-slate-400 hover:text-gold-400 font-medium transition-colors"
          >
            🔒 Acceso exclusivo para Jeffer →
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs transition-colors shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
