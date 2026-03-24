
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  donation_type TEXT NOT NULL CHECK (donation_type IN ('food', 'medicine', 'corporate')),
  items_description TEXT,
  quantity TEXT,
  delivery_method TEXT,
  expiry_date DATE,
  medicine_type TEXT,
  company_name TEXT,
  contact_person TEXT,
  notes TEXT,
  amount NUMERIC,
  upi_transaction_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert donations"
  ON public.donations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own donations by email"
  ON public.donations FOR SELECT
  TO anon, authenticated
  USING (true);
