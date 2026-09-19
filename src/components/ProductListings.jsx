import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import './ProductListings.css'

const DECANT_SIZES = ['5ml']
const SIZE_MULTIPLIER = {
  '5ml': 0.72
}

const ITEMS_PER_PAGE = 12

const AUDIENCE_OPTIONS = ['men', 'women', 'unisex']
const TYPE_OPTIONS = ['niche', 'designer', 'clones']

const KNOWN_AUDIENCE_BY_NAME = [
  { pattern: /kayali|vanilla\s*\|\s*28/, audience: 'unisex' },
  { pattern: /khamrah/, audience: 'unisex' },
  { pattern: /supremacy|afnan/, audience: 'men' },
  { pattern: /light\s*blue/, audience: 'men' }
]

const toTitleCase = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return ''
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const getProductType = (product) => {
  const explicitType = String(product.collection || product.subcategory || '').trim().toLowerCase()
  if (TYPE_OPTIONS.includes(explicitType)) {
    return explicitType
  }

  const imagePath = String(product.image || '').toLowerCase()
  const imageMatch = imagePath.match(/\/images\/(clones|niche|designer)\//)
  if (imageMatch?.[1]) {
    return imageMatch[1]
  }

  return ''
}

const getProductAudience = (product) => {
  const explicitAudience = String(product.audience || '').trim().toLowerCase()
  if (AUDIENCE_OPTIONS.includes(explicitAudience)) {
    return explicitAudience
  }

  const productName = String(product.name || '').toLowerCase()
  const knownAudience = KNOWN_AUDIENCE_BY_NAME.find(({ pattern }) => pattern.test(productName))
  if (knownAudience) {
    return knownAudience.audience
  }

  return 'unisex'
}

export default function ProductListings({ title = 'Shop', products, onAddToCart, onViewProduct }) {
  const [sizeByProduct, setSizeByProduct] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const filterRef = useRef(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [products])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedAudience, selectedTypes])

  const toggleAudience = (audience) => {
    setSelectedAudience((current) => (
      current.includes(audience)
        ? current.filter((item) => item !== audience)
        : [...current, audience]
    ))
  }

  const toggleType = (type) => {
    setSelectedTypes((current) => (
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    ))
  }

  const clearAllFilters = () => {
    setSelectedAudience([])
    setSelectedTypes([])
  }

  const getSelectedSize = (product) => {
    const isMerch = String(product.category || '').toLowerCase() === 'merch'
    if (isMerch) {
      return 'Standard'
    }
    return sizeByProduct[product.id] || '5ml'
  }

  const getDisplayPrice = (product, selectedSize) => {
    if (selectedSize === 'Standard') {
      return Number(product.price)
    }

    const multiplier = SIZE_MULTIPLIER[selectedSize] || 1
    return Number(product.price) * multiplier
  }

  const filteredProducts = useMemo(() => {
    if (!products) {
      return []
    }

    return products.filter((product) => {
      const productType = getProductType(product)
      const productAudience = getProductAudience(product)

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(productType)
      const matchesAudience = selectedAudience.length === 0 || selectedAudience.includes(productAudience)

      return matchesType && matchesAudience
    })
  }, [products, selectedAudience, selectedTypes])

  const totalPages = Math.ceil((filteredProducts.length || 0) / ITEMS_PER_PAGE)
  const paginated = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="products-container">
      <div className="products-toolbar">
        <h2>{title}</h2>

        <div className="filter-wrap" ref={filterRef}>
          <button
            type="button"
            className="filter-button"
            onClick={() => setIsFilterOpen((open) => !open)}
            aria-expanded={isFilterOpen}
            aria-label="Open product filters"
          >
            <FaFilter />
            <span>Filter</span>
          </button>

          {isFilterOpen && (
            <div className="filter-dropdown">
              <p className="filter-section-label">Audience</p>
              {AUDIENCE_OPTIONS.map((audience) => (
                <label key={audience} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedAudience.includes(audience)}
                    onChange={() => toggleAudience(audience)}
                  />
                  <span>{toTitleCase(audience)}</span>
                </label>
              ))}

              <p className="filter-section-label">Type</p>
              {TYPE_OPTIONS.map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span>{toTitleCase(type)}</span>
                </label>
              ))}

              <button type="button" className="clear-filters" onClick={clearAllFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {(selectedAudience.length > 0 || selectedTypes.length > 0) && (
        <p className="filter-summary">
          Showing {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
        </p>
      )}

      <div className="products-grid">
        {paginated.length > 0 ? (
          paginated.map(product => {
            const selectedSize = getSelectedSize(product)
            const displayPrice = getDisplayPrice(product, selectedSize)
            const productType = getProductType(product)
            const productAudience = getProductAudience(product)
            const productMeta = productType
              ? `${toTitleCase(productType)} | ${toTitleCase(productAudience)}`
              : toTitleCase(productAudience)

            return (
              <div key={product.id} className="product-card" onClick={() => onViewProduct(product)} style={{ cursor: 'pointer' }}>
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="placeholder">Image</div>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="product-meta">{productMeta}</p>
                <p className="description">{product.description}</p>

                <div className="size-row">
                  <label htmlFor={`size-${product.id}`}>Decant Size</label>
                  <select
                    id={`size-${product.id}`}
                    value={selectedSize}
                    disabled={selectedSize === 'Standard'}
                    onChange={(e) => setSizeByProduct({ ...sizeByProduct, [product.id]: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedSize === 'Standard'
                      ? <option value="Standard">Standard</option>
                      : DECANT_SIZES.map((sizeOption) => (
                        <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                      ))}
                  </select>
                </div>

                <div className="product-footer">
                  <span className="price">${displayPrice.toFixed(2)}</span>
                  {product.stock > 0 ? (
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart({ ...product, selectedSize, price: displayPrice }) }}>Add to Cart</button>
                  ) : (
                    <button disabled onClick={(e) => e.stopPropagation()}>Out of Stock</button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="no-products">No products match this filter</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&#8592; Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={page === currentPage ? 'active' : ''}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &#8594;</button>
        </div>
      )}
    </div>
  )
}
