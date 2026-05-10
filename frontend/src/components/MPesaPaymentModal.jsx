import { useState, useEffect } from 'react';
import { X, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function MPesaPaymentModal({ order, onClose, onPaymentSent }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSent, setPaymentSent] = useState(false);

  // Auto-close modal and trigger onPaymentSent after success
  useEffect(() => {
    if (paymentSent) {
      const timer = setTimeout(() => {
        if (onPaymentSent) {
          onPaymentSent(phoneNumber);
        }
        onClose();
      }, 3000); // Show success message for 3 seconds then close
      
      return () => clearTimeout(timer);
    }
  }, [paymentSent, phoneNumber, onPaymentSent, onClose]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Format phone number (254XXXXXXXXX)
    if (value.startsWith('0')) {
      value = '254' + value.substring(1);
    } else if (!value.startsWith('254')) {
      value = '254' + value;
    }
    setPhoneNumber(value);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid M-Pesa phone number');
      return;
    }

    setLoading(true);

    try {
      // Call the M-Pesa STK push endpoint
      const response = await api.post('/mpesa/stk-push', {
        phone: phoneNumber,
        amount: order.totalAmount,
        orderId: order._id,
        reference: order.orderNumber
      });

      if (response.data.success) {
        setPaymentSent(true);
        // Don't call onPaymentSent here - let the useEffect handle it after 3 seconds
      } else {
        setError(response.data.error || 'Failed to initiate payment');
      }
    } catch (err) {
      // Handle different error types
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to initiate M-Pesa payment. Please try again.');
      }
      console.error('M-Pesa Payment Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-charcoal">M-Pesa Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!paymentSent ? (
            <>
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Order Amount</p>
                <p className="text-3xl font-bold text-charcoal">
                  KES {order?.totalAmount?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Order #{order?.orderNumber}</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  You will receive an M-Pesa STK prompt on your phone. Enter your M-Pesa PIN to complete the payment.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be the phone number registered with M-Pesa
                  </p>
                </div>

                {error && (
                  <div className="flex gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Send M-Pesa Prompt'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by M-Pesa
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="flex justify-center animate-pulse">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal">Payment Initiated!</h3>
                <p className="text-gray-600">
                  An M-Pesa STK prompt has been sent to <strong>{phoneNumber}</strong>
                </p>
                <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-4 text-sm text-green-900 space-y-2 border border-green-200">
                  <p className="font-semibold">📱 Next Steps:</p>
                  <p>1. Check your phone for the M-Pesa prompt</p>
                  <p>2. Enter your M-Pesa PIN</p>
                  <p>3. Payment will be confirmed</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    ⏱️ Redirecting to your orders in a moment...
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
