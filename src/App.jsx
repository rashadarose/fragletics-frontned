import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ProductListings from './components/ProductListings'
import Cart from './components/Cart'
import Auth from './components/Auth'

function App() {
  const [currentPage, setCurrentPage] = useState('shop')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
    }
    // Fetch products from backend
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const handleOrderComplete = () => {
    setCart([])
    setCurrentPage('shop')
  }

  return (
    <div className="app">
      <Header cartCount={cart.length} onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} />
      
      <main>
        {!isLoggedIn && currentPage === 'auth' && (
          <Auth onLoginSuccess={() => {
            setIsLoggedIn(true)
            setCurrentPage('shop')
          }} />
        )}
        
        {isLoggedIn && currentPage === 'shop' && (
          <ProductListings products={products} onAddToCart={handleAddToCart} />
        )}
        
        {isLoggedIn && currentPage === 'cart' && (
          <Cart items={cart} setItems={setCart} onOrderComplete={handleOrderComplete} />
        )}
      </main>
    </div>
  )
}

export default App
