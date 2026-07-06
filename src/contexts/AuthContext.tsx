import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type ProjectRole = 'editor' | 'viewer';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isBerry: boolean;
  loading: boolean;
  memberships: Record<string, ProjectRole>; // project_id -> role
  roleFor: (projectId: string | undefined) => ProjectRole | 'admin' | null;
  canEdit: (projectId: string | undefined, isSimulation?: boolean) => boolean;
  refreshMemberships: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<Record<string, ProjectRole>>({});
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  const refreshMemberships = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) { setMemberships({}); return; }
    const { data } = await supabase
      .from('project_members')
      .select('project_id, role')
      .eq('user_id', uid);
    const map: Record<string, ProjectRole> = {};
    (data ?? []).forEach((m: { project_id: string; role: ProjectRole }) => {
      map[m.project_id] = m.role;
    });
    setMemberships(map);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id);
        refreshMemberships();
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // setTimeout evita deadlock dentro do callback do Supabase
        setTimeout(() => {
          loadProfile(newSession.user.id);
          refreshMemberships();
        }, 0);
      } else {
        setProfile(null);
        setMemberships({});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile, refreshMemberships]);

  const isAdmin = !!profile?.is_admin;
  const isBerry = !!profile?.email?.endsWith('@berry.com.br');

  const roleFor = useCallback((projectId: string | undefined) => {
    if (!projectId) return null;
    if (isAdmin) return 'admin' as const;
    return memberships[projectId] ?? null;
  }, [isAdmin, memberships]);

  const canEdit = useCallback((projectId: string | undefined, isSimulation?: boolean) => {
    if (isAdmin) return true;
    if (isSimulation && isBerry) return true;
    if (!projectId) return false;
    return memberships[projectId] === 'editor';
  }, [isAdmin, isBerry, memberships]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? traduzErro(error.message) : null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: window.location.origin },
    });
    return { error: error ? traduzErro(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, profile, isAdmin, isBerry, loading,
      memberships, roleFor, canEdit, refreshMemberships, signIn, signUp, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function traduzErro(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.';
  if (msg.includes('Password should be')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  return msg;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
