import { useState } from 'react'
import './Cart.css'

export default function Cart({ items, setItems, isLoggedIn, onRequireLogin, onOrderComplete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const total = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

  const handleQuantityChange = (cartKey, quantity) => {
    if (quantity <= 0) {
      handleRemove(cartKey)
    } else {
      setItems(items.map(item =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      ))
    }
  }

  const handleRemove = (cartKey) => {
    setItems(items.filter(item => item.cartKey !== cartKey))
  }

  const handleCheckout = async () => {
    if (!isLoggedIn && !guestEmail.trim()) {
      setError('Please log in or enter your email to checkout as a guest.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const checkoutResponse = await fetch('/api/orders/checkout/stripe', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize
          })),
          total,
          guestEmail: guestEmail.trim()
        })
      })

      const checkoutData = await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        setError(checkoutData.message || 'Failed to start checkout')
        return
      }

      if (!checkoutData.checkoutUrl) {
        setError('Stripe checkout was not created.')
        return
      }

      window.location.href = checkoutData.checkoutUrl
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.cartKey || `${item.id}-${item.selectedSize || 'standard'}`} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              {item.selectedSize && <p className="size">Size: {item.selectedSize}</p>}
              <p className="price">${Number(item.price).toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => handleQuantityChange(item.cartKey || `${item.id}-${item.selectedSize || 'standard'}`, item.quantity - 1)}>−</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.cartKey || `${item.id}-${item.selectedSize || 'standard'}`, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button onClick={() => handleQuantityChange(item.cartKey || `${item.id}-${item.selectedSize || 'standard'}`, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </div>
            <button className="remove-btn" onClick={() => handleRemove(item.cartKey || `${item.id}-${item.selectedSize || 'standard'}`)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        {!isLoggedIn && (
          <div className="guest-email-box" style={{ marginBottom: '16px' }}>
            <label htmlFor="guest-email" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Email for confirmation and tracking
            </label>
            <input
              id="guest-email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
        )}

        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Redirecting...' : isLoggedIn ? 'Proceed to Stripe Checkout' : 'Checkout as Guest'}
        </button>
      </div>
    </div>
  )
}
