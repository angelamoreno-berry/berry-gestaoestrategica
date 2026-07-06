import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, ProjectRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Trash2, ShieldCheck, Eye, Pencil } from 'lucide-react';

interface ProjectRow { id: string; name: string; company: string | null; data: { projectType?: string } }
interface ProfileRow { id: string; email: string; name: string | null; is_admin: boolean }
interface MemberRow { id: string; project_id: string; user_id: string; role: ProjectRole }

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isBerry, memberships, loading: authLoading, refreshMemberships } = useAuth();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('viewer');
  const [busy, setBusy] = useState(false);

  const isEditorSomewhere = Object.values(memberships).includes('editor');
  const allowed = isAdmin || isEditorSomewhere;

  const loadAll = useCallback(async () => {
    const [projRes, profRes] = await Promise.all([
      supabase.from('consulting_projects').select('id, name, company, data'),
      supabase.from('profiles').select('id, email, name, is_admin').order('email'),
    ]);
    const projs = ((projRes.data ?? []) as ProjectRow[])
      .filter(p => p.data?.projectType !== 'simulation');
    setProjects(projs);
    setProfiles((profRes.data ?? []) as ProfileRow[]);
  }, []);

  const loadMembers = useCallback(async (projectId: string) => {
    if (!projectId) { setMembers([]); return; }
    const { data } = await supabase
      .from('project_members')
      .select('id, project_id, user_id, role')
      .eq('project_id', projectId);
    setMembers((data ?? []) as MemberRow[]);
  }, []);

  useEffect(() => { if (allowed) loadAll(); }, [allowed, loadAll]);
  useEffect(() => { loadMembers(selectedProject); }, [selectedProject, loadMembers]);
  useEffect(() => {
    if (!authLoading && !allowed) navigate('/');
  }, [authLoading, allowed, navigate]);

  // Editores só gerenciam projetos onde são editores; admin gerencia todos
  const manageableProjects = useMemo(() => {
    if (isAdmin) return projects;
    return projects.filter(p => memberships[p.id] === 'editor');
  }, [projects, isAdmin, memberships]);

  const profileById = useMemo(() => {
    const m: Record<string, ProfileRow> = {};
    profiles.forEach(p => { m[p.id] = p; });
    return m;
  }, [profiles]);

  const handleInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!selectedProject) { toast({ title: 'Selecione um projeto', variant: 'destructive' }); return; }
    if (!email) return;

    const prof = profiles.find(p => p.email === email);
    if (!prof) {
      toast({
        title: 'Usuário não encontrado',
        description: 'A pessoa precisa primeiro criar a conta na tela de cadastro. Depois volte aqui e vincule.',
        variant: 'destructive',
      });
      return;
    }
    if (inviteRole === 'editor' && !email.endsWith('@berry.com.br')) {
      toast({ title: 'Não permitido', description: 'Apenas e-mails @berry.com.br podem ser editores.', variant: 'destructive' });
      return;
    }

    setBusy(true);
    const { error } = await supabase.from('project_members').insert({
      project_id: selectedProject, user_id: prof.id, role: inviteRole,
    });
    setBusy(false);
    if (error) {
      const msg = error.message.includes('duplicate')
        ? 'Essa pessoa já é membro deste projeto.'
        : error.message;
      toast({ title: 'Erro ao vincular', description: msg, variant: 'destructive' });
    } else {
      toast({ title: 'Vinculado!', description: `${email} agora é ${inviteRole === 'editor' ? 'editor' : 'leitor'} do projeto.` });
      setInviteEmail('');
      loadMembers(selectedProject);
      refreshMemberships();
    }
  };

  const handleChangeRole = async (member: MemberRow, role: ProjectRole) => {
    const prof = profileById[member.user_id];
    if (role === 'editor' && prof && !prof.email.endsWith('@berry.com.br')) {
      toast({ title: 'Não permitido', description: 'Apenas e-mails @berry.com.br podem ser editores.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('project_members').update({ role }).eq('id', member.id);
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Permissão atualizada' }); loadMembers(selectedProject); }
  };

  const handleRemove = async (member: MemberRow) => {
    const { error } = await supabase.from('project_members').delete().eq('id', member.id);
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Membro removido' }); loadMembers(selectedProject); }
  };

  if (authLoading || !allowed) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Administração</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Membros por projeto</CardTitle>
            <CardDescription>
              {isAdmin
                ? 'Vincule usuários aos projetos e defina o papel de cada um.'
                : 'Você pode gerenciar os membros dos projetos em que é editor.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Projeto</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
                <SelectContent>
                  {manageableProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="e-mail do usuário já cadastrado"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as ProjectRole)}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Leitor</SelectItem>
                      <SelectItem value="editor">Editor (Berry)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInvite} disabled={busy}>Vincular</Button>
                </div>

                <div className="space-y-2">
                  {members.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum membro vinculado a este projeto ainda.</p>
                  )}
                  {members.map(m => {
                    const prof = profileById[m.user_id];
                    return (
                      <div key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{prof?.name || prof?.email || m.user_id}</p>
                          <p className="text-xs text-muted-foreground truncate">{prof?.email}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="gap-1">
                            {m.role === 'editor' ? <Pencil className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {m.role === 'editor' ? 'Editor' : 'Leitor'}
                          </Badge>
                          <Select value={m.role} onValueChange={(v) => handleChangeRole(m, v as ProjectRole)}>
                            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Leitor</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemove(m)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
