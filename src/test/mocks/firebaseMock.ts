import { vi } from 'vitest';

export const mockUser = {
  uid: 'user-123',
  email: 'test@matecode.com',
  displayName: 'Test User',
  photoURL: null,
};

export const mockTasks = [
  {
    id: 'task-1',
    userId: 'user-123',
    title: 'Diseñar wireframes en Figma',
    description: 'Wireframes para la app web de tareas',
    completed: false,
    priority: 'high' as const,
    dueDate: '2026-12-31',
    order: 1,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'task-2',
    userId: 'user-123',
    title: 'Configurar Firebase Auth',
    description: 'Autenticación por email y Google',
    completed: true,
    priority: 'medium' as const,
    dueDate: '2026-06-01',
    order: 2,
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-01T10:00:00.000Z',
  },
];

// Mock Firebase Modules
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: mockUser,
  },
  db: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: mockUser })),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(mockUser);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-task-id' })),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((_q, callback) => {
    callback({
      docs: mockTasks.map((t) => ({
        id: t.id,
        data: () => t,
      })),
    });
    return () => {};
  }),
  writeBatch: vi.fn(() => ({
    update: vi.fn(),
    commit: vi.fn(() => Promise.resolve()),
  })),
}));
