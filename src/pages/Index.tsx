import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { ProjectSelector } from '@/components/ProjectSelector';
import { useConsulting } from '@/contexts/ConsultingContext';
import { ProjectType } from '@/types/consulting';

interface IndexProps {
  projectType: ProjectType;
}

const Index = ({ projectType }: IndexProps) => {
  const { currentProject } = useConsulting();

  if (!currentProject) {
    return <ProjectSelector projectType={projectType} />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Index;
