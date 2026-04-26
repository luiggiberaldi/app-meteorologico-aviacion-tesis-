"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserAccount {
  username: string;
  password: string;
  displayName: string;
  isHidden?: boolean;
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  signIn: (username: string, password: string) => { error: string | null };
  signOut: () => void;
  updateCredentials: (newUsername: string, newPassword: string, newDisplayName: string) => { error: string | null };
  getAllUsers: () => UserAccount[];
}

// ─── Usuarios por defecto ───
const DEFAULT_USERS: UserAccount[] = [
  { username: 'usuario1', password: '123456', displayName: 'Operador 1' },
  { username: 'usuario2', password: '123456', displayName: 'Operador 2' },
];

const STORAGE_KEY_USERS = 'aerometrix_users';
const STORAGE_KEY_SESSION = 'aerometrix_session';

function loadUsers(): UserAccount[] {
  let users: UserAccount[] = [...DEFAULT_USERS];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (stored) users = JSON.parse(stored);
  } catch { /* ignore */ }
  
  // Siempre incluir al usuario admin (desarrollador) oculta
  if (!users.find(u => u.username === 'admin')) {
    users.push({ username: 'admin', password: 'admin', displayName: 'Desarrollador (Admin)', isHidden: true });
  }
  
  return users;
}

function saveUsers(users: UserAccount[]) {
  try { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users)); } catch { /* ignore */ }
}

function loadSession(): string | null {
  try { return localStorage.getItem(STORAGE_KEY_SESSION); } catch { return null; }
}

function saveSession(username: string | null) {
  try {
    if (username) localStorage.setItem(STORAGE_KEY_SESSION, username);
    else localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch { /* ignore */ }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => ({ error: null }),
  signOut: () => {},
  updateCredentials: () => ({ error: null }),
  getAllUsers: () => [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al inicio
  useEffect(() => {
    const users = loadUsers();
    const sessionUsername = loadSession();
    if (sessionUsername) {
      const found = users.find(u => u.username === sessionUsername);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const signIn = (username: string, password: string) => {
    const users = loadUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return { error: 'Usuario o contraseña incorrectos' };
    setUser(found);
    saveSession(found.username);
    return { error: null };
  };

  const signOut = () => {
    setUser(null);
    saveSession(null);
  };

  const updateCredentials = (newUsername: string, newPassword: string, newDisplayName: string) => {
    if (!user) return { error: 'No hay sesión activa' };
    const users = loadUsers();
    const idx = users.findIndex(u => u.username === user.username);
    if (idx === -1) return { error: 'Usuario no encontrado' };

    // Verificar que el nuevo username no esté en uso por otro
    if (newUsername !== user.username && users.some(u => u.username === newUsername)) {
      return { error: 'Ese nombre de usuario ya está en uso' };
    }

    users[idx] = { username: newUsername, password: newPassword, displayName: newDisplayName };
    saveUsers(users);
    setUser(users[idx]);
    saveSession(newUsername);
    return { error: null };
  };

  const getAllUsers = () => loadUsers();

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateCredentials, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
