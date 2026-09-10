# 💈 BarberJeff Kiosk — Experiencia VIP en Tablet

Aplicación Web Progresiva (PWA) de autoservicio para la barbería **BarberJeff (Barbería y Perfumería JM)** en Cartago, Valle del Cauca.

Desarrollada para instalarse en la tablet del local y permitir a los clientes armar sus paquetes, elegir bebidas de cortesía y tratamientos gratis, agregar productos adicionales (cross-selling), pagar mediante QR de Nequi / Bancolombia y notificar al barbero en tiempo real tanto en pantalla como por WhatsApp.

---

## 🚀 Características Principales

1. **Pantalla de Bienvenida & Modo Kiosco:**
   - Interfaz táctil de alto impacto visual con tonos oscuros y dorados.
   - Acceso rápido a credenciales de WiFi del local (**Red:** `Barbería JM`, **Clave:** `Chepe2001`).

2. **Constructor de Paquetes Inteligente:**
   - **Cortes:** Sencillo ($17k), Con Barba ($19k), Con Barba y Cejas ($20k).
   - **VIP Clásico ($22k):** Corte + Bebida cortesía + 1 Tratamiento facial gratis.
   - **VIP Full ($25k):** Corte + Barba + Bebida cortesía + 1 Tratamiento gratis.
   - **Premium Todo Incluido ($30k):** Corte + Barba + Bebida cortesía + 2 Tratamientos exclusivos.
   - *Control de selección:* Valida automáticamente el número de inclusiones sin cobrar de más.

3. **Venta Cruzada (Cross-Selling / Upsell):**
   - Ofrece cerveza fría michelada ($6k), perfumes de feromonas ($15k), snacks y accesorios para celular antes de pasar al pago.

4. **Pasarela de Pagos con QR en Pantalla:**
   - **Nequi:** Genera código QR dinámico y muestra el número `3145549069` con botón de copiar.
   - **Bancolombia:** Muestra código QR y cuenta de Ahorros a la mano.
   - **Efectivo:** Opción de pago tradicional en caja.

5. **Notificaciones y Tiempo Real Dual:**
   - **Alerta Sonora:** Campana / caja registradora en el celular del barbero vía Web Audio API.
   - **WhatsApp:** Genera el mensaje estructurado con emojis y datos completos directo al chat de Jeffer (+57 314 554 9069).

6. **Panel de Control Barbero (`/admin`):**
   - Visualización de comandas en vivo (`Pendiente`, `En Atención`, `Completado`).
   - Métricas de ingresos del día, desglose de pagos y ajuste de teléfonos/claves.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS + Lucide React
- **Base de Datos & Realtime:** Firebase Firestore (Plan Spark 100% gratuito permanente) + fallback Offline / LocalStorage
- **Animaciones:** Canvas-Confetti + Web Audio API sintético
- **Hosting:** Optimizado para Vercel o Cloudflare Pages (Gratis de por vida)

---

## 💻 Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Construir para producción
npm run build
```

---

## ☁️ Despliegue en Vercel (100% Gratuito y Permanente)

1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub (`Brandon07-code`).
2. Haz clic en **"Add New Project"** y selecciona el repositorio `barberjeff-kiosk`.
3. Deja la configuración por defecto de Vite y haz clic en **Deploy**.
4. ¡Listo! Tendrás tu enlace permanente con SSL: `https://barberjeff.vercel.app`.
