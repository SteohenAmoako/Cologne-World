-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies for brands (public read, admin write)
CREATE POLICY "brands_select_all" ON public.brands FOR SELECT USING (true);
CREATE POLICY "brands_insert_admin" ON public.brands FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "brands_update_admin" ON public.brands FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "brands_delete_admin" ON public.brands FOR DELETE USING (auth.uid() IS NOT NULL);

-- Insert sample brands
INSERT INTO public.brands (name, description) VALUES
('Pear Potion', 'Luxurious fruity fragrances with a modern twist'),
('Asad and Yara Mix', 'Premium oriental and floral blend perfumes'),
('Saheb', 'Traditional Arabian perfumes with contemporary appeal'),
('Kamrah', 'Sophisticated unisex fragrances'),
('Enclaire', 'Fresh and vibrant scent collections'),
('Bint Horan', 'Elegant feminine fragrances')
ON CONFLICT (name) DO NOTHING;
