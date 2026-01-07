-- Supabase 숙소 좌표 업데이트 스크립트
-- 실행 방법: Supabase Dashboard > SQL Editor에서 실행

-- ========== 깜란 지역 (Cam Ranh) ==========
UPDATE accommodations SET latitude = 12.0234, longitude = 109.2187 WHERE name = 'Alma Resort Cam Ranh';
UPDATE accommodations SET latitude = 12.0156, longitude = 109.2098 WHERE name = 'Movenpick Resort Cam Ranh';
UPDATE accommodations SET latitude = 12.0312, longitude = 109.2234 WHERE name = 'Anamandara Resort';
UPDATE accommodations SET latitude = 12.0187, longitude = 109.2156 WHERE name = 'Mia Resort Nha Trang';
UPDATE accommodations SET latitude = 12.0289, longitude = 109.2145 WHERE name = 'Terracotta Resort';
UPDATE accommodations SET latitude = 12.0123, longitude = 109.2067 WHERE name = 'Swandor Cam Ranh Resort';
UPDATE accommodations SET latitude = 12.0198, longitude = 109.2123 WHERE name = 'Selectum Noa Resort';
UPDATE accommodations SET latitude = 12.0256, longitude = 109.2178 WHERE name = 'Riviera Resort Cam Ranh';
UPDATE accommodations SET latitude = 12.0167, longitude = 109.2089 WHERE name = 'Aquamarine Resort';
UPDATE accommodations SET latitude = 12.0278, longitude = 109.2201 WHERE name = 'Melia Vinpearl Cam Ranh';
UPDATE accommodations SET latitude = 12.0212, longitude = 109.2134 WHERE name = 'Wyndham Garden Cam Ranh';
UPDATE accommodations SET latitude = 12.0145, longitude = 109.2078 WHERE name = 'Fusion Resort Cam Ranh';
UPDATE accommodations SET latitude = 12.0234, longitude = 109.2167 WHERE name = 'Amiana Cam Ranh Resort';

-- ========== 나트랑 시내 (City) ==========
UPDATE accommodations SET latitude = 12.2389, longitude = 109.1956 WHERE name = 'InterContinental Nha Trang';
UPDATE accommodations SET latitude = 12.2451, longitude = 109.1943 WHERE name = 'Sheraton Nha Trang';
UPDATE accommodations SET latitude = 12.2445, longitude = 109.1945 WHERE name = 'Panama Hotel Nha Trang';
UPDATE accommodations SET latitude = 12.2467, longitude = 109.1932 WHERE name = 'Lemore Hotel Nha Trang';
UPDATE accommodations SET latitude = 12.2398, longitude = 109.1967 WHERE name = 'Les Cham Hotel';
UPDATE accommodations SET latitude = 12.2423, longitude = 109.1954 WHERE name = 'Grand Tourane Hotel';
UPDATE accommodations SET latitude = 12.2456, longitude = 109.1938 WHERE name = 'December Hotel';
UPDATE accommodations SET latitude = 12.2478, longitude = 109.1921 WHERE name = 'The Costa Residence';
UPDATE accommodations SET latitude = 12.2489, longitude = 109.1915 WHERE name = 'Costa Executive Residence';
UPDATE accommodations SET latitude = 12.2434, longitude = 109.1948 WHERE name = 'Maple Hotel & Apartment';
UPDATE accommodations SET latitude = 12.2445, longitude = 109.1962 WHERE name = 'Two Blue Hotel';

-- ========== 빈펄섬 (Vinpearl) ==========
UPDATE accommodations SET latitude = 12.2074, longitude = 109.2287 WHERE name = 'Vinpearl Resort & Spa Nha Trang Bay';
UPDATE accommodations SET latitude = 12.2089, longitude = 109.2298 WHERE name = 'Vinpearl Discovery Nha Trang';
UPDATE accommodations SET latitude = 12.2056, longitude = 109.2276 WHERE name = 'Vinpearl Resort & Golf Nha Trang';
UPDATE accommodations SET latitude = 12.1678, longitude = 109.2234 WHERE name = 'Hon Tam Resort';

-- ========== 혼총 지역 (Hon Chong) ==========
UPDATE accommodations SET latitude = 12.2789, longitude = 109.2145 WHERE name = 'Amiana Resort Nha Trang';
UPDATE accommodations SET latitude = 12.2756, longitude = 109.2167 WHERE name = 'Alibu Resort';
UPDATE accommodations SET latitude = 12.2734, longitude = 109.2189 WHERE name = 'Boma Resort Nha Trang';
UPDATE accommodations SET latitude = 12.2712, longitude = 109.2201 WHERE name = 'Gran Melia Nha Trang';

-- ========== 닌반베이 (Ninh Van Bay) ==========
UPDATE accommodations SET latitude = 12.3521, longitude = 109.2654 WHERE name = 'Six Senses Ninh Van Bay';
UPDATE accommodations SET latitude = 12.3489, longitude = 109.2623 WHERE name = 'L''Alya Ninh Van Bay';
UPDATE accommodations SET latitude = 12.3456, longitude = 109.2601 WHERE name = 'An Lam Retreats Ninh Van Bay';

-- ========== 신상 호텔 (2023-2025) ==========
UPDATE accommodations SET latitude = 12.2467, longitude = 109.1928 WHERE name = 'Champtron Hotel';
UPDATE accommodations SET latitude = 12.2469, longitude = 109.1931 WHERE name = 'Iconic Hotel Nha Trang';
UPDATE accommodations SET latitude = 12.2445, longitude = 109.1952 WHERE name = 'Best Western Premier Marvella';
UPDATE accommodations SET latitude = 12.2456, longitude = 109.1941 WHERE name = 'The Signature Hotel';
UPDATE accommodations SET latitude = 12.2434, longitude = 109.1965 WHERE name = 'Seaside Boutique Hotel';

-- 업데이트 확인
SELECT name, name_ko, latitude, longitude FROM accommodations WHERE latitude IS NOT NULL ORDER BY name;
