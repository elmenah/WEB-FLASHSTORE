import { useEffect, useRef, useState } from 'react';

const PayPalCheckout = ({ orderId, amount, email, onSuccess, onError }) => {
  const paypalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sdkReady, setSdkReady] = useState(false);

  // Cargar el SDK de PayPal
  useEffect(() => {
    // Si ya existe el script, no cargarlo de nuevo
    if (document.querySelector('script[data-paypal-sdk]')) {
      if (window.paypal) {
        setSdkReady(true);
        setLoading(false);
      }
      return;
    }

    const loadScript = async () => {
      try {
        // Obtener el Client ID desde el backend
        const res = await fetch('https://backendflash.onrender.com/api/paypal/client-id');
        const { clientId } = await res.json();

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
        script.setAttribute('data-paypal-sdk', 'true');
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
          setLoading(false);
        };
        script.onerror = () => {
          setError('No se pudo cargar PayPal. Intenta nuevamente.');
          setLoading(false);
        };
        document.body.appendChild(script);
      } catch (err) {
        console.error('Error cargando PayPal SDK:', err);
        setError('Error conectando con PayPal.');
        setLoading(false);
      }
    };

    loadScript();
  }, []);

  // Renderizar botones cuando el SDK esté listo
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalRef.current) return;

    // Limpiar contenido anterior
    paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45
      },
      createOrder: async () => {
        try {
          const response = await fetch('https://backendflash.onrender.com/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: String(orderId),
              amount,
              email
            })
          });

          const data = await response.json();
          if (data.id) {
            return data.id;
          } else {
            throw new Error(data.error || 'No se pudo crear la orden');
          }
        } catch (err) {
          console.error('Error creando orden PayPal:', err);
          onError?.(err);
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          const response = await fetch(`https://backendflash.onrender.com/api/paypal/capture-order/${data.orderID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          const captureData = await response.json();
          
          if (captureData.status === 'COMPLETED') {
            console.log('Pago PayPal completado:', captureData);
            onSuccess?.(captureData);
          } else {
            throw new Error('El pago no se completó correctamente');
          }
        } catch (err) {
          console.error('Error capturando pago PayPal:', err);
          onError?.(err);
        }
      },
      onError: (err) => {
        console.error('Error PayPal buttons:', err);
        setError('Ocurrió un error con PayPal. Intenta nuevamente.');
        onError?.(err);
      },
      onCancel: () => {
        console.log('Pago PayPal cancelado por el usuario');
      }
    }).render(paypalRef.current);
  }, [sdkReady, orderId, amount, email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando PayPal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="paypal-checkout">
      <div ref={paypalRef}></div>
    </div>
  );
};

export default PayPalCheckout;
