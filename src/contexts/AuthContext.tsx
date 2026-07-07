import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User, createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type ProjectRole = 'editor' | 'viewer';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isBerry: boolean;
  loading: boolean;
  memberships: Record<string, ProjectRole>;
  roleFor: (projectId: string | undefined) => ProjectRole | 'admin' | null;
  canEdit: (projectId: string | undefined, isSimulation?: boolean) => boolean;
  refreshMemberships: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ error: string | null }>;
  inviteUser: (email: string) => Promise<{ error: string | null }>;
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
      .select('id, email, name, is_admin, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) await loadProfile(data.session.user.id);
  }, [loadProfile]);

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

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    return { error: error ? traduzErro(error.message) : null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error ? traduzErro(error.message) : null };
  };

  const uploadAvatar = async (file: File) => {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return { error: 'Sessão expirada.' };
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${uid}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) return { error: upErr.message };
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const { error: updErr } = await supabase.from('profiles').update({ avatar_url: pub.publicUrl }).eq('id', uid);
    if (updErr) return { error: updErr.message };
    await refreshProfile();
    return { error: null };
  };

  // Convite sem Edge Function: cria a conta com senha temporária num cliente
  // secundário (não afeta a sessão do admin) e dispara o e-mail de definição de senha.
  const inviteUser = async (email: string) => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const inviteClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const tempPassword = crypto.randomUUID() + crypto.randomUUID();
    const { error: signErr } = await inviteClient.auth.signUp({
      email,
      password: tempPassword,
      options: { emailRedirectTo: `${window.location.origin}/redefinir-senha` },
    });
    if (signErr && !signErr.message.includes('already registered')) {
      return { error: traduzErro(signErr.message) };
    }
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (resetErr) return { error: traduzErro(resetErr.message) };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, profile, isAdmin, isBerry, loading,
      memberships, roleFor, canEdit, refreshMemberships, refreshProfile,
      signIn, signUp, signOut, resetPassword, updatePassword, uploadAvatar, inviteUser,
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
  if (msg.includes('rate limit') || msg.includes('Too many')) return 'Limite de e-mails atingido. Aguarde alguns minutos e tente novamente.';
  return msg;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
