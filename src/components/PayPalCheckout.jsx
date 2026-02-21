import { useState } from 'react';

const PayPalCheckout = ({ orderId, amount, email, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayWithPayPal = async () => {
    setLoading(true);
    setError('');

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

      if (data.approveUrl) {
        // Redirigir al usuario a PayPal para completar el pago
        window.location.href = data.approveUrl;
      } else if (data.id) {
        // Fallback: usar el link directo de PayPal
        window.location.href = `https://www.paypal.com/checkoutnow?token=${data.id}`;
      } else {
        throw new Error(data.error || 'No se pudo crear la orden de PayPal');
      }
    } catch (err) {
      console.error('Error iniciando pago PayPal:', err);
      setError('Error al conectar con PayPal. Intenta nuevamente.');
      setLoading(false);
      onError?.(err);
    }
  };

  return (
    <div className="paypal-checkout space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayWithPayPal}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #0070ba, #003087)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(0, 112, 186, 0.4)'
        }}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Conectando con PayPal...</span>
          </>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 6.5C19.5 9.5 17 12 14 12H11.5L10.5 18H7L10 4H15C17.5 4 19.5 4.5 19.5 6.5Z" fill="#ffffff" fillOpacity="0.8"/>
              <path d="M17 8.5C17 11 15 13 12.5 13H10.5L9.5 18.5H7L9.5 5H13.5C15.5 5 17 6.5 17 8.5Z" fill="white"/>
            </svg>
            <span>Pagar con PayPal</span>
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-400 text-xs">
          Serás redirigido a PayPal para completar el pago de forma segura
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Puedes pagar con tu cuenta PayPal o tarjeta de crédito/débito internacional
        </p>
      </div>
    </div>
  );
};

export default PayPalCheckout;
