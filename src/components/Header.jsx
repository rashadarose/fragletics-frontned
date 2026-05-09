import './Header.css'

export default function Header({ cartCount, onNavigate, isLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1 onClick={() => onNavigate('shop')} className="logo">
          FRAGLETICS
        </h1>
        <nav className="nav">
          <button onClick={() => onNavigate('shop')} className="nav-btn">
            Shop
          </button>
          {isLoggedIn && (
            <>
              <button onClick={() => onNavigate('cart')} className="nav-btn">
                Cart ({cartCount})
              </button>
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <button onClick={() => onNavigate('auth')} className="nav-btn">
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
