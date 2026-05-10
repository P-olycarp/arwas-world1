import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user ? `${user.firstName} ${user.lastName}` : '',
    customerEmail: user ? user.email : '',
    customerPhone: user ? user.phone : '',
    customerCountry: user ? user.address?.country : '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-off-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif text-charcoal mb-6">Checkout</h1>
          <div className="bg-white p-12 rounded-lg">
            <p className="text-xl text-gray-custom mb-8">Your cart is empty</p>
            <a
              href="/shop"
              className="inline-block bg-charcoal text-white px-8 py-3 font-semibold hover:bg-gray-custom transition"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderSummary = () => {
    return cart
      .map(
        item =>
          `${item.quantity}x ${item.product.name} (${item.size}, ${item.color}) - KES ${(item.price * item.quantity).toLocaleString()}`
      )
      .join('\n');
  };

  const handleWhatsAppCheckout = () => {
    const summary = generateOrderSummary();
    const total = getTotalPrice();
    
    const message = encodeURIComponent(
      `Hello! I would like to place an order:\n\n${summary}\n\nTotal: KES ${total.toLocaleString()}\n\nCustomer Details:\nName: ${formData.customerName}\nEmail: ${formData.customerEmail}\nPhone: ${formData.customerPhone}\nCountry: ${formData.customerCountry}\n\nNotes: ${formData.notes || 'None'}`
    );

    // Open WhatsApp with Kenya number
    window.open(`https://wa.me/254112126757?text=${message}`, '_blank');
    clearCart();
    navigate('/');
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-off-white py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-8 sm:mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* WhatsApp Checkout Form */}
            <div className="bg-white p-6 sm:p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl sm:text-2xl font-serif text-charcoal">Place Your Order</h2>
              </div>
              <p className="text-gray-custom mb-6">
                Fill in your details and we'll send your order directly to WhatsApp for quick confirmation
              </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleWhatsAppCheckout();
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="customerCountry"
                        value={formData.customerCountry}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+254 or +968"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Special Notes / Design Details
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g., Design specifications, preferred colors, delivery deadline..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Order to WhatsApp
                  </button>
                </form>
              </div>
            </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-lg sticky top-20">
              <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="text-sm">
                    <p className="font-semibold text-charcoal">
                      {item.quantity}x {item.product.name}
                    </p>
                    <p className="text-gray-custom">
                      Size: {item.size} | {item.color}
                    </p>
                    <p className="text-charcoal font-semibold">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-custom">
                  <span>{cart.length} item(s)</span>
                  <span>KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-semibold text-charcoal">
                <span>Total</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </div>

              <p className="text-xs text-gray-custom text-center mt-6">
                Payment to be confirmed after order placement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
