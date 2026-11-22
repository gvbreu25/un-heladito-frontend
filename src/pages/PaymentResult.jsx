import { Link, useLocation, Navigate } from 'react-router-dom';
import { formatCLP } from '../services/format.js';

export default function PaymentResult() {
  const { state } = useLocation();
  if (!state?.order) return <Navigate to="/mi-cuenta" replace />;
  const { order } = state;
  return <main className="container section-space"><section className="result-card result-success">
    <div className="result-icon">✓</div><h1>Pedido registrado</h1>
    <p>Puedes consultar el pedido en tu cuenta.</p>
    <div className="order-code">Número de pedido <strong>#{order.id}</strong></div>
    <div className="result-order-lines">{order.items.map((item) => <div key={item.id}>
      <span>{item.qty} × {item.name}</span><strong>{formatCLP(item.subtotal)}</strong>
    </div>)}</div>
    <div className="summary-total"><span>Total</span><strong>{formatCLP(order.total)}</strong></div>
    <div className="hero-actions justify-content-center"><Link className="btn btn-primary" to="/mi-cuenta">Ver mi cuenta</Link>
      <Link className="btn btn-quiet" to="/productos">Volver al catálogo</Link></div>
  </section></main>;
}
