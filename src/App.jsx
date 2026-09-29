import React, { lazy, Suspense } from "react";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";

const Shop2 = lazy(() => import('./pages/Shop2'));
const Club = lazy(() => import('./pages/Club'));
const Recargas = lazy(() => import('./pages/Recargas'));
const Streaming = lazy(() => import('./pages/Streaming'));
const Activaciones = lazy(() => import('./pages/Activaciones'));
const JuegosPC = lazy(() => import('./pages/JuegosPC'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MiCuenta = lazy(() => import('./pages/MiCuenta'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PagoExitoso = lazy(() => import('./pages/PagoExitoso'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPopup from "./components/CartPopup";
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const PagoFallido = lazy(() => import('./pages/PagoFallido'));
const MetodosPago = lazy(() => import('./pages/MetodosPago'));
import { CartProvider } from './context/CartContext';

const App = () => {
  const location = useLocation();

  // Rutas donde no se debe mostrar el header y el footer
  const hideHeaderFooter = ["/login", "/register"];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Mostrar el header solo si no estamos en login o register */}
        {!hideHeaderFooter.includes(location.pathname) && <Header />}
        <main id="main-content" className={hideHeaderFooter.includes(location.pathname) ? "flex-grow" : "flex-grow flash-page-content"}>
          <RouteErrorBoundary key={location.pathname}><Suspense fallback={<div className="flash-empty" role="status" aria-busy="true">Cargando página…</div>}><Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/terminos" element={  <TermsAndConditions /> } />
            <Route path="/metodos-de-pago" element={<MetodosPago />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="/shop" element={<Shop2 />} />
            <Route path="/club" element={ <AuthGuard> <Club /> </AuthGuard>} />
            <Route path="/recargas" element={ <AuthGuard> <Recargas /> </AuthGuard>} />
            <Route path="/streaming" element={ <AuthGuard> <Streaming /> </AuthGuard>} />
            <Route path="/activaciones" element={ <AuthGuard> <Activaciones /> </AuthGuard>} />
            <Route path="/juegos-pc" element={  <JuegosPC /> } />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
            
            {/* Rutas protegidas */}
            <Route
              path="/micuenta"
              element={
                <AuthGuard>
                  <MiCuenta />
                </AuthGuard>
              }
            />
            <Route
              path="/checkout"
              element={
                <AuthGuard>
                  <Checkout />
                </AuthGuard>
              }
            />
            {/* ✅ Agregar ruta del Dashboard aquí */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route path="*" element={<div className="flash-empty"><h1>Página no encontrada</h1><a className="flash-button" href="/shop">Ir a la tienda</a></div>} />
          </Routes></Suspense></RouteErrorBoundary>
        </main>

        {/* 👇 Carrito montado aquí */}
        <CartPopup />
        {/* Mostrar el footer solo si no estamos en login o register */}
        {!hideHeaderFooter.includes(location.pathname) && <Footer />}
      </div>
    </CartProvider>
  );
};

export default App;
