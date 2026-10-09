-- Nomor meja 1–10
INSERT INTO tables (nomor)
SELECT generate_series(1, 10);

-- Menu Kedai De Santos
INSERT INTO menu_items (nama, deskripsi, harga, kategori, urutan) VALUES

-- 1. MAIN COURSE
('Nasi Goreng Telur', 'Isian telur dan kerupuk', 15000, 'Main Course', 1),
('Nasi Goreng Ayam Suwir', 'Isian telur, ayam suwir, dan kerupuk', 18000, 'Main Course', 2),
('Nasi Goreng Special', 'Isian telur, ayam suwir, bakso, dan kerupuk', 20000, 'Main Course', 3),
('Nasi Ayam Goreng', 'Ayam goreng dengan sambal dan lalapan', 25000, 'Main Course', 4),
('Nasi Telur Orak-arik', '', 0, 'Main Course', 5),
('Nasi Telur Dadar', '', 0, 'Main Course', 6),

-- 2. RICEBOWL
('Ayam Gepuk', '', 0, 'Ricebowl', 1),
('Chicken Katsu', '', 0, 'Ricebowl', 2),

-- 3. BURGER
('Beef Burger', 'Daging sapi, keju, selada, tomat', 28000, 'Burger', 1),
('Cheese Burger', '', 0, 'Burger', 2),
('Wow Burger', '', 0, 'Burger', 3),

-- 4. INDOMIE
('Indomie Goreng Original', '', 0, 'Indomie', 1),
('Indomie Rebus Original', '', 0, 'Indomie', 2),
('Indomie Goreng Telur', 'Indomie goreng dengan telur', 12000, 'Indomie', 3),
('Indomie Rebus Telur', '', 0, 'Indomie', 4),
('Indomie Goreng Special', '', 0, 'Indomie', 5),
('Indomie Rebus Special', '', 0, 'Indomie', 6),
('Merapi Cheese', '', 0, 'Indomie', 7),
('Mie Dokdok', '', 0, 'Indomie', 8),
('Kwetiau Goreng', '', 0, 'Indomie', 9),

-- 5. SNACK
('Cireng Ayam', '', 0, 'Snack', 1),
('Mendoan', '', 0, 'Snack', 2),
('Ketela Goreng', '', 0, 'Snack', 3),
('Udang Keju', '', 0, 'Snack', 4),
('Pisang Goreng', '', 0, 'Snack', 5),
('Pisang Bakar', '', 0, 'Snack', 6),
('Otak-otak', '', 0, 'Snack', 7),
('French Fries', '', 0, 'Snack', 8),
('Sosis Bakar', '', 0, 'Snack', 9),
('Tahu Walik', '', 0, 'Snack', 10),
('Roti Bakar', '', 0, 'Snack', 11),
('Roti Maryam', '', 0, 'Snack', 12),
('Mix Platter A', 'Kentang, Sosis, Otak-otak', 25000, 'Snack', 13),
('Mix Platter B', '', 0, 'Snack', 14),
('Platter Ndeso', '', 0, 'Snack', 15),
('Dimsum Mentai', '', 0, 'Snack', 16),
('Es Krim Bakar', '', 0, 'Snack', 17),

-- 6. COFFEE BASED
('Kopi Hitam', '', 0, 'Coffee Based', 1),
('Nescafe Americano', '', 0, 'Coffee Based', 2),
('Coffee Milk', '', 0, 'Coffee Based', 3),
('Gula Aren', '', 0, 'Coffee Based', 4),
('Carmelia', '', 0, 'Coffee Based', 5),
('Gempita', '', 0, 'Coffee Based', 6),
('Kopi De Santos', '', 0, 'Coffee Based', 7),
('Butterscotch', '', 0, 'Coffee Based', 1),

-- 7. MOCKTAILS
('Manggala', '', 0, 'Mocktails', 1),
('Kopgala', '', 0, 'Mocktails', 2),
('Seven Culture', '', 0, 'Mocktails', 3),
('Arabella', '', 0, 'Mocktails', 4),

-- 8. MILK BASED
('Thai Tea', '', 0, 'Milk Based', 1),
('Teh Tarik', '', 0, 'Milk Based', 2),
('Matcha', '', 0, 'Milk Based', 3),
('Red Velvet', '', 0, 'Milk Based', 4),
('Chocolate', '', 0, 'Milk Based', 5),
('Bubble Gum', '', 0, 'Milk Based', 6),
('Mystic Blue', 'Creamy yoghurt sweet blueberries, and cream', 20000, 'Milk Based', 7),
('Lychee Silk', '', 0, 'Milk Based', 8),
('Emerald Matcha', '', 0, 'Milk Based', 9),
('Lava Tour', '', 0, 'Milk Based', 10),
('Susu Murni', '', 0, 'Milk Based', 11),

-- 9. TEA / NON COFFEE
('Teh', '', 0, 'Tea/Non Coffee', 1),
('Jeruk', '', 0, 'Tea/Non Coffee', 2),
('Jahe', '', 0, 'Tea/Non Coffee', 3),
('Jahe Susu', '', 0, 'Tea/Non Coffee', 4),
('Sekoteng', '', 0, 'Tea/Non Coffee', 5),
('Lychee Tea', '', 0, 'Tea/Non Coffee', 6),
('Lemon Tea', '', 0, 'Tea/Non Coffee', 7),
('Wedang Uwuh', '', 0, 'Tea/Non Coffee', 8),
('Secang', '', 0, 'Tea/Non Coffee', 9),
('Bajigur', '', 0, 'Tea/Non Coffee', 10),

-- 10. SPARKLING BASED
('Soda Bersama', '', 0, 'Sparkling Based', 1),
('Mango Squash', '', 0, 'Sparkling Based', 2),
('Twilight Citrus', '', 0, 'Sparkling Based', 3),
('Ruby Citrus', '', 0, 'Sparkling Based', 4),
('Berry Inc', '', 0, 'Sparkling Based', 5),
('Orange Squash', '', 0, 'Sparkling Based', 6);