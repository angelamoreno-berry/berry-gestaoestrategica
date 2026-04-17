CREATE TABLE public.consulting_projects_v2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consulting_projects_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view v2 projects" ON public.consulting_projects_v2 FOR SELECT USING (true);
CREATE POLICY "Anyone can create v2 projects" ON public.consulting_projects_v2 FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update v2 projects" ON public.consulting_projects_v2 FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete v2 projects" ON public.consulting_projects_v2 FOR DELETE USING (true);

CREATE TRIGGER update_consulting_projects_v2_updated_at
  BEFORE UPDATE ON public.consulting_projects_v2
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();