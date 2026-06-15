import { useEffect, useMemo, useState } from 'react'
import { getProducts, type Product, type ProductVariant } from './api'

type CartItem = {
  productId: string
  title: string
  thumbnail?: string | null
  variant: ProductVariant
  quantity: number
}

const CART_KEY = 'mercur-storefront-cart'

const icons = {
  search: <path d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />,
  bag: <path d="M6.5 8.5h11l1 12h-13l1-12Zm3 1V6a2.5 2.5 0 0 1 5 0v3.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
}

function Icon({ name }: { name: keyof typeof icons }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}

function getPrice(variant?: ProductVariant) {
  return variant?.calculated_price?.calculated_amount ?? 0
}

function formatPrice(variant?: ProductVariant) {
  const currency = variant?.calculated_price?.currency_code?.toUpperCase() ?? 'EUR'
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency }).format(getPrice(variant))
}

function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Усі товари')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [cart, setCart] = useState<CartItem[]>(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState(false)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    document.body.style.overflow = selectedProduct || cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct, cartOpen])

  const categories = useMemo(() => {
    const names = products.flatMap((product) => product.categories?.map((item) => item.name) ?? [])
    return ['Усі товари', ...Array.from(new Set(names))]
  }, [products])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('uk')
    return products.filter((product) => {
      const matchesCategory = category === 'Усі товари' || product.categories?.some((item) => item.name === category)
      const matchesQuery = !query || `${product.title} ${product.description ?? ''}`.toLocaleLowerCase('uk').includes(query)
      return matchesCategory && matchesQuery
    })
  }, [products, category, search])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + getPrice(item.variant) * item.quantity, 0)
  const cartCurrency = cart[0]?.variant.calculated_price?.currency_code?.toUpperCase() ?? 'EUR'

  function openProduct(product: Product) {
    setSelectedProduct(product)
    setSelectedVariant(product.variants?.[0] ?? null)
  }

  function addToCart() {
    if (!selectedProduct || !selectedVariant) return
    setCart((current) => {
      const existing = current.find((item) => item.variant.id === selectedVariant.id)
      if (existing) {
        return current.map((item) => item.variant.id === selectedVariant.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, {
        productId: selectedProduct.id,
        title: selectedProduct.title,
        thumbnail: selectedProduct.thumbnail,
        variant: selectedVariant,
        quantity: 1,
      }]
    })
    setSelectedProduct(null)
    setCartOpen(true)
  }

  function changeQuantity(variantId: string, delta: number) {
    setCart((current) => current
      .map((item) => item.variant.id === variantId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0))
  }

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#top" aria-label="Mercur Market">
          <span className="brand-mark">M</span>
          <span>MERCUR</span>
        </a>
        <nav className="desktop-nav" aria-label="Основна навігація">
          <a href="#catalog">Каталог</a>
          <a href="#values">Про нас</a>
          <a href="#footer">Контакти</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)}>
          <Icon name="bag" />
          <span>Кошик</span>
          <b>{cartCount}</b>
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Вибране незалежними продавцями</span>
            <h1>Речі з характером.<br /><em>Знайдені для вас.</em></h1>
            <p>Відкривайте локальні бренди, продуманий дизайн і товари, якими хочеться користуватися щодня.</p>
            <a className="primary-button" href="#catalog">Перейти до каталогу <Icon name="arrow" /></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="hero-card">
              <span>Колекція</span>
              <strong>Everyday<br />Objects</strong>
              <small>01 / 2026</small>
            </div>
          </div>
        </section>

        <section className="benefits" id="values">
          <div><strong>01</strong><span>Перевірені<br />продавці</span></div>
          <div><strong>02</strong><span>Швидка<br />доставка</span></div>
          <div><strong>03</strong><span>Просте<br />повернення</span></div>
          <p>Mercur об'єднує незалежні магазини в одному зручному просторі.</p>
        </section>

        <section className="catalog" id="catalog">
          <div className="section-heading">
            <div><span className="eyebrow">Каталог</span><h2>Знайдіть своє</h2></div>
            <label className="search-box">
              <Icon name="search" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Пошук товарів" />
            </label>
          </div>

          <div className="filters" aria-label="Категорії">
            {categories.map((item) => (
              <button key={item} className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>

          {loading && <div className="status"><span className="loader" />Завантажуємо добірку...</div>}
          {error && <div className="status error">Не вдалося завантажити товари. {error}</div>}
          {!loading && !error && (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id} onClick={() => openProduct(product)}>
                  <div className="product-image">
                    {product.thumbnail ? <img src={product.thumbnail} alt={product.title} /> : <span>{product.title.slice(0, 1)}</span>}
                    <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
                    <button aria-label={`Переглянути ${product.title}`}><Icon name="arrow" /></button>
                  </div>
                  <div className="product-meta">
                    <div>
                      <span>
                        {product.categories?.[0]?.name ?? 'Добірка'}
                        {product.seller?.name ? ' · ' + product.seller.name : ''}
                      </span>
                      <h3>{product.title}</h3>
                    </div>
                    <strong>від {formatPrice(product.variants?.[0])}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!loading && visibleProducts.length === 0 && <div className="status">За цим запитом товарів не знайдено.</div>}
        </section>
      </main>

      <footer id="footer">
        <div className="footer-brand">MERCUR<span>MARKET</span></div>
        <p>Маркетплейс речей, що мають значення.</p>
        <div><a href="mailto:hello@mercur.market">hello@mercur.market</a><span>© 2026 Mercur</span></div>
      </footer>

      {selectedProduct && (
        <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && setSelectedProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true">
            <button className="close-button" onClick={() => setSelectedProduct(null)}><Icon name="close" /></button>
            <div className="modal-image">
              {selectedProduct.thumbnail ? <img src={selectedProduct.thumbnail} alt={selectedProduct.title} /> : <span>{selectedProduct.title.slice(0, 1)}</span>}
            </div>
            <div className="modal-content">
              <span className="eyebrow">
                {selectedProduct.seller?.name ?? selectedProduct.categories?.[0]?.name ?? 'Mercur selection'}
              </span>
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.description || 'Продуманий товар для щоденного використання від незалежного продавця Mercur.'}</p>
              <div className="variant-label"><span>Оберіть варіант</span><span>{selectedVariant?.inventory_quantity ?? 0} в наявності</span></div>
              <div className="variants">
                {selectedProduct.variants?.map((variant) => (
                  <button key={variant.id} className={selectedVariant?.id === variant.id ? 'active' : ''} onClick={() => setSelectedVariant(variant)} disabled={variant.inventory_quantity === 0}>
                    <span>{variant.title}</span><strong>{formatPrice(variant)}</strong>
                  </button>
                ))}
              </div>
              <button className="add-button" onClick={addToCart} disabled={!selectedVariant || selectedVariant.inventory_quantity === 0}>
                Додати до кошика <span>{formatPrice(selectedVariant ?? undefined)}</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="overlay cart-overlay" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true">
            <div className="cart-header"><div><span className="eyebrow">Ваш вибір</span><h2>Кошик <small>{cartCount}</small></h2></div><button className="close-button" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
            {cart.length === 0 ? (
              <div className="empty-cart"><span><Icon name="bag" /></span><h3>Тут поки порожньо</h3><p>Перегляньте каталог і додайте те, що сподобалося.</p><button onClick={() => setCartOpen(false)}>До каталогу</button></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.variant.id}>
                      <div className="cart-thumb">{item.thumbnail ? <img src={item.thumbnail} alt="" /> : item.title.slice(0, 1)}</div>
                      <div className="cart-item-copy"><h3>{item.title}</h3><span>{item.variant.title}</span><strong>{formatPrice(item.variant)}</strong></div>
                      <div className="quantity"><button onClick={() => changeQuantity(item.variant.id, -1)}><Icon name="minus" /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.variant.id, 1)}><Icon name="plus" /></button></div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Разом</span><strong>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: cartCurrency }).format(cartTotal)}</strong></div>
                  <p>Доставка розраховується на наступному кроці</p>
                  {checkoutMessage ? <div className="demo-message">Демо-замовлення сформовано. Підключення оплати буде наступним етапом.</div> : <button className="add-button" onClick={() => setCheckoutMessage(true)}>Оформити замовлення <Icon name="arrow" /></button>}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
