-- Create perfumes table
CREATE TABLE IF NOT EXISTS public.perfumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  perfume_type_id UUID NOT NULL REFERENCES public.perfume_types(id) ON DELETE CASCADE,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;

-- Create policies for perfumes (public read, admin write)
CREATE POLICY "perfumes_select_all" ON public.perfumes FOR SELECT USING (true);
CREATE POLICY "perfumes_insert_admin" ON public.perfumes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "perfumes_update_admin" ON public.perfumes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "perfumes_delete_admin" ON public.perfumes FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_perfumes_brand_id ON public.perfumes(brand_id);
CREATE INDEX IF NOT EXISTS idx_perfumes_perfume_type_id ON public.perfumes(perfume_type_id);
CREATE INDEX IF NOT EXISTS idx_perfumes_is_active ON public.perfumes(is_active);
