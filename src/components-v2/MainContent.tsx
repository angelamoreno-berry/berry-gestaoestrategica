import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { DiagnosticoBlock } from './blocks/DiagnosticoBlock';
import { IdentidadeBlock } from './blocks/IdentidadeBlock';
import { ConcorrentesBlock } from './blocks/ConcorrentesBlock';
import { ICPBlock } from './blocks/ICPBlock';
import { EstrategiasValorBlock } from './blocks/EstrategiasValorBlock';
import { PrecificacaoBlock } from './blocks/PrecificacaoBlock';
import { MotoresCrescimentoBlock } from './blocks/MotoresCrescimentoBlock';
import { OrganogramaBlock } from './blocks/OrganogramaBlock';
import { ProcessosBlock } from './blocks/ProcessosBlock';
import { FinanceiroBlock } from './blocks/FinanceiroBlock';
import { SWOTBlock } from './blocks/SWOTBlock';
import { GoldenCircleBlock } from './blocks/GoldenCircleBlock';
import { SWOTPessoalBlock } from './blocks/SWOTPessoalBlock';
import { AgendaCEOBlock } from './blocks/AgendaCEOBlock';
import { MaturidadeProcessosBlock } from './financial-blocks/MaturidadeProcessosBlock';
import { GovernancaFinanceiraBlock } from './financial-blocks/GovernancaFinanceiraBlock';
import { AnaliseFinanceiraFBlock } from './financial-blocks/AnaliseFinanceiraFBlock';
import { FluxoCaixaBlock } from './financial-blocks/FluxoCaixaBlock';
import { CapitalGiroBlock } from './financial-blocks/CapitalGiroBlock';
import { MargensRentabilidadeBlock } from './financial-blocks/MargensRentabilidadeBlock';
import { IndicadoresKPIsBlock } from './financial-blocks/IndicadoresKPIsBlock';
import { RiscoEndividamentoBlock } from './financial-blocks/RiscoEndividamentoBlock';
import { SimuladorDecisoesBlock } from './financial-blocks/SimuladorDecisoesBlock';
import { ScoreGeralBlock } from './financial-blocks/ScoreGeralBlock';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blockComponents: Record<string, React.ComponentType> = {
  diagnostico: DiagnosticoBlock,
  identidade: IdentidadeBlock,
  concorrentes: ConcorrentesBlock,
  icp: ICPBlock,
  estrategiasValor: EstrategiasValorBlock,
  precificacao: PrecificacaoBlock,
  motoresCrescimento: MotoresCrescimentoBlock,
  organograma: OrganogramaBlock,
  processos: ProcessosBlock,
  financeiro: FinanceiroBlock,
  swot: SWOTBlock,
  goldenCircle: GoldenCircleBlock,
  swotPessoal: SWOTPessoalBlock,
  agendaCEO: AgendaCEOBlock,
  // Financial simulation blocks
  maturidadeProcessos: MaturidadeProcessosBlock,
  governancaFinanceira: GovernancaFinanceiraBlock,
  analiseFinanceira: AnaliseFinanceiraFBlock,
  fluxoCaixa: FluxoCaixaBlock,
  capitalGiro: CapitalGiroBlock,
  margensRentabilidade: MargensRentabilidadeBlock,
  indicadoresKPIs: IndicadoresKPIsBlock,
  riscoEndividamento: RiscoEndividamentoBlock,
  simuladorDecisoes: SimuladorDecisoesBlock,
  scoreGeral: ScoreGeralBlock,
};

export function MainContent() {
  const { blocks, currentBlock, setCurrentBlock } = useConsulting();
  
  const currentBlockData = blocks.find(b => b.id === currentBlock);
  const currentIndex = blocks.findIndex(b => b.id === currentBlock);
  const BlockComponent = blockComponents[currentBlock];

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentBlock(blocks[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < blocks.length - 1) {
      setCurrentBlock(blocks[currentIndex + 1].id);
    }
  };

  return (
    <main className="flex-1 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Block Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentBlockData?.icon}</span>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {currentBlockData?.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Bloco {currentIndex + 1} de {blocks.length}</span>
            <span>•</span>
            <span>{currentBlockData?.progress}% completo</span>
          </div>
        </header>

        {/* Block Content */}
        <div className="animate-slide-up">
          {BlockComponent && <BlockComponent />}
        </div>

        {/* Navigation */}
        <footer className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-1.5">
            {blocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => setCurrentBlock(block.id)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : block.completed
                    ? 'bg-primary/50'
                    : 'bg-muted hover:bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={goToNext}
            disabled={currentIndex === blocks.length - 1}
            className="gap-2 gradient-primary"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </footer>
      </div>
    </main>
  );
}
