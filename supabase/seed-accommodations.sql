-- Seed data for accommodations table
-- Run this after creating the accommodations table

-- ========== 깜란 지역 (Cam Ranh) ==========

INSERT INTO accommodations (slug, name, name_ko, area, area_name, purposes, price_range, price_min, price_max, rating, review_count, description, features, amenities, thumbnail, latitude, longitude, is_new, open_year, is_published, sort_order) VALUES
('alma-resort', 'Alma Resort Cam Ranh', '알마 리조트', 'camranh', '깜란', ARRAY['family']::accommodation_purpose[], '$$$', 200000, 350000, 4.7, 1850, '워터파크·영화관 무료, 13세 미만 아동 2명 무료 투숙/조식, 12개 수영장을 갖춘 가족 친화적 리조트', ARRAY['12개 수영장', '워터파크 무료', '영화관 무료', '13세 미만 아동 2명 무료', '키즈클럽'], ARRAY['수영장', '워터파크', '영화관', '키즈클럽', '레스토랑', '스파', '피트니스'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 12.0234, 109.2187, false, NULL, true, 1),

('movenpick-resort', 'Movenpick Resort Cam Ranh', '모벤픽 리조트', 'camranh', '깜란', ARRAY['family']::accommodation_purpose[], '$$', 180000, 300000, 4.6, 1420, '공항 무료 셔틀, 초콜릿 파티(15-16시), 워터슬라이드, 어린이 인형 선물 등 아이들을 위한 서비스가 풍부한 리조트', ARRAY['공항 무료 셔틀', '초콜릿 파티', '워터슬라이드', '어린이 인형 선물', '키즈클럽'], ARRAY['수영장', '워터슬라이드', '키즈클럽', '레스토랑', '스파', '피트니스'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 12.0156, 109.2098, false, NULL, true, 2),

('anamandara-resort', 'Anamandara Resort', '아나만다라 리조트', 'camranh', '깜란', ARRAY['couple']::accommodation_purpose[], '$$$', 250000, 450000, 4.8, 1120, '전체가 예술작품 같은 조경으로 유명한 로맨틱 리조트. 얼리버드 15% 할인, 3박 이상 15% 할인', ARRAY['예술적 조경', '프라이빗 비치', '얼리버드 할인', '3박 이상 할인', '로맨틱 분위기'], ARRAY['수영장', '스파', '프라이빗 비치', '레스토랑', '바', '요가'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 12.0312, 109.2234, false, NULL, true, 3),

('mia-resort', 'Mia Resort Nha Trang', '미야 리조트', 'camranh', '깜란', ARRAY['couple']::accommodation_purpose[], '$$$', 200000, 350000, 4.7, 980, '독특한 절벽 뷰와 아름다운 포토스팟이 많은 부티크 리조트. 로맨틱한 분위기 최고', ARRAY['절벽 뷰', '포토스팟 다수', '부티크 스타일', '프라이빗 비치', '선셋 뷰'], ARRAY['수영장', '스파', '프라이빗 비치', '레스토랑', '바', '카약'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 12.0187, 109.2156, false, NULL, true, 4),

('terracotta-resort', 'Terracotta Resort', '터라코타 리조트', 'camranh', '깜란', ARRAY['couple']::accommodation_purpose[], '$$', 150000, 250000, 4.5, 750, '자연 속 느낌의 아름다운 조경이 특징인 힐링 리조트', ARRAY['자연 친화적 조경', '힐링 분위기', '프라이빗 비치', '가성비'], ARRAY['수영장', '스파', '프라이빗 비치', '레스토랑'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 12.0289, 109.2145, false, NULL, true, 5),

('swandor-resort', 'Swandor Cam Ranh Resort', '스완도르 리조트', 'camranh', '깜란', ARRAY['allinclusive', 'family']::accommodation_purpose[], '$$$', 250000, 400000, 4.6, 2100, '주류 종류 최다! 543객실 대형 리조트, 5개 수영장, 공항 7분, 18시 레이트체크아웃', ARRAY['주류 종류 최다', '543객실', '5개 수영장', '공항 7분', '18시 레이트체크아웃', '올인클루시브'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '키즈클럽', '워터파크'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 12.0123, 109.2067, false, NULL, true, 6),

('selectum-noa', 'Selectum Noa Resort', '셀렉텀 노아', 'camranh', '깜란', ARRAY['allinclusive', 'family']::accommodation_purpose[], '$$$', 200000, 350000, 4.5, 1680, '워터파크 포함, 한국인 VIP 체크인, 맥주·와인 무제한, 한국인 주방장 상주', ARRAY['워터파크 포함', '한국인 VIP 체크인', '맥주·와인 무제한', '한국인 주방장', '올인클루시브'], ARRAY['수영장', '워터파크', '스파', '피트니스', '레스토랑', '바', '키즈클럽'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 12.0198, 109.2123, false, NULL, true, 7),

('riviera-resort', 'Riviera Resort Cam Ranh', '리비에라 리조트', 'camranh', '깜란', ARRAY['allinclusive', 'family']::accommodation_purpose[], '$$', 180000, 300000, 4.4, 1340, '가장 대규모 워터파크 보유! 2박 이상 왕복 셔틀 무료', ARRAY['대규모 워터파크', '2박 이상 셔틀 무료', '올인클루시브', '키즈풀'], ARRAY['수영장', '워터파크', '스파', '피트니스', '레스토랑', '바', '키즈클럽'], 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 12.0256, 109.2178, false, NULL, true, 8),

('aquamarine-resort', 'Aquamarine Resort', '아쿠아마린 리조트', 'camranh', '깜란', ARRAY['allinclusive']::accommodation_purpose[], '$$$', 200000, 350000, 4.6, 520, '2024년 신규 오픈! 아쿠아파크·요가·해변스포츠 무료, 시내 셔틀 제공', ARRAY['2024년 오픈', '아쿠아파크 무료', '요가 무료', '해변스포츠 무료', '시내 셔틀', '올인클루시브'], ARRAY['수영장', '아쿠아파크', '스파', '요가', '레스토랑', '바'], 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 12.0167, 109.2089, true, 2024, true, 9),

('melia-vinpearl', 'Melia Vinpearl Cam Ranh', '멜리아 빈펄', 'camranh', '깜란', ARRAY['couple']::accommodation_purpose[], '$$$$', 400000, 700000, 4.8, 890, '전 객실 독채형 빌라로 프라이빗한 휴양이 가능한 럭셔리 리조트', ARRAY['전 객실 독채형 빌라', '프라이빗', '프리미엄 서비스', '프라이빗 풀'], ARRAY['프라이빗 풀', '스파', '피트니스', '레스토랑', '바', '버틀러 서비스'], 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800', 12.0278, 109.2201, false, NULL, true, 10),

('wyndham-garden', 'Wyndham Garden Cam Ranh', '윈덤가든', 'camranh', '깜란', ARRAY['family', 'couple']::accommodation_purpose[], '$$$', 200000, 350000, 4.5, 720, '넓은 바다와 함께 수영 가능한 인피니티 풀이 매력적인 리조트', ARRAY['인피니티 풀', '오션뷰', '넓은 객실', '프라이빗 비치'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바'], 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 12.0212, 109.2134, false, NULL, true, 11),

('fusion-resort', 'Fusion Resort Cam Ranh', '퓨전 리조트', 'camranh', '깜란', ARRAY['allinclusive', 'couple']::accommodation_purpose[], '$$$$', 400000, 750000, 4.7, 650, '스파 인클루시브! 아름다운 정원과 매일 2회 스파 트리트먼트 포함', ARRAY['스파 인클루시브', '매일 2회 스파', '풀빌라', '아름다운 정원', '웰니스 프로그램'], ARRAY['프라이빗 풀', '스파', '요가', '레스토랑', '바', '자전거'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 12.0145, 109.2078, false, NULL, true, 12),

('amiana-camranh', 'Amiana Cam Ranh Resort', '아미아나 깜란', 'camranh', '깜란', ARRAY['family', 'allinclusive']::accommodation_purpose[], '$$$', 220000, 400000, 4.6, 450, '2025년 신규 오픈! 머드배스 포함, 디너/런치 선택 가능', ARRAY['2025년 오픈', '머드배스 포함', '디너/런치 선택', '프라이빗 비치'], ARRAY['수영장', '머드스파', '피트니스', '레스토랑', '키즈클럽'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 12.0234, 109.2167, true, 2025, true, 13),

-- ========== 나트랑 시내 (City) ==========

('intercontinental', 'InterContinental Nha Trang', '인터컨티넨탈', 'city', '시내', ARRAY['couple']::accommodation_purpose[], '$$', 150000, 250000, 4.7, 2340, '3구역 위치, 오션뷰, 프리미엄 서비스. 한국 5성급 대비 매우 저렴한 가격으로 호캉스 가능', ARRAY['오션뷰', '프리미엄 서비스', '해변 직접 연결', '루프탑 바'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '컨시어지'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 12.2389, 109.1956, false, NULL, true, 14),

('sheraton', 'Sheraton Nha Trang', '쉐라톤 호텔', 'city', '시내', ARRAY['couple', 'family']::accommodation_purpose[], '$$', 120000, 200000, 4.6, 1890, '3구역 위치, 품격 있는 서비스, 루프탑 수영장이 매력적인 5성급 호텔', ARRAY['루프탑 수영장', '품격 있는 서비스', '시내 중심', '오션뷰'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '비즈니스센터'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 12.2451, 109.1943, false, NULL, true, 15),

('panama-hotel', 'Panama Hotel Nha Trang', '파나마 호텔', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 40000, 60000, 4.5, 680, '2024년 5월 오픈! 280객실, 루프탑 수영장, 야시장 도보 4분, 스마트TV 완비', ARRAY['2024년 오픈', '280객실', '루프탑 수영장', '야시장 도보 4분', '스마트TV'], ARRAY['수영장', '피트니스', '레스토랑'], 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 12.2445, 109.1945, true, 2024, true, 16),

('lemore-hotel', 'Lemore Hotel Nha Trang', '르모어 호텔', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 80000, 120000, 4.4, 1250, '한국인 인기! 루프탑 수영장, 시내 전경 뷰, 야시장 도보권', ARRAY['한국인 인기', '루프탑 수영장', '시내 전경 뷰', '야시장 도보권'], ARRAY['수영장', '피트니스', '레스토랑', '바'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 12.2467, 109.1932, false, NULL, true, 17),

('lescham-hotel', 'Les Cham Hotel', '레스참 호텔', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 20000, 40000, 4.2, 890, '넓은 면적, 쾌적한 사용, 조식 포함. 가성비 최고의 선택', ARRAY['넓은 면적', '조식 포함', '쾌적한 시설', '가성비 최고'], ARRAY['레스토랑', '투어데스크'], 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 12.2398, 109.1967, false, NULL, true, 18),

('grand-tourane', 'Grand Tourane Hotel', '그랜드 투란', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 30000, 50000, 4.3, 720, '디자인 호텔! 기억에 남는 인테리어가 특징', ARRAY['디자인 호텔', '독특한 인테리어', '시내 중심'], ARRAY['레스토랑', '피트니스'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 12.2423, 109.1954, false, NULL, true, 19),

('december-hotel', 'December Hotel', '디셈버 호텔', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 40000, 60000, 4.4, 950, '5성급 시설, 절제된 모던함으로 인기 있는 호텔', ARRAY['5성급 시설', '모던 인테리어', '시내 중심'], ARRAY['수영장', '피트니스', '레스토랑'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 12.2456, 109.1938, false, NULL, true, 20),

('costa-residence', 'The Costa Residence', '더 코스타 레지던스', 'city', '시내', ARRAY['residence']::accommodation_purpose[], '$', 60000, 100000, 4.3, 580, '풀키친, 세탁기 완비. 장기 투숙, 한 달 살기에 최적', ARRAY['풀키친', '세탁기 완비', '장기 투숙 적합', '넓은 공간'], ARRAY['수영장', '피트니스', '주방', '세탁기'], 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 12.2478, 109.1921, false, NULL, true, 21),

('costa-executive', 'Costa Executive Residence', '코스타 이그제큐티브', 'city', '시내', ARRAY['residence']::accommodation_purpose[], '$', 70000, 120000, 4.4, 420, '비즈니스 출장에도 적합한 고급 레지던스', ARRAY['비즈니스 적합', '풀키친', '세탁기', '오피스 공간'], ARRAY['수영장', '피트니스', '주방', '세탁기', '비즈니스센터'], 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 12.2489, 109.1915, false, NULL, true, 22),

('maple-apartment', 'Maple Hotel & Apartment', '메이플 호텔 앤 아파트먼트', 'city', '시내', ARRAY['residence', 'budget']::accommodation_purpose[], '$', 40000, 70000, 4.2, 380, '가성비 장기 투숙에 최적화된 아파트먼트 호텔', ARRAY['가성비 장기 투숙', '풀키친', '세탁기'], ARRAY['주방', '세탁기', '피트니스'], 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 12.2434, 109.1948, false, NULL, true, 23),

('twoblue-hotel', 'Two Blue Hotel', '투위블루 호텔', 'city', '시내', ARRAY['residence', 'budget']::accommodation_purpose[], '$', 50000, 80000, 4.1, 320, '깔끔한 시설의 레지던스형 호텔', ARRAY['깔끔한 시설', '레지던스형', '시내 접근성'], ARRAY['주방', '세탁기', '피트니스'], 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 12.2445, 109.1962, false, NULL, true, 24),

-- ========== 빈펄섬 (Vinpearl) ==========

('vinpearl-resort-spa', 'Vinpearl Resort & Spa Nha Trang Bay', '빈펄 리조트 & 스파', 'vinpearl', '빈펄', ARRAY['family', 'couple']::accommodation_purpose[], '$$', 150000, 300000, 4.8, 2340, '빈원더스 뷰, 프라이빗 비치, 아쿠아필드 무료, 15% 할인 프로모션. 숙박권에 빈원더스 포함 패키지 선택 가능', ARRAY['빈원더스 뷰', '프라이빗 비치', '아쿠아필드 무료', '15% 할인', '빈원더스 패키지'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '워터파크', '골프'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 12.2074, 109.2287, false, NULL, true, 25),

('vinpearl-discovery', 'Vinpearl Discovery Nha Trang', '빈펄 디스커버리', 'vinpearl', '빈펄', ARRAY['family']::accommodation_purpose[], '$$', 120000, 250000, 4.6, 1560, '가족 단위에 적합한 빈원더스 패키지 리조트', ARRAY['가족 적합', '빈원더스 패키지', '키즈클럽', '워터파크 접근'], ARRAY['수영장', '스파', '키즈클럽', '레스토랑', '바'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 12.2089, 109.2298, false, NULL, true, 26),

('vinpearl-golf', 'Vinpearl Resort & Golf Nha Trang', '빈펄 리조트 & 골프', 'vinpearl', '빈펄', ARRAY['couple']::accommodation_purpose[], '$$$', 200000, 400000, 4.7, 890, '골프 여행객 추천! 18홀 골프장과 함께하는 리조트', ARRAY['18홀 골프장', '골프 패키지', '프라이빗 비치', '빈원더스 접근'], ARRAY['골프장', '수영장', '스파', '피트니스', '레스토랑', '바'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 12.2056, 109.2276, false, NULL, true, 27),

('hontam-resort', 'Hon Tam Resort', '혼땀 리조트', 'vinpearl', '빈펄', ARRAY['couple', 'family']::accommodation_purpose[], '$$', 100000, 200000, 4.5, 720, '해상 투어·스노클링 성지! 수상 레포츠를 좋아하면 강력 추천', ARRAY['스노클링 성지', '수상 레포츠', '해상 투어', '프라이빗 비치'], ARRAY['수영장', '스파', '레스토랑', '바', '수상스포츠', '카약'], 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 12.1678, 109.2234, false, NULL, true, 28),

-- ========== 혼총 지역 (Hon Chong) ==========

('amiana-resort', 'Amiana Resort Nha Trang', '아미아나 리조트', 'honchong', '혼총', ARRAY['family', 'couple']::accommodation_purpose[], '$$', 150000, 300000, 4.7, 1850, '가장 인기! 3박 10%↓, 4박 15%↓, 프라이빗 비치 스노클링, 그랩 3분. 시내와 가까워 관광+리조트 동시 가능', ARRAY['가장 인기', '3박 10% 할인', '4박 15% 할인', '프라이빗 비치', '스노클링', '시내 접근성'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '프라이빗 비치'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 12.2789, 109.2145, false, NULL, true, 29),

('alibu-resort', 'Alibu Resort', '알리부 리조트', 'honchong', '혼총', ARRAY['couple']::accommodation_purpose[], '$$', 120000, 250000, 4.5, 680, '최근 뜨는 리조트! 프라이빗하고 한식 조식 제공', ARRAY['최근 인기', '프라이빗', '한식 조식', '조용한 분위기'], ARRAY['수영장', '스파', '레스토랑', '프라이빗 비치'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 12.2756, 109.2167, false, NULL, true, 30),

('boma-resort', 'Boma Resort Nha Trang', '보마 리조트', 'honchong', '혼총', ARRAY['couple']::accommodation_purpose[], '$$', 100000, 200000, 4.6, 520, '2023년 오픈! 40㎡ 넓은 기본룸, 인피니티풀, 시내 셔틀 운행, 조용한 힐링', ARRAY['2023년 오픈', '40㎡ 넓은 객실', '인피니티풀', '시내 셔틀', '조용한 힐링'], ARRAY['수영장', '스파', '피트니스', '레스토랑'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 12.2734, 109.2189, true, 2023, true, 31),

('gran-melia', 'Gran Melia Nha Trang', '그란멜리아', 'honchong', '혼총', ARRAY['couple']::accommodation_purpose[], '$$$', 300000, 450000, 4.9, 380, '가장 최신 리조트! 2023년 7월 오픈, 121㎡ 넓은 객실, 전객실 오션뷰, JTB 최고 등급 럭셔리', ARRAY['2023년 오픈', '121㎡ 넓은 객실', '전객실 오션뷰', 'JTB 최고 등급', '프라이빗 해변', '카약/패들보드', '쿠킹클래스'], ARRAY['수영장', '스파', '피트니스', '레스토랑', '바', '프라이빗 비치'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 12.2712, 109.2201, true, 2023, true, 32),

-- ========== 닌반베이 (Ninh Van Bay) ==========

('six-senses', 'Six Senses Ninh Van Bay', '식스센스 닌반베이', 'ninhvan', '닌반베이', ARRAY['couple']::accommodation_purpose[], '$$$$', 650000, 900000, 4.9, 890, '세계적 허니문 브랜드! 전 객실 풀빌라, 2박 필수, 공항 왕복 셔틀+보트 무료. 보트로만 접근 가능한 프라이빗 천국', ARRAY['세계적 허니문 브랜드', '전 객실 풀빌라', '버틀러 서비스', '공항 셔틀+보트 무료', '2박 필수'], ARRAY['프라이빗 풀', '스파', '요가', '레스토랑', '와인셀러', '수상스포츠'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 12.3521, 109.2654, false, NULL, true, 33),

('lalia-resort', 'L''Alya Ninh Van Bay', '랄리아 리조트', 'ninhvan', '닌반베이', ARRAY['couple']::accommodation_purpose[], '$$$', 350000, 550000, 4.7, 420, '닌반베이 중 가장 합리적 가격! 스피드보트 15분, 풀빌라', ARRAY['합리적 가격', '풀빌라', '스피드보트 15분', '프라이빗'], ARRAY['프라이빗 풀', '스파', '레스토랑', '바', '수상스포츠'], 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 12.3489, 109.2623, false, NULL, true, 34),

('anlam-retreat', 'An Lam Retreats Ninh Van Bay', '안람 리트리트', 'ninhvan', '닌반베이', ARRAY['couple']::accommodation_purpose[], '$$$$', 500000, 800000, 4.8, 350, '자연과 하나 된 힐링, 버틀러 서비스로 완벽한 프라이버시', ARRAY['자연 친화', '버틀러 서비스', '힐링', '완벽한 프라이버시'], ARRAY['프라이빗 풀', '스파', '요가', '레스토랑', '버틀러 서비스'], 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 12.3456, 109.2601, false, NULL, true, 35),

-- ========== 신상 호텔 (2023-2025) ==========

('champtron-hotel', 'Champtron Hotel', '챔프턴 호텔', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 80000, 150000, 4.6, 180, '2025년 10월 오픈! 가장 최신 5성급, 루프탑풀/바, 해변 도보5분, 시내 중심', ARRAY['2025년 오픈', '가장 최신 5성급', '루프탑풀', '루프탑바', '해변 도보5분'], ARRAY['수영장', '피트니스', '레스토랑', '바', '스파'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 12.2467, 109.1928, true, 2025, true, 36),

('iconic-hotel', 'Iconic Hotel Nha Trang', '이코니크 호텔', 'city', '시내', ARRAY['budget', 'family']::accommodation_purpose[], '$', 50000, 100000, 4.5, 150, '2025년 8월 오픈! 챔프턴 바로 옆, 키즈클럽, 스타벅스/해변 도보5분', ARRAY['2025년 오픈', '키즈클럽', '스타벅스 근처', '해변 도보5분'], ARRAY['수영장', '키즈클럽', '피트니스', '레스토랑'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 12.2469, 109.1931, true, 2025, true, 37),

('best-western-marvella', 'Best Western Premier Marvella', '베스트웨스턴 마벨라', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 60000, 120000, 4.4, 620, '2023년 9월 오픈! 355객실, 32층 스카이라운지, 31층 인피니티풀, 해변 바로 앞', ARRAY['2023년 오픈', '355객실', '32층 스카이라운지', '31층 인피니티풀', '해변 바로 앞'], ARRAY['수영장', '피트니스', '레스토랑', '바', '스카이라운지'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 12.2445, 109.1952, true, 2023, true, 38),

('signature-hotel', 'The Signature Hotel', '더 시그니처', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 40000, 80000, 4.5, 480, '2024년 6월 오픈! 한국식 찜질방 보유, 27층 인피니티풀, 26층 조식, 해변 도보5분', ARRAY['2024년 오픈', '한국식 찜질방', '27층 인피니티풀', '26층 조식', '해변 도보5분'], ARRAY['수영장', '찜질방', '피트니스', '레스토랑'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 12.2456, 109.1941, true, 2024, true, 39),

('seaside-boutique', 'Seaside Boutique Hotel', '시사이드 부티크', 'city', '시내', ARRAY['budget']::accommodation_purpose[], '$', 20000, 40000, 4.3, 220, '2025년 3월 오픈! 초가성비! 루프탑풀, 야시장/해변 도보10분, 시내 중심', ARRAY['2025년 오픈', '초가성비', '루프탑풀', '야시장 도보10분', '시내 중심'], ARRAY['수영장', '레스토랑'], 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 12.2434, 109.1965, true, 2025, true, 40);
