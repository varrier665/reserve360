
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'ngo');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- NGOs table
CREATE TABLE public.ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  registration_number TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with ngos" ON public.ngos FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "NGO users can view own ngo" ON public.ngos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can view approved ngos" ON public.ngos FOR SELECT TO authenticated USING (status = 'approved');

-- Add columns to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS item_status TEXT NOT NULL DEFAULT 'available';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS assigned_ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL;

-- Admin can update donations
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
-- NGO can update assigned donations
CREATE POLICY "NGOs can update assigned donations" ON public.donations FOR UPDATE USING (
  assigned_ngo_id IN (SELECT id FROM public.ngos WHERE user_id = auth.uid())
);

-- Add status to volunteer_applications
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Admin can update volunteer applications
CREATE POLICY "Admins can update volunteer applications" ON public.volunteer_applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read all donations
CREATE POLICY "Admins can read all donations" ON public.donations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read all volunteer applications
CREATE POLICY "Admins can read all volunteer apps" ON public.volunteer_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- NGOs can read available donations
CREATE POLICY "NGOs can read available donations" ON public.donations FOR SELECT USING (
  public.has_role(auth.uid(), 'ngo') AND (item_status = 'available' OR assigned_ngo_id IN (SELECT id FROM public.ngos WHERE user_id = auth.uid()))
);
