import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // O link do e-mail autentica a sessão automaticamente (evento PASSWORD_RECOVERY)
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast({ title: 'As senhas não conferem', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await updatePassword(newPw);
    setBusy(false);
    if (error) {
      toast({ title: 'Erro ao definir senha', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Senha definida!', description: 'Você já está conectado.' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="w-3.5 h-3.5 rounded-full bg-accent inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-primary inline-block" />
            <span className="w-3.5 h-3.5 rounded-full border-2 border-primary inline-block" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Definir nova senha</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="w-5 h-5" /> Nova senha
            </CardTitle>
            <CardDescription>
              {ready
                ? 'Escolha sua nova senha de acesso.'
                : 'Validando o link... Se esta tela persistir, o link pode ter expirado — peça um novo.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw">Nova senha</Label>
                <Input id="pw" type="password" required minLength={6} value={newPw}
                  onChange={(e) => setNewPw(e.target.value)} disabled={!ready} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw2">Confirmar nova senha</Label>
                <Input id="pw2" type="password" required minLength={6} value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)} disabled={!ready} />
              </div>
              <Button type="submit" className="w-full" disabled={!ready || busy}>
                {busy ? 'Salvando...' : 'Salvar e entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
