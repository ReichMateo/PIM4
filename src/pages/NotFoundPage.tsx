import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-center full-screen-loader" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', maxWidth: '480px', width: '100%' }}>
        <AlertTriangle size={56} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
          Página no encontrada
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          La ruta que intentas consultar no existe o ha sido movida.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
          <Home size={18} /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
};
