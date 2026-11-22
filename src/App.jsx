import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Alert from './components/Alert.jsx';
import { RutaProtegida, Tienda } from './components/Acceso.jsx';
import { useCart } from './context/CartContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Categories from './pages/Categories.jsx';
import Offers from './pages/Offers.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentResult from './pages/PaymentResult.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Account from './pages/Account.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import GestionDetalle from './pages/admin/GestionDetalle.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const { notice, dismissNotice } = useCart();
  const { user, loading, sessionError } = useAuth();
  const vendedor = user?.role === 'VENDEDOR';

  return <div className="app-shell">
    <Navbar />
    {sessionError && user && <div className="container"><Alert message={sessionError} type="danger" /></div>}
    {notice && !vendedor && <div className="container global-notice">
      <Alert message={notice} type="success" onClose={dismissNotice} />
    </div>}
    {loading ? <main className="container section-space" role="status">Verificando sesión…</main> : <Routes>
      <Route element={<Tienda />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<RutaProtegida roles={['CLIENTE', 'ADMINISTRADOR']} />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/resultado-pago" element={<PaymentResult />} />
        <Route path="/mi-cuenta" element={<Account />} />
        <Route path="/comprador" element={<Navigate to="/mi-cuenta" replace />} />
      </Route>
      <Route element={<RutaProtegida roles={['ADMINISTRADOR', 'VENDEDOR']} />}>
        <Route path="/gestion" element={<AdminDashboard vista="productos" />} />
        <Route path="/gestion/productos/:id" element={<GestionDetalle tipo="productos" />} />
        <Route path="/gestion/pedidos" element={<AdminDashboard vista="pedidos" />} />
        <Route path="/gestion/pedidos/:id" element={<GestionDetalle tipo="pedidos" />} />
      </Route>
      <Route element={<RutaProtegida roles={['ADMINISTRADOR']} />}>
        <Route path="/admin" element={<Navigate to="/gestion" replace />} />
        <Route path="/admin/usuarios" element={<AdminDashboard vista="usuarios" />} />
      </Route>
      <Route path="*" element={vendedor ? <Navigate to="/gestion" replace /> : <NotFound />} />
    </Routes>}
    {!vendedor && !loading && <Footer />}
  </div>;
}
