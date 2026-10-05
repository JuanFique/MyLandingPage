// A diferencia de layout.js, un template se VUELVE A CREAR en cada navegación.
// Por eso la animación de entrada (CSS .page-enter) se repite al cambiar de página.
// (El layout, en cambio, se mantiene: el header y el footer no parpadean.)
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
