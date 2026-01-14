-- Create table for consulting projects
CREATE TABLE public.consulting_projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.consulting_projects ENABLE ROW LEVEL SECURITY;

-- For now, allow public access (no auth required)
-- This matches the current behavior where projects are stored locally
CREATE POLICY "Anyone can view projects"
ON public.consulting_projects
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create projects"
ON public.consulting_projects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
ON public.consulting_projects
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete projects"
ON public.consulting_projects
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consulting_projects_updated_at
BEFORE UPDATE ON public.consulting_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();