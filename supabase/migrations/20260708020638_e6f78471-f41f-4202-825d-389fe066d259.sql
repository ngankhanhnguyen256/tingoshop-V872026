-- Restrict media bucket SELECT to admins only. Public site reads use signed URLs which bypass RLS.
DROP POLICY IF EXISTS "Public read media" ON storage.objects;

CREATE POLICY "Admins can read media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Explicit admin-only INSERT/UPDATE/DELETE policies on user_roles to prevent privilege escalation.
CREATE POLICY "Only admins can insert user roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update user roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete user roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));