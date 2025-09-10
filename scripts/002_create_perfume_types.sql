-- Create perfume types table
CREATE TABLE IF NOT EXISTS public.perfume_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.perfume_types ENABLE ROW LEVEL SECURITY;

-- Create policies for perfume types (public read, admin write)
CREATE POLICY "perfume_types_select_all" ON public.perfume_types FOR SELECT USING (true);
CREATE POLICY "perfume_types_insert_admin" ON public.perfume_types FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "perfume_types_update_admin" ON public.perfume_types FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "perfume_types_delete_admin" ON public.perfume_types FOR DELETE USING (auth.uid() IS NOT NULL);

-- Insert sample perfume types
INSERT INTO public.perfume_types (name, description) VALUES
('Eau de Parfum', 'Long-lasting fragrance with 15-20% perfume oil'),
('Eau de Toilette', 'Light and fresh fragrance with 5-15% perfume oil'),
('Parfum', 'Most concentrated fragrance with 20-30% perfume oil'),
('Eau Fraiche', 'Very light fragrance with 1-3% perfume oil')
ON CONFLICT (name) DO NOTHING;
