import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { ProjectSelector } from '@/components/ProjectSelector';
import { useConsulting } from '@/contexts/ConsultingContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectType } from '@/types/consulting';
import { Eye } from 'lucide-react';

interface IndexProps {
  projectType: ProjectType;
}

const Index = ({ projectType }: IndexProps) => {
  const { currentProject } = useConsulting();
  const { canEdit } = useAuth();

  if (!currentProject) {
    return <ProjectSelector projectType={projectType} />;
  }

  const isSimulation = (currentProject.projectType || 'real') === 'simulation';
  const readOnly = !canEdit(currentProject.id, isSimulation);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {readOnly && (
          <div className="flex items-center gap-2 px-6 py-2 bg-accent/10 border-b border-border text-sm text-accent">
            <Eye className="w-4 h-4" />
            Modo consulta — você pode visualizar este projeto, mas não editá-lo.
          </div>
        )}
        <MainContent readOnly={readOnly} />
      </div>
    </div>
  );
};

export default Index;
