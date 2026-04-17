// Force rebuild
import { Sidebar } from '@/components-v2/Sidebar';
import { MainContent } from '@/components-v2/MainContent';
import { ProjectSelector } from '@/components-v2/ProjectSelector';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { ProjectType } from '@/types-v2/consulting';

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
