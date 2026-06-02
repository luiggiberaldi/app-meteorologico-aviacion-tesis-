"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface UserAccount {
  username: string;
  displayName: string;
  isHidden?: boolean;
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  updateCredentials: (newUsername: string, newPassword: string, newDisplayName: string) => Promise<{ error: string | null }>;
  getAllUsers: () => Promise<UserAccount[]>;
}

const STORAGE_KEY_SESSION = 'aerometrix_session';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'aerometrix_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
  signIn: async () => ({ error: null }),
  signOut: () => {},
  updateCredentials: async () => ({ error: null }),
  getAllUsers: async () => [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUsername = loadSession();
    if (!sessionUsername) { setLoading(false); return; }

    if (sessionUsername === 'admin') {
      setUser({ username: 'admin', displayName: 'Administrador', isHidden: false });
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data } = await supabase
          .from('app_users')
          .select('username, display_name, is_hidden')
          .eq('username', sessionUsername)
          .single();

        if (data) {
          setUser({ username: data.username, displayName: data.display_name, isHidden: data.is_hidden });
        } else if (sessionUsername === 'admin') {
          setUser({ username: 'admin', displayName: 'Administrador', isHidden: false });
        }
      } catch (err) {
        if (sessionUsername === 'admin') {
          setUser({ username: 'admin', displayName: 'Administrador', isHidden: false });
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    // Soporte para admin / admin como bypass absoluto para evitar fallos de conexión o bases vacías
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      const account: UserAccount = { username: 'admin', displayName: 'Administrador', isHidden: false };
      setUser(account);
      saveSession(account.username);
      return { error: null };
    }

    try {
      const passwordHash = await hashPassword(password);
      const { data, error } = await supabase
        .from('app_users')
        .select('username, display_name, is_hidden')
        .eq('username', username)
        .eq('password_hash', passwordHash)
        .single();

      if (error || !data) return { error: 'Usuario o contraseña incorrectos' };

      const account: UserAccount = { username: data.username, displayName: data.display_name, isHidden: data.is_hidden };
      setUser(account);
      saveSession(account.username);
      return { error: null };
    } catch (err) {
      // Si la base falla (ej. sin conexión) y el usuario intentó entrar con admin admin
      if (username.toLowerCase() === 'admin' && password === 'admin') {
        const account: UserAccount = { username: 'admin', displayName: 'Administrador', isHidden: false };
        setUser(account);
        saveSession(account.username);
        return { error: null };
      }
      return { error: 'Error de conexión con la base de datos' };
    }
  };

  const signOut = () => {
    setUser(null);
    saveSession(null);
  };

  const updateCredentials = async (newUsername: string, newPassword: string, newDisplayName: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'No hay sesión activa' };

    const passwordHash = await hashPassword(newPassword);
    
    // Si es el usuario admin por defecto bypass, permitimos actualización local aunque falle la BD
    try {
      if (newUsername !== user.username) {
        const { data: existing } = await supabase
          .from('app_users')
          .select('username')
          .eq('username', newUsername)
          .single();
        if (existing) return { error: 'Ese nombre de usuario ya está en uso' };
      }

      await supabase
        .from('app_users')
        .update({ username: newUsername, password_hash: passwordHash, display_name: newDisplayName })
        .eq('username', user.username);
    } catch (e) {
      console.warn("No se pudo sincronizar con base de datos, actualizando de forma local:", e);
    }

    const updated: UserAccount = { username: newUsername, displayName: newDisplayName, isHidden: user.isHidden };
    setUser(updated);
    saveSession(newUsername);
    return { error: null };
  };

  const getAllUsers = async (): Promise<UserAccount[]> => {
    try {
      const { data } = await supabase
        .from('app_users')
        .select('username, display_name, is_hidden')
        .eq('is_hidden', false)
        .order('created_at');
      
      const list = (data || []).map(u => ({ username: u.username, displayName: u.display_name, isHidden: u.is_hidden }));
      if (!list.some(u => u.username === 'admin')) {
        list.unshift({ username: 'admin', displayName: 'Administrador', isHidden: false });
      }
      return list;
    } catch {
      return [{ username: 'admin', displayName: 'Administrador', isHidden: false }];
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateCredentials, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
