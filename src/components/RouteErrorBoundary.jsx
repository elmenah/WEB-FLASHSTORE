import React from 'react';
export default class RouteErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="flash-empty" role="alert"><h1>No pudimos cargar esta página</h1><p>Revisa tu conexión y vuelve a intentarlo.</p><button className="flash-button" onClick={() => window.location.reload()}>Reintentar</button></div>;
    return this.props.children;
  }
}
