import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import * as AuthHook from '../../hooks/useAuth';

vi.mock('../../services/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));
vi.mock('../../hooks/useAuth');

describe('ProtectedRoute Component Tests', () => {
  it('renders loading spinner when auth state is loading', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: true,
      error: null,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Verificando sesión/i)).toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: false,
      error: null,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Contenido Protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Vista de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Vista de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
      currentUser: { uid: '123', email: 'test@matecode.com' } as any,
      userProfile: { uid: '123', email: 'test@matecode.com', displayName: 'Test', photoURL: null },
      loading: false,
      error: null,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Contenido Protegido</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
  });
});