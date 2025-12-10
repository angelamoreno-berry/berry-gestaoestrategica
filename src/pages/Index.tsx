import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { ProjectSelector } from '@/components/ProjectSelector';
import { useConsulting } from '@/contexts/ConsultingContext';

const Index = () => {
  const { currentProject } = useConsulting();

  if (!currentProject) {
    return <ProjectSelector />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Index;
