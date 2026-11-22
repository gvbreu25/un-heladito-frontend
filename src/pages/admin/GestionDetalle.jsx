import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../data/useApi.js';
import { formatCLP } from '../../services/format.js';
import Alert from '../../components/Alert.jsx';

export default function GestionDetalle({ tipo }) {
  const { id } = useParams();
  const { data, error, loading } = useApi('/' + tipo + '/' + encodeURIComponent(id));
  const producto = tipo === 'productos';
  return <main className="container section-space">
    <Link className="back-link" to={producto ? '/gestion' : '/gestion/pedidos'}>← Volver al listado</Link>
    {loading && <p role="status">Cargando detalle…</p>}
    {error && <Alert message={error} type="danger" />}
    {data && (producto ? <section className="form-panel">
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <dl>
        <dt>Código</dt><dd>{data.id}</dd>
        <dt>Categoría</dt><dd>{data.category}</dd>
        <dt>Precio y formato</dt><dd>{formatCLP(data.price)} · {data.format}</dd>
        <dt>Stock</dt><dd>{data.stock}</dd>
        <dt>Alérgenos</dt><dd>{data.allergens || 'Consultar'}</dd>
      </dl>
    </section> : <section className="form-panel">
      <h1>Pedido #{data.id}</h1>
      <p>{new Date(data.createdAt).toLocaleString('es-CL')} · {data.status}</p>
      <p>{data.customer.name} · {data.customer.email}</p>
      <p>{data.customer.delivery} · {data.customer.street}, {data.customer.commune}, {data.customer.region}</p>
      {data.customer.notes && <p>{data.customer.notes}</p>}
      <ul>{data.items.map((item) => <li key={item.id}>{item.qty} × {item.name} · {formatCLP(item.subtotal)}</li>)}</ul>
      <strong>Total {formatCLP(data.total)}</strong>
    </section>)}
  </main>;
}
