import './ProductListings.css'

export default function ProductListings({ products, onAddToCart }) {
  return (
    <div className="products-container">
      <h2>Shop</h2>
      <div className="products-grid">
        {products && products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="placeholder">Image</div>
                )}
              </div>
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="description">{product.description}</p>
              <div className="product-footer">
                <span className="price">${product.price.toFixed(2)}</span>
                {product.stock > 0 ? (
                  <button onClick={() => onAddToCart(product)}>Add to Cart</button>
                ) : (
                  <button disabled>Out of Stock</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  )
}
