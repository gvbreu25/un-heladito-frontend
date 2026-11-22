import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../data/useProducts.js';
import { useCategories } from '../data/useCategories.js';

const categoryStyles = [
  { icon: '🍨', copy: 'Clásicos cremosos para volver a elegir una y otra vez.', className: 'category-pink' },
  { icon: '🍋', copy: 'Sabores frutales y opciones frescas.', className: 'category-mint' },
  { icon: '🍭', copy: 'Pequeños antojos hechos para llevar.', className: 'category-yellow' },
  { icon: '🍮', copy: 'Copas y postres para darse un gusto especial.', className: 'category-lilac' },
];

export default function Categories() {
  const { products, loading: loadingProducts, error: productsError } = useProducts();
  const { categories, loading, error } = useCategories();
  const [params] = useSearchParams();
  const selected = params.get('tipo');
  const visible = categories.map((category, index) => ({ ...category, ...categoryStyles[index % categoryStyles.length] }))
    .filter((category) => !selected || category.name === selected);
  return <main className="container section-space"><div className="page-heading"><span className="eyebrow">ENCUENTRA TU FAVORITO</span><h1>Nuestras categorías</h1><p>Explora la colección por tipo de producto.</p></div>{(loading || loadingProducts) && <p role="status">Cargando categorías…</p>}{(error || productsError) && <p role="alert" className="alert alert-danger">{error || productsError}</p>}
    {!loading && !error && visible.length === 0 && <p>No encontramos esa categoría. <Link to="/categorias">Ver todas</Link></p>}
    <div className="row g-4">{visible.map((category) => <div className="col-12 col-md-6" key={category.id}><Link className={`category-panel ${category.className}`} to={`/productos?categoria=${encodeURIComponent(category.name)}`}><span className="category-icon">{category.icon}</span><div><h2>{category.name}</h2><p>{category.copy}</p>{!loadingProducts && !productsError && <small>{products.filter((product) => product.categoryId === category.id).length} sabores disponibles</small>}</div><span className="category-arrow">→</span></Link></div>)}</div></main>;
}
