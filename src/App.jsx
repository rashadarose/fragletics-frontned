import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ProductListings from './components/ProductListings'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Auth from './components/Auth'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('shop')
  const [shopView, setShopView] = useState('all')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const getShopViewProducts = () => {
    const normalizeCollection = (product) => String(product.collection || product.subcategory || '').toLowerCase().trim()
    const normalizeCategory = (product) => String(product.category || '').toLowerCase().trim()

    const isMerchProduct = (product) => {
      if (normalizeCollection(product) === 'merch' || normalizeCategory(product) === 'merch') {
        return true
      }

      const imagePath = String(product.image || '').toLowerCase()
      return /\/images\/merch\//.test(imagePath)
    }

    if (shopView === 'all') {
      return products.filter((p) => !isMerchProduct(p))
    }

    if (shopView === 'merch') {
      return products.filter((p) => isMerchProduct(p))
    }

    const getAssignedCollection = (product) => {
      const bucket = normalizeCollection(product)
      if (bucket === 'niche' || bucket === 'designer' || bucket === 'clones') {
        return bucket
      }

      const imagePath = String(product.image || '').toLowerCase()
      const imageMatch = imagePath.match(/\/images\/(clones|niche|designer)\//)
      if (imageMatch?.[1]) {
        return imageMatch[1]
      }

      return ''
    }

    const hasCollectionMetadata = products.some((p) => {
      const bucket = getAssignedCollection(p)
      return bucket === 'niche' || bucket === 'designer' || bucket === 'clones'
    })

    if (hasCollectionMetadata) {
      return products.filter((p) => getAssignedCollection(p) === shopView)
    }

    if (shopView === 'niche') {
      return products.filter((p) => {
        return normalizeCategory(p) === 'fragrances'
      })
    }

    if (shopView === 'designer') {
      return products.filter((p) => {
        return normalizeCategory(p) === 'decants'
      })
    }

    if (shopView === 'clones') {
      return products.filter((p) => {
        const title = String(p.name || '').toLowerCase()
        return /khamrah|supremacy|clone/.test(title)
      })
    }

    return products
  }

  const getShopHeading = () => {
    if (shopView === 'niche') return 'Niche'
    if (shopView === 'designer') return 'Designer'
    if (shopView === 'clones') return 'Clones'
    if (shopView === 'merch') return 'Merch'
    return 'Shop'
  }

  const shopProducts = getShopViewProducts()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
    }

    const searchParams = new URLSearchParams(window.location.search)
    const checkoutStatus = searchParams.get('checkout')
    const orderId = searchParams.get('order_id')

    if (checkoutStatus === 'success') {
      setCart([])
      setCurrentPage('shop')
      setStatusMessage(orderId ? `Payment confirmed for order #${orderId}. A confirmation email has been sent.` : 'Payment confirmed successfully. A confirmation email has been sent.')
    } else if (checkoutStatus === 'cancelled') {
      setCurrentPage('cart')
      setStatusMessage('Checkout was cancelled. Your cart is still saved.')
    }

    if (checkoutStatus) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Fetch products from backend
    fetchProducts()

    const handleSearchSelection = (event) => {
      if (!event?.detail) return
      setSelectedProduct(event.detail)
      setCurrentPage('shop')
    }

    window.addEventListener('fragletics:search-select', handleSearchSelection)

    return () => {
      window.removeEventListener('fragletics:search-select', handleSearchSelection)
    }
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
    const selectedSize = product.selectedSize || '5ml'
    const cartKey = `${product.id}-${selectedSize}`
    const existingItem = cart.find(item => item.cartKey === cartKey)

    if (existingItem) {
      setCart(cart.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, selectedSize, cartKey, quantity: 1 }])
    }
  }

  const handleOrderComplete = () => {
    setCart([])
    setCurrentPage('shop')
  }

  return (
    <div className="app">
      <Header
        cartCount={cart.length}
        products={products}
        shopView={shopView}
        onShopViewChange={(view) => {
          setShopView(view)
          setSelectedProduct(null)
          setCurrentPage('shop')
        }}
        onSelectProduct={(product) => {
          setSelectedProduct(product)
          setCurrentPage('shop')
        }}
        onNavigate={(page) => {
          setSelectedProduct(null)
          setCurrentPage(page)
        }}
        isLoggedIn={isLoggedIn}
      />
      
      <main>
        {statusMessage && <div className="status-banner">{statusMessage}</div>}

        {!isLoggedIn && currentPage === 'auth' && (
          <Auth onLoginSuccess={() => {
            setIsLoggedIn(true)
            setCurrentPage('shop')
          }} />
        )}
        
        {currentPage === 'shop' && !selectedProduct && (
          <ProductListings
            title={getShopHeading()}
            products={shopProducts}
            onAddToCart={handleAddToCart}
            onViewProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentPage === 'shop' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setSelectedProduct(null)}
          />
        )}
        
        {currentPage === 'cart' && (
          <Cart
            items={cart}
            setItems={setCart}
            isLoggedIn={isLoggedIn}
            onRequireLogin={() => setCurrentPage('auth')}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </main>

      <Footer onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
