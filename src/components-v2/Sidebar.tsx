import { useNavigate } from 'react-router-dom';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { ProgressRing } from './ProgressRing';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, Building2 } from 'lucide-react';
import { openReportInNewTab } from '@/utils-v2/reportGenerator';
import { openFinancialReportInNewTab } from '@/utils-v2/financialReportGenerator';
import { toast } from '@/hooks/use-toast';

export function Sidebar() {
  const navigate = useNavigate();
  const { blocks, currentBlock, setCurrentBlock, getTotalProgress, currentProject, goToProjectList, data } = useConsulting();

  const handleGenerateReport = () => {
    if (!currentProject) {
      toast({ title: 'Erro', description: 'Nenhum projeto selecionado', variant: 'destructive' });
      return;
    }
    if (currentProject?.simulationType === 'financeira') {
      openFinancialReportInNewTab(currentProject, data, blocks);
    } else {
      openReportInNewTab(currentProject, data, blocks);
    }
    toast({ title: 'Relatório gerado!', description: 'O relatório foi aberto em uma nova aba.' });
  };
  const totalProgress = getTotalProgress();

  return (
    <aside className="w-80 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-border">
        <button 
          onClick={() => {
            const route = currentProject?.projectType === 'simulation' ? '/versaorecomendacao/simulacao' : '/versaorecomendacao/projetos';
            goToProjectList();
            navigate(route);
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos projetos
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground truncate">{currentProject?.nomeEmpresa}</h2>
            <p className="text-xs text-muted-foreground">{currentProject?.segmento}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="font-display text-xl font-bold text-foreground">
          {currentProject?.simulationType === 'financeira' ? 'Diagnóstico Financeiro' : 'Estruturação em Gestão'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentProject?.simulationType === 'financeira' ? 'Gestão Financeira para PMEs' : 'Ferramenta de Diagnóstico'}
        </p>
        
        {/* Overall Progress */}
        <div className="mt-4 flex items-center gap-4">
          <ProgressRing progress={totalProgress} size={56} strokeWidth={5} />
          <div>
            <p className="text-sm font-medium text-foreground">Progresso Total</p>
            <p className="text-xs text-muted-foreground">
              {blocks.filter(b => b.completed).length} de {blocks.length} blocos
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {blocks.map((block, index) => (
            <li key={block.id}>
              <button
                onClick={() => setCurrentBlock(block.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  currentBlock === block.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-sm">
                  {block.completed ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <span>{block.icon}</span>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{block.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${block.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{block.progress}%</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button 
          onClick={handleGenerateReport}
          className="w-full gradient-primary text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-all hover:opacity-90"
        >
          Gerar Relatório Final
        </button>
      </div>
    </aside>
  );
}
