import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../data/useApi.js';
import { useCategories } from '../../data/useCategories.js';
import { api } from '../../services/api.js';
import { formatCLP } from '../../services/format.js';

const initial = { id: '', name: '', categoryId: '', price: '', stock: '', format: '', allergens: '',
  description: '', image: '', offer: false };

export default function AdminDashboard({ vista }) {
  const { user } = useAuth();
  const admin = user.role === 'ADMINISTRADOR';
  return <main className="container section-space">
    <div className="page-heading page-heading-left">
      <h1>{admin ? 'Administración' : 'Consulta de ventas'}</h1>
    </div>
    <nav className="nav nav-pills mb-4" aria-label="Panel de gestión">
      <NavLink end className="nav-link" to="/gestion">Productos</NavLink>
      <NavLink className="nav-link" to="/gestion/pedidos">Pedidos</NavLink>
      {admin && <NavLink className="nav-link" to="/admin/usuarios">Usuarios</NavLink>}
    </nav>
    {vista === 'productos' ? <Productos admin={admin} /> : <Consulta key={vista} vista={vista} />}
  </main>;
}

function Productos({ admin }) {
  const { data, loading, error, reload } = useApi('/productos');
  const { categories, error: categoriesError, loading: loadingCategories } = useCategories();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const change = ({ target }) => setForm((current) => ({
    ...current, [target.name]: target.type === 'checkbox' ? target.checked : target.value,
  }));

  function edit(product) {
    setMessage('');
    setSaveError('');
    setEditing(product?.id ?? null);
    if (product) {
      const { category, ...fields } = product;
      setForm({ ...fields, allergens: fields.allergens || '', image: fields.image || '' });
    } else {
      setForm({ ...initial });
    }
  }

  async function save(event) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setSaveError('');
    setMessage('');
    try {
      const product = { ...form, id: form.id.trim(), categoryId: Number(form.categoryId),
        price: Number(form.price), stock: Number(form.stock) };
      const path = editing ? '/productos/' + encodeURIComponent(editing) : '/productos';
      await api(path, { method: editing ? 'PUT' : 'POST', body: product });
      setMessage(editing ? 'Producto actualizado.' : 'Producto creado.');
      setForm(null);
      reload();
    } catch (failure) {
      setSaveError(failure.message);
    } finally {
      setSending(false);
    }
  }

  async function remove(product) {
    if (sending || !window.confirm('¿Retirar ' + product.name + ' del catálogo?')) return;
    setSending(true);
    setMessage('');
    setSaveError('');
    try {
      await api('/productos/' + encodeURIComponent(product.id), { method: 'DELETE' });
      setMessage('Producto retirado del catálogo.');
      if (editing === product.id) setForm(null);
      reload();
    } catch (failure) {
      setSaveError(failure.message);
    } finally {
      setSending(false);
    }
  }

  return <section>
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-3">
      <h2 className="mb-0">Productos</h2>
      {admin && <button className="btn btn-primary" disabled={sending} onClick={() => edit(null)}>Nuevo producto</button>}
    </div>
    <Alert message={saveError || error} type="danger" />
    <Alert message={message} type="success" />
    {admin && form && <form key={editing ?? 'nuevo'} className="form-panel mb-4" onSubmit={save}>
      <h3>{editing ? 'Editar ' + editing : 'Crear producto'}</h3>
      <Alert message={categoriesError} type="danger" />
      <fieldset disabled={sending} className="row g-3">
        <Field label="Código" name="id" value={form.id} onChange={change} required readOnly={Boolean(editing)}
          pattern="[A-Za-z0-9\-]{1,24}" maxLength="24" />
        <Field label="Nombre" name="name" value={form.name} onChange={change} required maxLength="100" />
        <label className="col-md-6">Categoría
          <select className="form-select mt-1" name="categoryId" value={form.categoryId} onChange={change} required>
            <option value="">{loadingCategories ? 'Cargando…' : 'Selecciona una categoría'}</option>
            {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </label>
        <Field label="Precio CLP" name="price" type="number" min="1" max="1000000" value={form.price} onChange={change} required />
        <Field label="Stock" name="stock" type="number" min="0" max="100000" value={form.stock} onChange={change} required />
        <Field label="Formato" name="format" value={form.format} onChange={change} required maxLength="40" />
        <Field label="Alérgenos" name="allergens" value={form.allergens} onChange={change} maxLength="100" />
        <Field label="Imagen (HTTPS o /images/archivo)" name="image" value={form.image} onChange={change} maxLength="500" />
        <label className="col-12">Descripción<textarea className="form-control mt-1" name="description"
          value={form.description} onChange={change} maxLength="500" required /></label>
        <label className="col-12"><input className="form-check-input me-2" type="checkbox" name="offer"
          checked={form.offer} onChange={change} /> En oferta</label>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loadingCategories}>Guardar producto</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => setForm(null)}>Cancelar</button>
        </div>
      </fieldset>
    </form>}
    {loading && <p role="status">Cargando productos…</p>}
    {data?.length === 0 && <p>No hay productos en el catálogo.</p>}
    {data?.length > 0 && <div className="table-responsive"><table className="table align-middle">
      <thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
      <tbody>{data.map((product) => <tr key={product.id}>
        <td>{product.id}</td><td>{product.name}</td><td>{product.category}</td>
        <td>{formatCLP(product.price)}</td><td>{product.stock}</td>
        <td><div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-secondary btn-sm" to={'/gestion/productos/' + encodeURIComponent(product.id)}>Ver detalle</Link>
          {admin && <>
            <button className="btn btn-outline-primary btn-sm" disabled={sending} onClick={() => edit(product)}>Editar</button>
            <button className="btn btn-outline-danger btn-sm" disabled={sending} onClick={() => remove(product)}>Retirar</button>
          </>}
        </div></td>
      </tr>)}</tbody>
    </table></div>}
  </section>;
}

function Field({ label, ...props }) {
  return <label className="col-md-6">{label}<input className="form-control mt-1" {...props} /></label>;
}

function Consulta({ vista }) {
  const { data, error, loading } = useApi('/' + vista);
  const pedidos = vista === 'pedidos';
  return <section>
    <h2>{pedidos ? 'Pedidos' : 'Usuarios'}</h2>
    {loading && <p role="status">Cargando {vista}…</p>}
    <Alert message={error} type="danger" />
    {data?.length === 0 && <p>Aún no hay {vista} registrados.</p>}
    {data?.length > 0 && <div className="table-responsive"><table className="table align-middle">
      {pedidos ? <><thead><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Detalle</th></tr></thead>
        <tbody>{data.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.customer.name}</td>
          <td>{new Date(order.createdAt).toLocaleString('es-CL')}</td><td>{formatCLP(order.total)}</td>
          <td><Link to={'/gestion/pedidos/' + order.id}>Ver pedido #{order.id}</Link></td>
        </tr>)}</tbody></> : <><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
        <tbody>{data.map((account) => <tr key={account.id}><td>{account.name}</td><td>{account.email}</td>
          <td>{account.role}</td></tr>)}</tbody></>}
    </table></div>}
  </section>;
}
