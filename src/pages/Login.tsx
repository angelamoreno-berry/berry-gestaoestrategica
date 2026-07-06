import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(loginData.email.trim(), loginData.password);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao entrar', description: error, variant: 'destructive' });
    } else {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(signupData.email.trim(), signupData.password, signupData.name.trim());
    setLoading(false);
    if (error) {
      toast({ title: 'Erro no cadastro', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Cadastro realizado!', description: 'Você já pode entrar. Peça a um administrador para vincular você aos projetos.' });
      setLoginData({ email: signupData.email, password: '' });
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
          <h1 className="text-3xl font-bold text-foreground">Berry — Gestão Estratégica</h1>
          <p className="text-muted-foreground mt-2">Entre para acessar seus projetos</p>
        </div>

        <Card>
          <Tabs defaultValue="login">
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input id="login-email" type="email" required value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input id="login-password" type="password" required value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
                    <Input id="signup-name" required value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input id="signup-email" type="email" required value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input id="signup-password" type="password" required minLength={6} value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Criar conta'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Após o cadastro, um administrador precisa vincular você aos projetos.
                  </p>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
