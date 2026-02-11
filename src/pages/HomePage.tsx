import { useNavigate } from 'react-router-dom';
import { Building2, FlaskConical, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ferramenta de Estruturação
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie e estruture o essencial da gestão de cada empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group"
            onClick={() => navigate('/projetos')}
          >
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Projetos Reais</CardTitle>
              <CardDescription className="text-base">
                Crie e gerencie projetos de consultoria com dados reais das empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                <span>Acessar projetos</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group"
            onClick={() => navigate('/simulacao')}
          >
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-accent/50 w-fit mb-3">
                <FlaskConical className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Simulação</CardTitle>
              <CardDescription className="text-base">
                Simule projetos com dados gerados automaticamente para demonstrações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-accent-foreground font-medium group-hover:gap-3 transition-all">
                <span>Acessar simulações</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
