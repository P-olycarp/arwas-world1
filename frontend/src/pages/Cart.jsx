import { useCart } from '../context/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-off-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-4 sm:mb-6">Shopping Cart</h1>
          <div className="bg-white p-6 sm:p-12 rounded-lg">
            <p className="text-lg sm:text-xl text-gray-custom mb-6 sm:mb-8">Your cart is empty</p>
            <NavLink
              to="/shop"
              className="inline-block bg-charcoal text-white px-6 sm:px-8 py-3 font-semibold hover:bg-gray-custom transition"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-off-white py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-8 sm:mb-12">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 p-4 sm:p-6 hover:bg-off-white transition"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-charcoal mb-2">
                        {item.product.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-custom mb-4">
                        <span>Size: <strong>{item.size}</strong></span>
                        <div className="flex items-center gap-2">
                          Color:
                          <div
                            className="w-4 h-4 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <p className="text-xl sm:text-2xl font-semibold text-charcoal">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-charcoal transition"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-charcoal hover:bg-off-white p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-charcoal hover:bg-off-white p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <NavLink
                to="/shop"
                className="text-charcoal font-semibold hover:text-gray-custom transition"
              >
                ← Continue Shopping
              </NavLink>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-lg sticky top-20">
              <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-custom">
                  <span>{cart.length} item(s)</span>
                  <span>KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-custom">
                  <span>Shipping</span>
                  <span>TBD</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-semibold text-charcoal mb-8">
                <span>Total</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </div>

              <NavLink
                to="/checkout"
                className="w-full block text-center bg-charcoal text-white py-3 font-semibold hover:bg-gray-custom transition mb-4"
              >
                Proceed to Checkout
              </NavLink>

              <button
                onClick={clearCart}
                className="w-full border-2 border-charcoal text-charcoal py-3 font-semibold hover:bg-charcoal hover:text-white transition"
              >
                Clear Cart
              </button>

              <p className="text-xs text-gray-custom text-center mt-6">
                Prices in KES. Shipping calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
