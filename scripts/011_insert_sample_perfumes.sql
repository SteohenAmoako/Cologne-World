-- Insert sample perfumes into perfumes table
INSERT INTO public.perfumes (name, brand_id, description, price, stock_quantity)
SELECT 'Pear Potion', (SELECT id FROM public.brands WHERE name = 'Pear Potion'), 'Luxurious fruity fragrance', 59.99, 20
UNION ALL
SELECT 'Asad and Yara Mix', (SELECT id FROM public.brands WHERE name = 'Asad and Yara Mix'), 'Premium oriental and floral blend', 69.99, 15
UNION ALL
SELECT 'Saheb', (SELECT id FROM public.brands WHERE name = 'Saheb'), 'Traditional Arabian perfume', 49.99, 10
UNION ALL
SELECT 'Kamrah', (SELECT id FROM public.brands WHERE name = 'Kamrah'), 'Sophisticated unisex fragrance', 54.99, 12
UNION ALL
SELECT 'Enclaire', (SELECT id FROM public.brands WHERE name = 'Enclaire'), 'Fresh and vibrant scent', 39.99, 18
UNION ALL
SELECT 'Bint Horan', (SELECT id FROM public.brands WHERE name = 'Bint Horan'), 'Elegant feminine fragrance', 44.99, 8
ON CONFLICT DO NOTHING;
