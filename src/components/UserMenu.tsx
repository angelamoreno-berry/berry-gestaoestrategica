import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Camera, KeyRound, LogOut, ChevronDown, ShieldCheck, Sun, Moon, Monitor, Palette, Check } from 'lucide-react';

export function UserMenu() {
  const navigate = useNavigate();
  const { profile, isAdmin, memberships, signOut, updatePassword, uploadAvatar } = useAuth();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [busy, setBusy] = useState(false);

  const isEditorSomewhere = Object.values(memberships).includes('editor');
  const showAdmin = isAdmin || isEditorSomewhere;

  const initials = (profile?.name || profile?.email || '?')
    .split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  const roleLabel = isAdmin ? 'ADMIN' : isEditorSomewhere ? 'EDITOR' : 'CONSULTA';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Imagem muito grande', description: 'Escolha uma imagem de até 2MB.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await uploadAvatar(file);
    setBusy(false);
    if (error) toast({ title: 'Erro ao enviar foto', description: error, variant: 'destructive' });
    else toast({ title: 'Foto atualizada!' });
    e.target.value = '';
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast({ title: 'As senhas não conferem', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await updatePassword(newPw);
    setBusy(false);
    if (error) toast({ title: 'Erro ao alterar senha', description: error, variant: 'destructive' });
    else {
      toast({ title: 'Senha alterada com sucesso!' });
      setPwOpen(false);
      setNewPw(''); setConfirmPw('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.name ?? ''} />
              <AvatarFallback className="text-xs bg-primary/15 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">{profile?.name || profile?.email}</p>
              <p className="text-[10px] text-muted-foreground tracking-wider">{roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => fileRef.current?.click()} disabled={busy}>
            <Camera className="w-4 h-4 mr-2" /> Alterar foto de perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPwOpen(true)}>
            <KeyRound className="w-4 h-4 mr-2" /> Alterar senha
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="w-4 h-4 mr-2" /> Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 mr-2" /> Claro
                  {theme === 'light' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 mr-2" /> Escuro
                  {theme === 'dark' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 mr-2" /> Sistema
                  {theme === 'system' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {showAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                <ShieldCheck className="w-4 h-4 mr-2" /> Administração
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" /> Alterar senha
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePassword} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="new-pw">Nova senha</Label>
              <Input id="new-pw" type="password" required minLength={6} value={newPw}
                onChange={(e) => setNewPw(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirmar nova senha</Label>
              <Input id="confirm-pw" type="password" required minLength={6} value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Salvando...' : 'Salvar nova senha'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
