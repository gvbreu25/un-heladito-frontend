import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../data/useProducts.js';
export default function Offers() {
  const { products, loading, error } = useProducts();
  const offers = products.filter((product) => product.offer);
  const { addToCart } = useCart();
  return <main className="container section-space"><div className="page-heading"><span className="eyebrow">UN GUSTITO EXTRA</span><h1>Ofertas para disfrutar</h1><p>Sabores seleccionados con precios especiales en esta tienda de demostración.</p></div>{loading && <p role="status">Cargando ofertas…</p>}{error && <p className="alert alert-danger" role="alert">{error}</p>}
    {!loading && !error && (offers.length ? <div className="row g-4">{offers.map((product) => <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}><ProductCard product={product} onAddToCart={addToCart} /></div>)}</div> : <div className="empty-state"><span>🎁</span><h2>Pronto tendremos nuevas ofertas</h2><p>Mientras tanto, revisa el catálogo completo.</p></div>)}</main>;
}
