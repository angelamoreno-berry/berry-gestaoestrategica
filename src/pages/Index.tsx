import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Index;
