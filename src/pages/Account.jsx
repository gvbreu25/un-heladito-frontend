import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../data/useApi.js';
import { formatCLP } from '../services/format.js';

export default function Account() {
  const { user } = useAuth();
  const { data: orders, loading, error } = useApi('/pedidos/mios');
  return <main className="container section-space"><div className="page-heading page-heading-left"><span className="eyebrow">TU ESPACIO</span><h1>Hola, {user.name.split(' ')[0]} 👋</h1><p>Desde aquí puedes continuar comprando y revisar tus pedidos registrados.</p></div><div className="account-grid"><section className="account-card"><span className="account-icon">🛍️</span><h2>Seguir comprando</h2><p>Descubre nuevos sabores y agrega tus favoritos al carrito.</p><Link className="btn btn-primary" to="/productos">Ver catálogo</Link></section><section className="account-card"><span className="account-icon">📦</span><h2>Mis pedidos</h2>{loading && <p role="status">Cargando pedidos…</p>}{error && <p role="alert" className="alert alert-danger">{error}</p>}{orders && <p>{orders.length ? `Tienes ${orders.length} pedido(s).` : 'Todavía no tienes pedidos registrados.'}</p>}{orders?.map((order) => <div className="mini-order" key={order.id}><span>#{order.id}<small>{order.status}</small></span><strong>{formatCLP(order.total)}</strong></div>)}<Link className="back-link" to="/carrito">Ir al carrito →</Link></section></div></main>;
}
