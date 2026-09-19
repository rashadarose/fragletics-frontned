import { useEffect, useRef, useState } from 'react'
import './Header.css'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="16.6" y1="16.6" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Header({ cartCount, products = [], onNavigate, onShopViewChange, onSelectProduct, shopView, isLoggedIn }) {
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownRef = useRef(null)
  const desktopSearchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShopOpen(false)
      }

      const clickedInDesktopSearch = desktopSearchRef.current?.contains(event.target)
      const clickedInMobileSearch = mobileSearchRef.current?.contains(event.target)

      if (!clickedInDesktopSearch && !clickedInMobileSearch) {
        setIsSearchOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsShopOpen(false)
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.reload()
  }

  const handleShopSelect = (view) => {
    onShopViewChange(view)
    onNavigate('shop')
    setIsShopOpen(false)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const matches = normalizedQuery
    ? products
      .filter((product) => {
        const haystack = [
          product.name,
          product.category,
          product.collection,
          product.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
      .slice(0, 6)
    : []

  const handleSearchFocus = () => {
    if (normalizedQuery) {
      setIsSearchOpen(true)
    }
  }

  const handleQueryChange = (value) => {
    setQuery(value)
    setIsSearchOpen(Boolean(value.trim()))
  }

  const handleResultSelect = (product) => {
    window.dispatchEvent(new CustomEvent('fragletics:search-select', { detail: product }))

    if (onSelectProduct) {
      onSelectProduct(product)
    }
    setQuery('')
    setIsSearchOpen(false)
    setIsShopOpen(false)
  }

  const formatViewLabel = (view) => {
    if (view === 'all') return 'All'
    if (view === 'niche') return 'Niche'
    if (view === 'designer') return 'Designer'
    if (view === 'clones') return 'Clones'
    if (view === 'merch') return 'Merch'
    return 'All'
  }

  const showEmptyState = isSearchOpen && normalizedQuery && matches.length === 0

  return (
    <header className="header">
      <div className="header-content">
        <button type="button" onClick={() => onNavigate('shop')} className="brand" aria-label="Go to shop">
          <img src="/fragletics-logo.png" alt="Fragletics logo" className="brand-logo" />
        </button>

        <div className="header-search-desktop" ref={desktopSearchRef}>
          <div className="search-input-shell">
            <input
              type="text"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              onFocus={handleSearchFocus}
              className="search-input"
              placeholder="Search inventory"
              aria-label="Search inventory"
            />
            <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
          </div>

          {isSearchOpen && matches.length > 0 && (
            <div className="search-results" role="listbox" aria-label="Search results">
              {matches.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  className="search-result-item"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    handleResultSelect(product)
                  }}
                  onClick={() => handleResultSelect(product)}
                >
                  <div className="search-result-thumb">
                    {product.image ? <img src={product.image} alt={product.name} /> : <div className="search-result-fallback">No Image</div>}
                  </div>
                  <div className="search-result-meta">
                    <span className="search-result-name">{product.name}</span>
                    <span className="search-result-category">{product.collection || product.category || 'Product'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showEmptyState && (
            <div className="search-empty">No products match "{query.trim()}"</div>
          )}
        </div>

        <nav className="nav">
          <div className="mobile-search" ref={mobileSearchRef}>
            <button
              type="button"
              className="nav-btn search-mobile-btn"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isSearchOpen}
            >
              Search
              <span className="search-mobile-icon" aria-hidden="true"><SearchIcon /></span>
            </button>

            {isSearchOpen && (
              <div className="mobile-search-panel">
                <div className="search-input-shell mobile-input-shell">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    className="search-input"
                    placeholder="Search inventory"
                    aria-label="Search inventory mobile"
                    autoFocus
                  />
                  <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
                </div>

                {matches.length > 0 && (
                  <div className="search-results mobile-results" role="listbox" aria-label="Mobile search results">
                    {matches.map((product) => (
                      <button
                        type="button"
                        key={`mobile-${product.id}`}
                        className="search-result-item"
                        onMouseDown={(event) => {
                          event.preventDefault()
                          handleResultSelect(product)
                        }}
                        onClick={() => handleResultSelect(product)}
                      >
                        <div className="search-result-thumb">
                          {product.image ? <img src={product.image} alt={product.name} /> : <div className="search-result-fallback">No Image</div>}
                        </div>
                        <div className="search-result-meta">
                          <span className="search-result-name">{product.name}</span>
                          <span className="search-result-category">{product.collection || product.category || 'Product'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showEmptyState && (
                  <div className="search-empty">No products match "{query.trim()}"</div>
                )}
              </div>
            )}
          </div>

          <div className="shop-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setIsShopOpen((prev) => !prev)}
              className="nav-btn"
              aria-haspopup="true"
              aria-expanded={isShopOpen}
            >
              Shop ({formatViewLabel(shopView)})
              <span className={`chevron ${isShopOpen ? 'open' : ''}`}>▾</span>
            </button>

            {isShopOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleShopSelect('all')} className={`dropdown-item ${shopView === 'all' ? 'active' : ''}`}>All</button>
                <button onClick={() => handleShopSelect('niche')} className={`dropdown-item ${shopView === 'niche' ? 'active' : ''}`}>Niche</button>
                <button onClick={() => handleShopSelect('designer')} className={`dropdown-item ${shopView === 'designer' ? 'active' : ''}`}>Designer</button>
                <button onClick={() => handleShopSelect('clones')} className={`dropdown-item ${shopView === 'clones' ? 'active' : ''}`}>Clones</button>
                <button onClick={() => handleShopSelect('merch')} className={`dropdown-item ${shopView === 'merch' ? 'active' : ''}`}>Merch</button>
              </div>
            )}
          </div>

          <button onClick={() => onNavigate('cart')} className="nav-btn">
            Cart ({cartCount})
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          ) : (
            <button onClick={() => onNavigate('auth')} className="nav-btn">
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
