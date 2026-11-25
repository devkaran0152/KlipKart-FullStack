
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch products from Spring Boot
  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then((response) => {
        setProducts(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Product API error:', error)
        setError('Unable to load products. Please check your backend.')
        setLoading(false)
      })
  }, [])

  // Add product to cart
  

async function handleAddToCart(product) {
  try {
    // Add one product to customer 1's backend cart
    await axios.post(
      'http://localhost:8080/api/cart/1/items',
      null,
      {
        params: {
          productId: product.id,
          quantity: 1
        }
      }
    )

    // Fetch the latest cart from backend
    const response = await axios.get(
      'http://localhost:8080/api/cart/1'
    )

    // Update React cart state
    const updatedCart = response.data.map((item) => ({
      id: item.productId,
      itemId: item.itemId,
      name: item.productName,
      price: Number(item.price),
      quantity: item.quantity,
      totalPrice: Number(item.totalPrice)
    }))

    setCart(updatedCart)

    alert(product.name + ' added to cart successfully!')

  } catch (error) {
    console.error('Cart error:', error)
    console.error('Backend response:', error.response?.data)

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Unknown error'

    alert('Unable to add product: ' + errorMessage)
  }
}



  // Increase quantity
  function increaseQuantity(id) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, item.stock)
            }
          : item
      )
    )
  }

  // Decrease quantity
  function decreaseQuantity(id) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Remove product
  function removeFromCart(id) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    )
  }

  // Total cart items
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Total cart price
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

  return (
    <div className="app">

      {/* Navigation */}
      <header className="navbar">
       <h2 className="logo">Klipkart</h2>

        <nav>
          <a href="#home" onClick={() => setShowCart(false)}>Home</a>
          <a href="#products" onClick={() => setShowCart(false)}>Products</a>
        </nav>

        <button
          className="cart-button"
          onClick={() => setShowCart(true)}
        >
          🛒 Cart ({totalItems})
        </button>
      </header>

      {!showCart ? (
        <>
          {/* Hero */}
          <section className="hero" id="home">
            <div className="hero-content">
              <p className="hero-tag">WELCOME TO MYSTORE</p>
              <h1>Shop Smart.<br />Live Better.</h1>
              <p className="hero-description">
                Discover amazing products at amazing prices.
              </p>

              <button
                className="shop-button"
                onClick={() =>
                  document.getElementById('products').scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              >
                Explore Products →
              </button>
            </div>
          </section>

          {/* Products */}
          <section className="product-section" id="products">
            <div className="section-heading">
              <div>
                <p className="section-subtitle">OUR COLLECTION</p>
                <h2>Featured Products</h2>
              </div>
              <p>Find something you'll love.</p>
            </div>

            {loading ? (
              <p className="status-message">Loading products...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : products.length === 0 ? (
              <p className="status-message">No products available yet.</p>
            ) : (
              <div className="products">
                {products.map((product) => (
                  <div className="product-card" key={product.id}>

                    <div className="product-image-container">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">
                          No Image Available
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{product.name}</h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-bottom">
                        <div>
                          <h4>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </h4>
                          <p className="stock">
                            {product.quantity > 0
                              ? `${product.quantity} in stock`
                              : 'Out of stock'}
                          </p>
                        </div>

                        <button
                          className="add-button"
                          disabled={product.quantity <= 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          {product.quantity > 0
                            ? 'Add +'
                            : 'Sold Out'}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* Cart Page */
        <section className="cart-section">
          <div className="cart-heading">
            <div>
              <p className="section-subtitle">YOUR SELECTION</p>
              <h1>Shopping Cart</h1>
            </div>

            <button
              className="continue-button"
              onClick={() => setShowCart(false)}
            >
              ← Continue Shopping
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything yet.</p>
              <button
                className="shop-button"
                onClick={() => setShowCart(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-layout">

              <div className="cart-products">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>

                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="cart-product-image"
                      />
                    ) : (
                      <div className="cart-no-image">No Image</div>
                    )}

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </p>

                      <div className="quantity-controls">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          disabled={item.quantity >= item.stock}
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-subtotal">
                      ₹{(
                        Number(item.price) * item.quantity
                      ).toLocaleString('en-IN')}
                    </div>

                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>Total Amount</span>
                  <strong>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() =>
                    alert('Checkout will be implemented next!')
                  }
                >
                  Proceed to Checkout →
                </button>
              </div>

            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
  <h2>Klipkart</h2>
  <p>Your one-stop destination for online shopping.</p>
  <p>Created by Karan Kandu</p>
  <p>© 2026 Klipkart. All rights reserved.</p>
</footer>

    </div>
  )
}

export default App
