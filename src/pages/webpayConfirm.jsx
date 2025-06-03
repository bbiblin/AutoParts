import { useEffect, useState } from 'react';
import axios from 'axios';

const WebPayConfirm = () => {
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token_ws = urlParams.get('token_ws');

    if (!token_ws) {
      setError('Token de pago no encontrado en la URL');
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await axios.post('http://localhost:5374/webpay/confirm', {
          token_ws
        });
        setPaymentResult(response.data.webpay);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al confirmar el pago');
      } finally {
        setLoading(false);
      }
    };
 
    confirmPayment();
  }, []);

  if (loading) return <div className="p-4">Confirmando transacción con WebPay...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {paymentResult.status === 'AUTHORIZED' ? '✅ Pago Aprobado' : '❌ Pago Rechazado'}
      </h2>

      <div className="text-sm">
        <p><strong>Monto:</strong> ${paymentResult.amount}</p>
        <p><strong>Estado:</strong> {paymentResult.status}</p>
        <p><strong>Orden de Compra:</strong> {paymentResult.buy_order}</p>
        <p><strong>Fecha Transacción:</strong> {paymentResult.transaction_date}</p>
        <p><strong>Autorización:</strong> {paymentResult.authorization_code || 'N/A'}</p>
        <p><strong>Tipo de Pago:</strong> {paymentResult.payment_type_code}</p>
        <p><strong>Últimos 4 dígitos:</strong> {paymentResult.card_detail.card_number || 'N/A'}</p>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-blue-500 underline">Volver al inicio</a>
      </div>
    </div>
  );
};

export default WebPayConfirm;
