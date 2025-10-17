// Crear archivo: src/components/MercadoPagoCheckout.jsx
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useState, useEffect } from 'react';

// ⚠️ Usa tu PUBLIC KEY de prueba
initMercadoPago('APP_USR-e95099e2-30e0-4a75-8139-96d4daf49d08');

const MercadoPagoCheckout = ({ orderId, subject, amount, email, onSuccess, onError }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const createPreference = async () => {
        setLoading(true);
        setErrorMessage('');
        
        try {
            console.log('Enviando datos:', { orderId, subject, amount, email });
            
            const response = await fetch('https://backendflash.onrender.com/api/mercadopago-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    subject,
                    amount,
                    email
                })
            });

            const data = await response.json();
            console.log('Respuesta del backend:', data);
            
            if (data.id) {
                setPreferenceId(data.id);
            } else {
                throw new Error(data.details || data.error || 'No se pudo crear la preferencia');
            }
        } catch (error) {
            console.error('Error creando preferencia:', error);
            setErrorMessage(error.message);
            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId && subject && amount && email) {
            createPreference();
        }
    }, [orderId, subject, amount, email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Preparando pago...</span>
            </div>
        );
    }

    if (errorMessage || !preferenceId) {
        return (
            <div className="text-center p-4">
                <p className="text-red-600 mb-2">
                    {errorMessage || 'Error al cargar el método de pago'}
                </p>
                <button 
                    onClick={createPreference}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="mercadopago-checkout">
            <Wallet 
                initialization={{ 
                    preferenceId: preferenceId 
                }}
                customization={{
                    texts: {
                        valueProp: 'smart_option',
                    },
                }}
                // ❌ NO usar onSubmit aquí - se ejecuta al crear, no al pagar
                // onSubmit={onSuccess}
                onError={(error) => {
                    console.error('Error en Wallet:', error);
                    onError?.(error);
                }}
            />
        </div>
    );
};

export default MercadoPagoCheckout;