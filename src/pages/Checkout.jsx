import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCLP, validateCheckoutForm } from '../services/format.js';
import { api } from '../services/api.js';
import Alert from '../components/Alert.jsx';

const regions = ['Región Metropolitana', 'Valparaíso', 'Biobío', 'Coquimbo', 'La Araucanía', 'Los Lagos'];
const initialForm = { name: '', email: '', street: '', region: '', commune: '', delivery: 'Domicilio estándar', notes: '' };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ ...initialForm, name: user?.name || '', email: user?.email || '' }));
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [sending, setSending] = useState(false);
  if (!items.length) return <main className="container section-space empty-state"><span>🍦</span><h1>Primero llena tu carrito</h1><p>Agrega al menos un producto antes de comenzar el checkout.</p><Link className="btn btn-primary" to="/productos">Ver productos</Link></main>;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) { setNotice('Revisa los campos marcados antes de continuar.'); return; }
    if (sending) return;
    setSending(true);
    setNotice('');
    try {
      const order = await api('/pedidos', { method: 'POST', body: {
        ...form,
        items: items.map(({ id, qty }) => ({ productId: id, quantity: qty })),
      } });
      clearCart();
      navigate('/resultado-pago', { replace: true, state: { order } });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSending(false);
    }
  };
  return <main className="container section-space"><div className="page-heading page-heading-left"><span className="eyebrow">ÚLTIMO PASO</span><h1>Datos del pedido</h1><p>Completa los datos para registrar tu pedido. La confirmación no genera un cobro.</p></div><div className="checkout-layout"><form className="form-panel" onSubmit={submit} noValidate><Alert message={notice} type="warning" />
      <h2>Información del cliente</h2><div className="form-grid"><Field name="name" label="Nombre completo" value={form.name} onChange={update} error={errors.name} /><Field name="email" label="Correo electrónico" type="email" value={form.email} onChange={update} error={errors.email} /><Field name="street" label="Calle y número" value={form.street} onChange={update} error={errors.street} /><div className="form-group"><label htmlFor="region">Región</label><select id="region" name="region" value={form.region} onChange={update} className={`form-select ${errors.region ? 'is-invalid' : ''}`}><option value="">Selecciona región</option>{regions.map((region) => <option key={region}>{region}</option>)}</select>{errors.region && <small className="field-error">{errors.region}</small>}</div><Field name="commune" label="Comuna" value={form.commune} onChange={update} error={errors.commune} /><div className="form-group"><label htmlFor="delivery">Opción de entrega</label><select id="delivery" name="delivery" value={form.delivery} onChange={update} className="form-select"><option>Domicilio estándar</option><option>Retiro en tienda</option></select></div><div className="form-group form-span"><label htmlFor="notes">Indicaciones (opcional)</label><textarea id="notes" name="notes" value={form.notes} onChange={update} className="form-control" rows="3" placeholder="Referencias para la entrega" /></div></div>
      <button className="btn btn-primary btn-lg w-100 mt-4" type="submit" disabled={sending}>{sending ? 'Registrando…' : 'Confirmar pedido'}</button></form>
      <aside className="order-summary"><h2>Resumen del pedido</h2>{items.map((item) => <div className="checkout-product" key={item.id}><span>{item.qty} × {item.name}</span><strong>{formatCLP(item.qty * item.price)}</strong></div>)}<div className="summary-total"><span>Total estimado</span><strong>{formatCLP(total)}</strong></div><Link className="back-link" to="/carrito">← Volver al carrito</Link></aside></div></main>;
}

function Field({ name, label, type = 'text', value, onChange, error }) {
  return <div className="form-group"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} className={`form-control ${error ? 'is-invalid' : ''}`} />{error && <small className="field-error">{error}</small>}</div>;
}
