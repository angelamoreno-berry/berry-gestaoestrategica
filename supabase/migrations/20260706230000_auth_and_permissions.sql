-- ============================================================
-- Berry Gestão Estratégica — Autenticação e permissões por projeto
-- Admin: acesso total | Editor (@berry.com.br): edita projetos vinculados
-- Viewer (qualquer e-mail): consulta projetos vinculados
-- Simulações: livres para qualquer usuário @berry.com.br
-- ============================================================

-- ==========================
-- 1. Perfis de usuário
-- ==========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (name) ON public.profiles TO authenticated;

-- ==========================
-- 2. Papéis por projeto
-- ==========================
CREATE TYPE public.project_role AS ENUM ('editor', 'viewer');

CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.consulting_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.project_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.project_members FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_members TO authenticated;

-- ==========================
-- 3. Funções auxiliares (SECURITY DEFINER evita recursão de RLS)
-- ==========================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin);
$$;

CREATE OR REPLACE FUNCTION public.is_berry()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND email LIKE '%@berry.com.br'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_project_member(_project UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = _project AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_project_editor(_project UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = _project AND user_id = auth.uid() AND role = 'editor'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_berry() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_project_member(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_project_editor(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_berry() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_project_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_project_editor(UUID) TO authenticated;

-- ==========================
-- 4. Provisão automática de perfil no cadastro
--    Admins iniciais: angela.moreno@ e felipe@berry.com.br
-- ==========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_email TEXT := lower(coalesce(NEW.email, ''));
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (
    NEW.id,
    user_email,
    coalesce(NEW.raw_user_meta_data->>'name', split_part(user_email, '@', 1)),
    user_email IN ('angela.moreno@berry.com.br', 'felipe@berry.com.br')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill de usuários que porventura já existam
INSERT INTO public.profiles (id, email, name, is_admin)
SELECT
  id,
  lower(email),
  coalesce(raw_user_meta_data->>'name', split_part(lower(email), '@', 1)),
  lower(email) IN ('angela.moreno@berry.com.br', 'felipe@berry.com.br')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==========================
-- 5. Guarda: papel de editor só para domínio Berry (aplicado no banco)
-- ==========================
CREATE OR REPLACE FUNCTION public.enforce_editor_domain()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role = 'editor' AND NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = NEW.user_id AND email LIKE '%@berry.com.br'
  ) THEN
    RAISE EXCEPTION 'Apenas e-mails @berry.com.br podem ser editores';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_editor_domain() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER enforce_editor_domain_trg
BEFORE INSERT OR UPDATE ON public.project_members
FOR EACH ROW EXECUTE FUNCTION public.enforce_editor_domain();

-- ==========================
-- 6. Políticas: profiles
-- ==========================
CREATE POLICY profiles_select ON public.profiles
FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_admin() OR public.is_berry());

CREATE POLICY profiles_update_own ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());
-- (coluna is_admin protegida por GRANT de coluna: authenticated só atualiza name)

-- ==========================
-- 7. Políticas: project_members
-- ==========================
CREATE POLICY members_select ON public.project_members
FOR SELECT TO authenticated
USING (public.is_admin() OR public.is_project_member(project_id));

CREATE POLICY members_insert ON public.project_members
FOR INSERT TO authenticated
WITH CHECK (public.is_admin() OR public.is_project_editor(project_id));

CREATE POLICY members_update ON public.project_members
FOR UPDATE TO authenticated
USING (public.is_admin() OR public.is_project_editor(project_id))
WITH CHECK (public.is_admin() OR public.is_project_editor(project_id));

CREATE POLICY members_delete ON public.project_members
FOR DELETE TO authenticated
USING (public.is_admin() OR public.is_project_editor(project_id));

-- ==========================
-- 8. Fechar consulting_projects (remove acesso público)
-- ==========================
DROP POLICY IF EXISTS "Anyone can view projects" ON public.consulting_projects;
DROP POLICY IF EXISTS "Anyone can create projects" ON public.consulting_projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.consulting_projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.consulting_projects;
REVOKE ALL ON public.consulting_projects FROM anon;

-- Ver: admin tudo | membro vê os seus | Berry vê simulações
CREATE POLICY proj_select ON public.consulting_projects
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.is_project_member(id)
  OR ((data->>'projectType') = 'simulation' AND public.is_berry())
);

-- Criar: admin (qualquer) | Berry (apenas simulação)
CREATE POLICY proj_insert ON public.consulting_projects
FOR INSERT TO authenticated
WITH CHECK (
  public.is_admin()
  OR ((data->>'projectType') = 'simulation' AND public.is_berry())
);

-- Editar: admin | editor do projeto | Berry em simulações
CREATE POLICY proj_update ON public.consulting_projects
FOR UPDATE TO authenticated
USING (
  public.is_admin()
  OR public.is_project_editor(id)
  OR ((data->>'projectType') = 'simulation' AND public.is_berry())
)
WITH CHECK (
  public.is_admin()
  OR public.is_project_editor(id)
  OR ((data->>'projectType') = 'simulation' AND public.is_berry())
);

-- Excluir: admin | Berry em simulações (testes são descartáveis)
CREATE POLICY proj_delete ON public.consulting_projects
FOR DELETE TO authenticated
USING (
  public.is_admin()
  OR ((data->>'projectType') = 'simulation' AND public.is_berry())
);

-- ==========================
-- 9. Limpeza da tabela v2 (não é mais usada pelo código)
-- ==========================
DROP TABLE IF EXISTS public.consulting_projects_v2;
