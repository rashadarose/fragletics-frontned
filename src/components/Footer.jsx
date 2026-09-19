import './Footer.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-wrap">
        <div className="footer-grid">
          <section className="footer-brand">
            <img src="/fragletics-logo.png" alt="Fragletics logo" className="footer-logo" />
            <h5>Fragletics</h5>
            <p>Premium fragrances, decants, and merch shipped with care.</p>
          </section>

          <section>
            <h6>Shop</h6>
            <ul>
              <li><button type="button" onClick={() => onNavigate('shop')}>Fragrances</button></li>
              <li><button type="button" onClick={() => onNavigate('shop')}>Decants</button></li>
              <li><button type="button" onClick={() => onNavigate('shop')}>Merch</button></li>
              <li><button type="button" onClick={() => onNavigate('cart')}>Cart</button></li>
            </ul>
          </section>

          <section>
            <h6>Decant Sizes</h6>
            <ul>
              <li>5ml Travel</li>
            </ul>
          </section>

          <section>
            <h6>Legal & Help</h6>
            <ul>
              <li><button type="button" onClick={() => onNavigate('auth')}>Account</button></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </section>
        </div>

        <div className="footer-social">
          <h6>Follow Us</h6>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">TikTok</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Fragletics. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
