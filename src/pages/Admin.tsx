import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, ProjectRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Users, ShieldCheck, Building2, UserPlus, KeyRound } from 'lucide-react';

interface ProjectRow { id: string; name: string; data: { projectType?: string } }
interface ProfileRow { id: string; email: string; name: string | null; is_admin: boolean }
interface MemberRow { id: string; project_id: string; user_id: string; role: ProjectRole }

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, memberships, loading: authLoading, refreshMemberships, inviteUser, resetPassword } = useAuth();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [busyKey, setBusyKey] = useState<string>('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);

  const isEditorSomewhere = Object.values(memberships).includes('editor');
  const allowed = isAdmin || isEditorSomewhere;

  const loadAll = useCallback(async () => {
    const [projRes, profRes, memRes] = await Promise.all([
      supabase.from('consulting_projects').select('id, name, data').order('name'),
      supabase.from('profiles').select('id, email, name, is_admin').order('email'),
      supabase.from('project_members').select('id, project_id, user_id, role'),
    ]);
    setProjects(((projRes.data ?? []) as ProjectRow[]).filter(p => p.data?.projectType !== 'simulation'));
    setProfiles((profRes.data ?? []) as ProfileRow[]);
    setMembers((memRes.data ?? []) as MemberRow[]);
  }, []);

  useEffect(() => { if (allowed) loadAll(); }, [allowed, loadAll]);
  useEffect(() => { if (!authLoading && !allowed) navigate('/'); }, [authLoading, allowed, navigate]);

  const manageableProjects = useMemo(
    () => (isAdmin ? projects : projects.filter(p => memberships[p.id] === 'editor')),
    [projects, isAdmin, memberships]
  );

  const profileById = useMemo(() => {
    const m: Record<string, ProfileRow> = {};
    profiles.forEach(p => { m[p.id] = p; });
    return m;
  }, [profiles]);

  const memberOf = useCallback((projectId: string, userId: string) =>
    members.find(m => m.project_id === projectId && m.user_id === userId),
  [members]);

  const setRole = async (projectId: string, userId: string, role: ProjectRole | null) => {
    const prof = profileById[userId];
    if (role === 'editor' && prof && !prof.email.endsWith('@berry.com.br')) {
      toast({ title: 'Não permitido', description: 'Apenas e-mails @berry.com.br podem ser editores.', variant: 'destructive' });
      return;
    }
    const key = projectId + userId;
    setBusyKey(key);
    const existing = memberOf(projectId, userId);
    let error = null;
    let newId = existing?.id ?? '';
    if (role === null) {
      if (existing) ({ error } = await supabase.from('project_members').delete().eq('id', existing.id));
    } else if (existing) {
      if (existing.role !== role) ({ error } = await supabase.from('project_members').update({ role }).eq('id', existing.id));
    } else {
      const res = await supabase.from('project_members')
        .insert({ project_id: projectId, user_id: userId, role })
        .select('id').single();
      error = res.error;
      newId = res.data?.id ?? '';
    }
    setBusyKey('');
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setMembers(prev => {
        const rest = prev.filter(m => !(m.project_id === projectId && m.user_id === userId));
        return role === null ? rest : [...rest, { id: newId, project_id: projectId, user_id: userId, role }];
      });
      refreshMemberships();
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setInviteBusy(true);
    const { error } = await inviteUser(email);
    setInviteBusy(false);
    if (error) {
      toast({ title: 'Erro ao convidar', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Convite enviado!', description: `${email} recebeu um e-mail para definir a senha. Depois, marque as permissões dele aqui.` });
      setInviteEmail('');
      setInviteOpen(false);
      setTimeout(loadAll, 800);
    }
  };

  const handleSendReset = async (email: string) => {
    const { error } = await resetPassword(email);
    if (error) toast({ title: 'Erro', description: error, variant: 'destructive' });
    else toast({ title: 'Link enviado!', description: `${email} recebeu o e-mail para definir nova senha.` });
  };

  const RoleToggle = ({ projectId, userId }: { projectId: string; userId: string }) => {
    const current = memberOf(projectId, userId)?.role ?? null;
    const busy = busyKey === projectId + userId;
    const prof = profileById[userId];
    const canBeEditor = !!prof?.email.endsWith('@berry.com.br');
    const opts: { label: string; value: ProjectRole | null; disabled?: boolean }[] = [
      { label: 'Nenhum', value: null },
      { label: 'Leitor', value: 'viewer' },
      { label: 'Editor', value: 'editor', disabled: !canBeEditor },
    ];
    return (
      <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
        {opts.map(o => (
          <button
            key={o.label}
            disabled={busy || o.disabled}
            onClick={() => setRole(projectId, userId, o.value)}
            title={o.disabled ? 'Apenas e-mails @berry.com.br podem ser editores' : undefined}
            className={`px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
              current === o.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  };

  if (authLoading || !allowed) return null;

  const selectedProfile = profileById[selectedUser];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Administração</h1>
          </div>
          {isAdmin && (
            <Button size="sm" onClick={() => setInviteOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" /> Convidar usuário
            </Button>
          )}
        </div>

        <Tabs defaultValue="por-usuario">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="por-usuario" className="gap-2"><Users className="w-4 h-4" /> Por usuário</TabsTrigger>
            <TabsTrigger value="por-projeto" className="gap-2"><Building2 className="w-4 h-4" /> Por projeto</TabsTrigger>
          </TabsList>

        {/* POR USUÁRIO: marca papéis em vários projetos de uma vez */}
          <TabsContent value="por-usuario">
            <Card>
              <CardHeader>
                <CardTitle>Permissões por usuário</CardTitle>
                <CardDescription>Selecione o usuário e marque o papel dele em cada projeto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger><SelectValue placeholder="Selecione um usuário" /></SelectTrigger>
                  <SelectContent>
                    {profiles.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.email}{p.is_admin ? ' — admin' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProfile?.is_admin && (
                  <p className="text-sm text-primary bg-primary/10 rounded-lg p-3">
                    Este usuário é admin: já tem acesso total a todos os projetos. Não precisa de vínculos.
                  </p>
                )}

                {selectedUser && !selectedProfile?.is_admin && (
                  <div className="space-y-2">
                    {manageableProjects.map(p => (
                      <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card">
                        <p className="font-medium text-foreground truncate">{p.name}</p>
                        <RoleToggle projectId={p.id} userId={selectedUser} />
                      </div>
                    ))}
                    {manageableProjects.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum projeto disponível para gerenciar.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        {/* POR PROJETO: confere quem tem acesso a um cliente */}
          <TabsContent value="por-projeto">
            <Card>
              <CardHeader>
                <CardTitle>Membros por projeto</CardTitle>
                <CardDescription>Veja e ajuste quem acessa um projeto específico.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
                  <SelectContent>
                    {manageableProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProject && (
                  <div className="space-y-2">
                    {profiles.filter(p => !p.is_admin).map(p => (
                      <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{p.name || p.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                        </div>
                        <RoleToggle projectId={selectedProject} userId={p.id} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Usuários cadastrados</CardTitle>
              <CardDescription>Todos que criaram conta na plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{p.name || p.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.is_admin && <Badge className="bg-primary text-primary-foreground">Admin</Badge>}
                    {!p.is_admin && p.email.endsWith('@berry.com.br') && <Badge variant="outline">Berry</Badge>}
                    {!p.is_admin && !p.email.endsWith('@berry.com.br') && <Badge variant="secondary">Cliente</Badge>}
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleSendReset(p.email)}>
                      <KeyRound className="w-3.5 h-3.5" /> Nova senha
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Convidar usuário
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">E-mail</Label>
              <Input id="invite-email" type="email" required value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="pessoa@empresa.com" />
              <p className="text-xs text-muted-foreground">
                A pessoa recebe um e-mail com link para definir a senha.
                Depois do convite, marque as permissões dela nos projetos.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={inviteBusy}>
              {inviteBusy ? 'Enviando...' : 'Enviar convite'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
