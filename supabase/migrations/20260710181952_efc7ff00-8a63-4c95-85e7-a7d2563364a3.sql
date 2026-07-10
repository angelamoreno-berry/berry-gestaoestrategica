-- ============================================================
-- Criador do projeto: coluna created_by + auto-vínculo como editor
-- ============================================================

ALTER TABLE public.consulting_projects
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.consulting_projects
  ALTER COLUMN created_by SET DEFAULT auth.uid();

CREATE OR REPLACE FUNCTION public.enforce_created_by_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.created_by IS DISTINCT FROM OLD.created_by AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar o criador do projeto';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_created_by_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_created_by_admin ON public.consulting_projects;
CREATE TRIGGER trg_enforce_created_by_admin
  BEFORE UPDATE ON public.consulting_projects
  FOR EACH ROW EXECUTE FUNCTION public.enforce_created_by_admin();

CREATE OR REPLACE FUNCTION public.grant_creator_editor()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.created_by IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = NEW.created_by AND email LIKE '%@berry.com.br'
  ) THEN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'editor')
    ON CONFLICT (project_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.grant_creator_editor() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_grant_creator_editor ON public.consulting_projects;
CREATE TRIGGER trg_grant_creator_editor
  AFTER INSERT ON public.consulting_projects
  FOR EACH ROW EXECUTE FUNCTION public.grant_creator_editor();