import { useConsulting } from '@/contexts/ConsultingContext';
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
};

export function MainContent() {
  const { currentBlock, blocks } = useConsulting();
  const CurrentBlockComponent = blockComponents[currentBlock];
  const currentBlockInfo = blocks.find(b => b.id === currentBlock);

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Block Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentBlockInfo?.icon}</span>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {currentBlockInfo?.name}
            </h2>
          </div>
          <div className="h-1 w-24 gradient-primary rounded-full" />
        </div>

        {/* Block Content */}
        <div className="animate-slide-up">
          {CurrentBlockComponent && <CurrentBlockComponent />}
        </div>
      </div>
    </main>
  );
}
