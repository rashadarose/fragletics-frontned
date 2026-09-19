import { useState } from 'react'
import './ProductDetail.css'

const DECANT_SIZES = ['5ml']
const SIZE_MULTIPLIER = { '5ml': 0.72 }
const SIZE_LABELS = {
  '5ml': '5ml — Travel Size'
}

const PRODUCT_NOTES = {
  default: {
    topNotes: 'Bergamot, Lemon, Pink Pepper',
    heartNotes: 'Rose, Jasmine, Iris',
    baseNotes: 'Sandalwood, Musk, Amber, Vanilla',
    concentration: 'Eau de Parfum',
    longevity: '6–8 hours',
    sillage: 'Moderate to Strong',
    season: 'Fall / Winter',
    gender: 'Unisex'
  }
}

const PRODUCT_DESCRIPTIONS = {
  1: {
    headline: 'Lattafa Khamrah — A Rich, Smoky Oriental Masterpiece',
    body: `Khamrah by Lattafa is a stunning oriental fragrance inspired by the warm, luxurious scents of the Middle East. This bold yet versatile perfume opens with a burst of fresh citrus before transitioning into a rich, spicy heart and a deeply sensual base of oud, amber, and vanilla.

Khamrah is widely praised as a budget-friendly dupe for high-end niche fragrances, delivering incredible performance and projection at a fraction of the cost. A long-lasting crowd pleaser that suits both day and evening wear.`,
    topNotes: 'Bergamot, Lemon, Cinnamon',
    heartNotes: 'Oud, Rose, Saffron',
    baseNotes: 'Amber, Vanilla, Musk, Sandalwood',
    concentration: 'Eau de Parfum',
    longevity: '8–12 hours',
    sillage: 'Heavy / Beast Mode',
    season: 'Fall / Winter',
    gender: 'Unisex',
    brand: 'Lattafa',
    origin: 'UAE'
  },
  2: {
    headline: "Afnan Supremacy Collector's Edition Pour Homme — Fresh Pineapple Meets Smoky Birch",
    body: `Supremacy Collector's Edition Pour Homme by Afnan is a modern chypre-fruity profile with a bright, juicy opening and a clean smoky backbone. The opening blends pineapple, bergamot, apple, and white floral nuances, giving it a crisp and uplifting first impression.

As it settles, birch and amber add depth with a smooth orange blossom heart, then transitions into a grounded oakmoss-musk-ambergris base. This is an easy compliment puller with a refined masculine feel and strong versatility from daytime to evening wear.`,
    topNotes: 'Pineapple, Bergamot, Apple, White Flowers',
    heartNotes: 'Orange Blossom, Birch, Amber',
    baseNotes: 'Oakmoss, Musk, Ambergris',
    concentration: 'Eau de Parfum',
    longevity: '7-10 hours',
    sillage: 'Moderate to Strong',
    season: 'Spring / Fall',
    gender: 'Masculine / Men',
    brand: 'Afnan',
    origin: 'UAE'
  }
}

export default function ProductDetail({ product, onAddToCart, onBack }) {
  const isMerch = String(product.category || '').toLowerCase() === 'merch'
  const [selectedSize, setSelectedSize] = useState(isMerch ? 'Standard' : '5ml')
  const [qty, setQty] = useState(1)

  const notes = PRODUCT_DESCRIPTIONS[product.id] || {}
  const fallback = PRODUCT_NOTES.default

  const displayPrice = isMerch
    ? Number(product.price)
    : Number(product.price) * (SIZE_MULTIPLIER[selectedSize] || 1)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart({ ...product, selectedSize: isMerch ? 'Standard' : selectedSize, price: displayPrice })
    }
  }

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={onBack}>← Back to Shop</button>

      <div className="pd-layout">
        {/* Left — Image */}
        <div className="pd-image-col">
          <div className="pd-image-wrap">
            {product.image
              ? <img src={product.image} alt={product.name} />
              : <div className="pd-placeholder">No Image</div>}
          </div>
        </div>

        {/* Right — Info */}
        <div className="pd-info-col">
          <p className="pd-brand">{notes.brand || product.category}</p>
          <h1 className="pd-name">{product.name}</h1>

          {notes.headline && <p className="pd-headline">{notes.headline}</p>}

          <div className="pd-price-row">
            <span className="pd-price">${displayPrice.toFixed(2)}</span>
            {!isMerch && <span className="pd-size-tag">{selectedSize}</span>}
          </div>

          {!isMerch && (
            <div className="pd-size-section">
              <p className="pd-section-label">Select Decant Size</p>
              <div className="pd-sizes">
                {DECANT_SIZES.map(s => (
                  <button
                    key={s}
                    className={`pd-size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {SIZE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-qty-row">
            <p className="pd-section-label">Quantity</p>
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="pd-add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {notes.body && (
            <div className="pd-desc">
              <p className="pd-section-label">About this Fragrance</p>
              {notes.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
          )}

          {/* Fragrance Notes */}
          {!isMerch && (
            <div className="pd-notes">
              <p className="pd-section-label">Fragrance Notes</p>
              <div className="pd-notes-grid">
                <div className="pd-note-block">
                  <span className="pd-note-label">Top</span>
                  <span>{notes.topNotes || fallback.topNotes}</span>
                </div>
                <div className="pd-note-block">
                  <span className="pd-note-label">Heart</span>
                  <span>{notes.heartNotes || fallback.heartNotes}</span>
                </div>
                <div className="pd-note-block">
                  <span className="pd-note-label">Base</span>
                  <span>{notes.baseNotes || fallback.baseNotes}</span>
                </div>
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="pd-details">
            <p className="pd-section-label">Details</p>
            <table className="pd-table">
              <tbody>
                {!isMerch && <>
                  <tr><td>Concentration</td><td>{notes.concentration || fallback.concentration}</td></tr>
                  <tr><td>Longevity</td><td>{notes.longevity || fallback.longevity}</td></tr>
                  <tr><td>Sillage</td><td>{notes.sillage || fallback.sillage}</td></tr>
                  <tr><td>Season</td><td>{notes.season || fallback.season}</td></tr>
                  <tr><td>Gender</td><td>{notes.gender || fallback.gender}</td></tr>
                  {notes.origin && <tr><td>Origin</td><td>{notes.origin}</td></tr>}
                </>}
                <tr><td>In Stock</td><td>{product.stock} units</td></tr>
              </tbody>
            </table>
          </div>

          {/* Decant Info Banner */}
          {!isMerch && (
            <div className="pd-decant-info">
              <strong>🧪 What is a decant?</strong> A decant is a sample portion transferred from the original bottle into a clean atomizer — perfect for testing and travel. All decants are freshly poured from sealed bottles.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
