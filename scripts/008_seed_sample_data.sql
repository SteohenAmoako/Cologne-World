-- Insert sample brands
INSERT INTO brands (name, description) VALUES
('Pear Potion', 'Luxurious fragrances with fruity and floral notes'),
('Asad and Yara Mix', 'Premium Middle Eastern inspired scents'),
('Saheb', 'Traditional and modern fragrance blends'),
('Kamrah', 'Sophisticated and elegant perfumes'),
('Enclaire', 'Contemporary fragrances for the modern individual'),
('Bint Horan', 'Exquisite Arabian perfume collection');

-- Insert perfume types
INSERT INTO perfume_types (name, description) VALUES
('Eau de Parfum', 'Long-lasting fragrance with 15-20% perfume concentration'),
('Eau de Toilette', 'Light and fresh fragrance with 5-15% perfume concentration'),
('Parfum', 'Most concentrated fragrance with 20-30% perfume concentration'),
('Eau Fraiche', 'Very light fragrance with 1-3% perfume concentration');

-- Insert sample perfumes
INSERT INTO perfumes (name, description, price, brand_id, perfume_type_id, stock_quantity, image_url) VALUES
-- Pear Potion products
('Golden Pear Elixir', 'A luxurious blend of golden pear, vanilla, and amber. Perfect for evening wear with its warm and inviting scent.', 89.99, 1, 1, 25, '/placeholder.svg?height=400&width=300'),
('Pear Blossom Dream', 'Fresh pear blossom with hints of jasmine and white musk. A delicate fragrance for everyday elegance.', 65.99, 1, 2, 30, '/placeholder.svg?height=400&width=300'),
('Royal Pear Essence', 'The ultimate pear fragrance with bergamot top notes and sandalwood base. A truly regal scent.', 129.99, 1, 3, 15, '/placeholder.svg?height=400&width=300'),

-- Asad and Yara Mix products
('Desert Rose Passion', 'Exotic rose petals blended with oud and saffron. A passionate Middle Eastern fragrance.', 95.99, 2, 1, 20, '/placeholder.svg?height=400&width=300'),
('Yara Nights', 'Mysterious blend of amber, musk, and oriental spices. Perfect for special occasions.', 110.99, 2, 1, 18, '/placeholder.svg?height=400&width=300'),
('Asad Majesty', 'Bold and powerful fragrance with leather, tobacco, and cedar notes. For the confident individual.', 125.99, 2, 3, 12, '/placeholder.svg?height=400&width=300'),

-- Saheb products
('Saheb Classic', 'Timeless fragrance with citrus top notes and woody base. A versatile scent for any occasion.', 75.99, 3, 2, 35, '/placeholder.svg?height=400&width=300'),
('Modern Saheb', 'Contemporary twist on traditional scents with fresh bergamot and modern musks.', 82.99, 3, 2, 28, '/placeholder.svg?height=400&width=300'),

-- Kamrah products
('Kamrah Elegance', 'Sophisticated floral bouquet with peony, lily, and soft vanilla. Pure elegance in a bottle.', 98.99, 4, 1, 22, '/placeholder.svg?height=400&width=300'),
('Kamrah Mystique', 'Mysterious and alluring with dark berries, patchouli, and amber. Unforgettable presence.', 115.99, 4, 1, 16, '/placeholder.svg?height=400&width=300'),

-- Enclaire products
('Enclaire Fresh', 'Clean and modern with aquatic notes, mint, and white tea. Perfect for daily wear.', 58.99, 5, 4, 40, '/placeholder.svg?height=400&width=300'),
('Enclaire Urban', 'Urban sophistication with concrete accord, steel, and modern woods. For the city dweller.', 92.99, 5, 2, 25, '/placeholder.svg?height=400&width=300'),

-- Bint Horan products
('Horan Princess', 'Delicate and feminine with rose, jasmine, and soft musks. Fit for royalty.', 105.99, 6, 1, 19, '/placeholder.svg?height=400&width=300'),
('Bint Horan Gold', 'Luxurious golden fragrance with saffron, rose, and precious woods. Ultimate luxury.', 149.99, 6, 3, 10, '/placeholder.svg?height=400&width=300');
