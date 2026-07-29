import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckSquare, LogOut, Mail, User } from 'lucide-react';

interface NavbarProps {
  onOpenEmailModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmailModal }) => {
  const { userProfile, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand-logo">
          <CheckSquare size={26} color="var(--color-primary)" />
          <span>MateCode</span> TaskManager
        </div>

        {userProfile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={onOpenEmailModal}
              className="btn btn-secondary"
              title="Enviar resumen de tareas por email"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
            >
              <Mail size={16} />
              <span className="hide-mobile">Enviar Resumen</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid var(--color-border)',
              }}
            >
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName || 'Avatar'}
                  style={{ width: '26px', height: '26px', borderRadius: '50%' }}
                />
              ) : (
                <User size={18} color="var(--color-text-secondary)" />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {userProfile.displayName || userProfile.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary btn-icon"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
