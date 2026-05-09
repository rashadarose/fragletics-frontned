import { useState } from 'react'
import './Cart.css'

export default function Cart({ items, setItems, onOrderComplete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      handleRemove(id)
    } else {
      setItems(items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        setError(orderData.message || 'Failed to create order')
        return
      }

      // For now, redirect to Stripe/PayPal
      // In production, you'd initiate payment here
      alert('Order created! Order ID: ' + orderData.id + '\n\nPayment integration coming soon.')
      onOrderComplete()
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
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>−</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
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
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  )
}
