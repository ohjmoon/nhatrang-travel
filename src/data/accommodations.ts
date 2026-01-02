export interface Accommodation {
  id: string;
  name: string;
  nameKo: string;
  area: 'camranh' | 'city' | 'vinpearl' | 'honchong' | 'ninhvan';
  areaName: string;
  purpose: ('family' | 'couple' | 'allinclusive' | 'budget' | 'residence')[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  amenities: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  isNew?: boolean;
  openYear?: number;
}

export const areas = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'camranh', name: '깜란', nameEn: 'Cam Ranh' },
  { id: 'city', name: '시내', nameEn: 'City Center' },
  { id: 'vinpearl', name: '빈펄', nameEn: 'Vinpearl' },
  { id: 'honchong', name: '혼총', nameEn: 'Hon Chong' },
  { id: 'ninhvan', name: '닌반베이', nameEn: 'Ninh Van Bay' },
];

export const purposes = [
  { id: 'all', name: '전체', icon: '🏨' },
  { id: 'family', name: '가족', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', name: '커플/허니문', icon: '💑' },
  { id: 'allinclusive', name: '올인클루시브', icon: '🌟' },
  { id: 'budget', name: '가성비', icon: '💰' },
  { id: 'residence', name: '레지던스', icon: '🏠' },
];

export const priceRanges = [
  { id: 'all', name: '전체', min: 0, max: Infinity },
  { id: '$', name: '~10만원', min: 0, max: 100000 },
  { id: '$$', name: '10~20만원', min: 100000, max: 200000 },
  { id: '$$$', name: '20~40만원', min: 200000, max: 400000 },
  { id: '$$$$', name: '40만원~', min: 400000, max: Infinity },
];

export const accommodations: Accommodation[] = [
  // ========== 깜란 지역 (Cam Ranh) ==========
  // 가족 단위 추천
  {
    id: 'alma-resort',
    name: 'Alma Resort Cam Ranh',
    nameKo: '알마 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['family'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 350000,
    rating: 4.7,
    reviewCount: 1850,
    description: '워터파크·영화관 무료, 13세 미만 아동 2명 무료 투숙/조식, 12개 수영장을 갖춘 가족 친화적 리조트',
    features: ['12개 수영장', '워터파크 무료', '영화관 무료', '13세 미만 아동 2명 무료', '키즈클럽'],
    amenities: ['수영장', '워터파크', '영화관', '키즈클럽', '레스토랑', '스파', '피트니스'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: { lat: 12.0234, lng: 109.2187 }
  },
  {
    id: 'movenpick-resort',
    name: 'Movenpick Resort Cam Ranh',
    nameKo: '모벤픽 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['family'],
    priceRange: '$$',
    priceMin: 180000,
    priceMax: 300000,
    rating: 4.6,
    reviewCount: 1420,
    description: '공항 무료 셔틀, 초콜릿 파티(15-16시), 워터슬라이드, 어린이 인형 선물 등 아이들을 위한 서비스가 풍부한 리조트',
    features: ['공항 무료 셔틀', '초콜릿 파티', '워터슬라이드', '어린이 인형 선물', '키즈클럽'],
    amenities: ['수영장', '워터슬라이드', '키즈클럽', '레스토랑', '스파', '피트니스'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    coordinates: { lat: 12.0156, lng: 109.2098 }
  },
  // 연인/허니문 추천
  {
    id: 'anamandara-resort',
    name: 'Anamandara Resort',
    nameKo: '아나만다라 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['couple'],
    priceRange: '$$$',
    priceMin: 250000,
    priceMax: 450000,
    rating: 4.8,
    reviewCount: 1120,
    description: '전체가 예술작품 같은 조경으로 유명한 로맨틱 리조트. 얼리버드 15% 할인, 3박 이상 15% 할인',
    features: ['예술적 조경', '프라이빗 비치', '얼리버드 할인', '3박 이상 할인', '로맨틱 분위기'],
    amenities: ['수영장', '스파', '프라이빗 비치', '레스토랑', '바', '요가'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    coordinates: { lat: 12.0312, lng: 109.2234 }
  },
  {
    id: 'mia-resort',
    name: 'Mia Resort Nha Trang',
    nameKo: '미야 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['couple'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 350000,
    rating: 4.7,
    reviewCount: 980,
    description: '독특한 절벽 뷰와 아름다운 포토스팟이 많은 부티크 리조트. 로맨틱한 분위기 최고',
    features: ['절벽 뷰', '포토스팟 다수', '부티크 스타일', '프라이빗 비치', '선셋 뷰'],
    amenities: ['수영장', '스파', '프라이빗 비치', '레스토랑', '바', '카약'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    coordinates: { lat: 12.0187, lng: 109.2156 }
  },
  {
    id: 'terracotta-resort',
    name: 'Terracotta Resort',
    nameKo: '터라코타 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['couple'],
    priceRange: '$$',
    priceMin: 150000,
    priceMax: 250000,
    rating: 4.5,
    reviewCount: 750,
    description: '자연 속 느낌의 아름다운 조경이 특징인 힐링 리조트',
    features: ['자연 친화적 조경', '힐링 분위기', '프라이빗 비치', '가성비'],
    amenities: ['수영장', '스파', '프라이빗 비치', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    coordinates: { lat: 12.0289, lng: 109.2145 }
  },
  // 올인클루시브
  {
    id: 'swandor-resort',
    name: 'Swandor Cam Ranh Resort',
    nameKo: '스완도르 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['allinclusive', 'family'],
    priceRange: '$$$',
    priceMin: 250000,
    priceMax: 400000,
    rating: 4.6,
    reviewCount: 2100,
    description: '주류 종류 최다! 543객실 대형 리조트, 5개 수영장, 공항 7분, 18시 레이트체크아웃',
    features: ['주류 종류 최다', '543객실', '5개 수영장', '공항 7분', '18시 레이트체크아웃', '올인클루시브'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '키즈클럽', '워터파크'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    coordinates: { lat: 12.0123, lng: 109.2067 }
  },
  {
    id: 'selectum-noa',
    name: 'Selectum Noa Resort',
    nameKo: '셀렉텀 노아',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['allinclusive', 'family'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 350000,
    rating: 4.5,
    reviewCount: 1680,
    description: '워터파크 포함, 한국인 VIP 체크인, 맥주·와인 무제한, 한국인 주방장 상주',
    features: ['워터파크 포함', '한국인 VIP 체크인', '맥주·와인 무제한', '한국인 주방장', '올인클루시브'],
    amenities: ['수영장', '워터파크', '스파', '피트니스', '레스토랑', '바', '키즈클럽'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    coordinates: { lat: 12.0198, lng: 109.2123 }
  },
  {
    id: 'riviera-resort',
    name: 'Riviera Resort Cam Ranh',
    nameKo: '리비에라 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['allinclusive', 'family'],
    priceRange: '$$',
    priceMin: 180000,
    priceMax: 300000,
    rating: 4.4,
    reviewCount: 1340,
    description: '가장 대규모 워터파크 보유! 2박 이상 왕복 셔틀 무료',
    features: ['대규모 워터파크', '2박 이상 셔틀 무료', '올인클루시브', '키즈풀'],
    amenities: ['수영장', '워터파크', '스파', '피트니스', '레스토랑', '바', '키즈클럽'],
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    coordinates: { lat: 12.0256, lng: 109.2178 }
  },
  {
    id: 'aquamarine-resort',
    name: 'Aquamarine Resort',
    nameKo: '아쿠아마린 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['allinclusive'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 350000,
    rating: 4.6,
    reviewCount: 520,
    description: '2024년 신규 오픈! 아쿠아파크·요가·해변스포츠 무료, 시내 셔틀 제공',
    features: ['2024년 오픈', '아쿠아파크 무료', '요가 무료', '해변스포츠 무료', '시내 셔틀', '올인클루시브'],
    amenities: ['수영장', '아쿠아파크', '스파', '요가', '레스토랑', '바'],
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
    coordinates: { lat: 12.0167, lng: 109.2089 },
    isNew: true,
    openYear: 2024
  },
  // 깜란 추가 리조트
  {
    id: 'melia-vinpearl',
    name: 'Melia Vinpearl Cam Ranh',
    nameKo: '멜리아 빈펄',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['couple'],
    priceRange: '$$$$',
    priceMin: 400000,
    priceMax: 700000,
    rating: 4.8,
    reviewCount: 890,
    description: '전 객실 독채형 빌라로 프라이빗한 휴양이 가능한 럭셔리 리조트',
    features: ['전 객실 독채형 빌라', '프라이빗', '프리미엄 서비스', '프라이빗 풀'],
    amenities: ['프라이빗 풀', '스파', '피트니스', '레스토랑', '바', '버틀러 서비스'],
    image: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800',
    coordinates: { lat: 12.0278, lng: 109.2201 }
  },
  {
    id: 'wyndham-garden',
    name: 'Wyndham Garden Cam Ranh',
    nameKo: '윈덤가든',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['family', 'couple'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 350000,
    rating: 4.5,
    reviewCount: 720,
    description: '넓은 바다와 함께 수영 가능한 인피니티 풀이 매력적인 리조트',
    features: ['인피니티 풀', '오션뷰', '넓은 객실', '프라이빗 비치'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바'],
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    coordinates: { lat: 12.0212, lng: 109.2134 }
  },
  {
    id: 'fusion-resort',
    name: 'Fusion Resort Cam Ranh',
    nameKo: '퓨전 리조트',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['allinclusive', 'couple'],
    priceRange: '$$$$',
    priceMin: 400000,
    priceMax: 750000,
    rating: 4.7,
    reviewCount: 650,
    description: '스파 인클루시브! 아름다운 정원과 매일 2회 스파 트리트먼트 포함',
    features: ['스파 인클루시브', '매일 2회 스파', '풀빌라', '아름다운 정원', '웰니스 프로그램'],
    amenities: ['프라이빗 풀', '스파', '요가', '레스토랑', '바', '자전거'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    coordinates: { lat: 12.0145, lng: 109.2078 }
  },
  {
    id: 'amiana-camranh',
    name: 'Amiana Cam Ranh Resort',
    nameKo: '아미아나 깜란',
    area: 'camranh',
    areaName: '깜란',
    purpose: ['family', 'allinclusive'],
    priceRange: '$$$',
    priceMin: 220000,
    priceMax: 400000,
    rating: 4.6,
    reviewCount: 450,
    description: '2025년 신규 오픈! 머드배스 포함, 디너/런치 선택 가능',
    features: ['2025년 오픈', '머드배스 포함', '디너/런치 선택', '프라이빗 비치'],
    amenities: ['수영장', '머드스파', '피트니스', '레스토랑', '키즈클럽'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: { lat: 12.0234, lng: 109.2167 },
    isNew: true,
    openYear: 2025
  },

  // ========== 나트랑 시내 (City) ==========
  // 5성급 럭셔리
  {
    id: 'intercontinental',
    name: 'InterContinental Nha Trang',
    nameKo: '인터컨티넨탈',
    area: 'city',
    areaName: '시내',
    purpose: ['couple'],
    priceRange: '$$',
    priceMin: 150000,
    priceMax: 250000,
    rating: 4.7,
    reviewCount: 2340,
    description: '3구역 위치, 오션뷰, 프리미엄 서비스. 한국 5성급 대비 매우 저렴한 가격으로 호캉스 가능',
    features: ['오션뷰', '프리미엄 서비스', '해변 직접 연결', '루프탑 바'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '컨시어지'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    coordinates: { lat: 12.2389, lng: 109.1956 }
  },
  {
    id: 'sheraton',
    name: 'Sheraton Nha Trang',
    nameKo: '쉐라톤 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['couple', 'family'],
    priceRange: '$$',
    priceMin: 120000,
    priceMax: 200000,
    rating: 4.6,
    reviewCount: 1890,
    description: '3구역 위치, 품격 있는 서비스, 루프탑 수영장이 매력적인 5성급 호텔',
    features: ['루프탑 수영장', '품격 있는 서비스', '시내 중심', '오션뷰'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '비즈니스센터'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    coordinates: { lat: 12.2451, lng: 109.1943 }
  },
  // 가성비 호텔
  {
    id: 'panama-hotel',
    name: 'Panama Hotel Nha Trang',
    nameKo: '파나마 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 40000,
    priceMax: 60000,
    rating: 4.5,
    reviewCount: 680,
    description: '2024년 5월 오픈! 280객실, 루프탑 수영장, 야시장 도보 4분, 스마트TV 완비',
    features: ['2024년 오픈', '280객실', '루프탑 수영장', '야시장 도보 4분', '스마트TV'],
    amenities: ['수영장', '피트니스', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    coordinates: { lat: 12.2445, lng: 109.1945 },
    isNew: true,
    openYear: 2024
  },
  {
    id: 'lemore-hotel',
    name: 'Lemore Hotel Nha Trang',
    nameKo: '르모어 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 80000,
    priceMax: 120000,
    rating: 4.4,
    reviewCount: 1250,
    description: '한국인 인기! 루프탑 수영장, 시내 전경 뷰, 야시장 도보권',
    features: ['한국인 인기', '루프탑 수영장', '시내 전경 뷰', '야시장 도보권'],
    amenities: ['수영장', '피트니스', '레스토랑', '바'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    coordinates: { lat: 12.2467, lng: 109.1932 }
  },
  {
    id: 'lescham-hotel',
    name: 'Les Cham Hotel',
    nameKo: '레스참 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 20000,
    priceMax: 40000,
    rating: 4.2,
    reviewCount: 890,
    description: '넓은 면적, 쾌적한 사용, 조식 포함. 가성비 최고의 선택',
    features: ['넓은 면적', '조식 포함', '쾌적한 시설', '가성비 최고'],
    amenities: ['레스토랑', '투어데스크'],
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    coordinates: { lat: 12.2398, lng: 109.1967 }
  },
  {
    id: 'grand-tourane',
    name: 'Grand Tourane Hotel',
    nameKo: '그랜드 투란',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 30000,
    priceMax: 50000,
    rating: 4.3,
    reviewCount: 720,
    description: '디자인 호텔! 기억에 남는 인테리어가 특징',
    features: ['디자인 호텔', '독특한 인테리어', '시내 중심'],
    amenities: ['레스토랑', '피트니스'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    coordinates: { lat: 12.2423, lng: 109.1954 }
  },
  {
    id: 'december-hotel',
    name: 'December Hotel',
    nameKo: '디셈버 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 40000,
    priceMax: 60000,
    rating: 4.4,
    reviewCount: 950,
    description: '5성급 시설, 절제된 모던함으로 인기 있는 호텔',
    features: ['5성급 시설', '모던 인테리어', '시내 중심'],
    amenities: ['수영장', '피트니스', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    coordinates: { lat: 12.2456, lng: 109.1938 }
  },
  // 레지던스형 호텔
  {
    id: 'costa-residence',
    name: 'The Costa Residence',
    nameKo: '더 코스타 레지던스',
    area: 'city',
    areaName: '시내',
    purpose: ['residence'],
    priceRange: '$',
    priceMin: 60000,
    priceMax: 100000,
    rating: 4.3,
    reviewCount: 580,
    description: '풀키친, 세탁기 완비. 장기 투숙, 한 달 살기에 최적',
    features: ['풀키친', '세탁기 완비', '장기 투숙 적합', '넓은 공간'],
    amenities: ['수영장', '피트니스', '주방', '세탁기'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    coordinates: { lat: 12.2478, lng: 109.1921 }
  },
  {
    id: 'costa-executive',
    name: 'Costa Executive Residence',
    nameKo: '코스타 이그제큐티브',
    area: 'city',
    areaName: '시내',
    purpose: ['residence'],
    priceRange: '$',
    priceMin: 70000,
    priceMax: 120000,
    rating: 4.4,
    reviewCount: 420,
    description: '비즈니스 출장에도 적합한 고급 레지던스',
    features: ['비즈니스 적합', '풀키친', '세탁기', '오피스 공간'],
    amenities: ['수영장', '피트니스', '주방', '세탁기', '비즈니스센터'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    coordinates: { lat: 12.2489, lng: 109.1915 }
  },
  {
    id: 'maple-apartment',
    name: 'Maple Hotel & Apartment',
    nameKo: '메이플 호텔 앤 아파트먼트',
    area: 'city',
    areaName: '시내',
    purpose: ['residence', 'budget'],
    priceRange: '$',
    priceMin: 40000,
    priceMax: 70000,
    rating: 4.2,
    reviewCount: 380,
    description: '가성비 장기 투숙에 최적화된 아파트먼트 호텔',
    features: ['가성비 장기 투숙', '풀키친', '세탁기'],
    amenities: ['주방', '세탁기', '피트니스'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    coordinates: { lat: 12.2434, lng: 109.1948 }
  },
  {
    id: 'twoblue-hotel',
    name: 'Two Blue Hotel',
    nameKo: '투위블루 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['residence', 'budget'],
    priceRange: '$',
    priceMin: 50000,
    priceMax: 80000,
    rating: 4.1,
    reviewCount: 320,
    description: '깔끔한 시설의 레지던스형 호텔',
    features: ['깔끔한 시설', '레지던스형', '시내 접근성'],
    amenities: ['주방', '세탁기', '피트니스'],
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    coordinates: { lat: 12.2445, lng: 109.1962 }
  },

  // ========== 빈펄섬 (Vinpearl) ==========
  {
    id: 'vinpearl-resort-spa',
    name: 'Vinpearl Resort & Spa Nha Trang Bay',
    nameKo: '빈펄 리조트 & 스파',
    area: 'vinpearl',
    areaName: '빈펄',
    purpose: ['family', 'couple'],
    priceRange: '$$',
    priceMin: 150000,
    priceMax: 300000,
    rating: 4.8,
    reviewCount: 2340,
    description: '빈원더스 뷰, 프라이빗 비치, 아쿠아필드 무료, 15% 할인 프로모션. 숙박권에 빈원더스 포함 패키지 선택 가능',
    features: ['빈원더스 뷰', '프라이빗 비치', '아쿠아필드 무료', '15% 할인', '빈원더스 패키지'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '워터파크', '골프'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: { lat: 12.2074, lng: 109.2287 }
  },
  {
    id: 'vinpearl-discovery',
    name: 'Vinpearl Discovery Nha Trang',
    nameKo: '빈펄 디스커버리',
    area: 'vinpearl',
    areaName: '빈펄',
    purpose: ['family'],
    priceRange: '$$',
    priceMin: 120000,
    priceMax: 250000,
    rating: 4.6,
    reviewCount: 1560,
    description: '가족 단위에 적합한 빈원더스 패키지 리조트',
    features: ['가족 적합', '빈원더스 패키지', '키즈클럽', '워터파크 접근'],
    amenities: ['수영장', '스파', '키즈클럽', '레스토랑', '바'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    coordinates: { lat: 12.2089, lng: 109.2298 }
  },
  {
    id: 'vinpearl-golf',
    name: 'Vinpearl Resort & Golf Nha Trang',
    nameKo: '빈펄 리조트 & 골프',
    area: 'vinpearl',
    areaName: '빈펄',
    purpose: ['couple'],
    priceRange: '$$$',
    priceMin: 200000,
    priceMax: 400000,
    rating: 4.7,
    reviewCount: 890,
    description: '골프 여행객 추천! 18홀 골프장과 함께하는 리조트',
    features: ['18홀 골프장', '골프 패키지', '프라이빗 비치', '빈원더스 접근'],
    amenities: ['골프장', '수영장', '스파', '피트니스', '레스토랑', '바'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    coordinates: { lat: 12.2056, lng: 109.2276 }
  },
  {
    id: 'hontam-resort',
    name: 'Hon Tam Resort',
    nameKo: '혼땀 리조트',
    area: 'vinpearl',
    areaName: '빈펄',
    purpose: ['couple', 'family'],
    priceRange: '$$',
    priceMin: 100000,
    priceMax: 200000,
    rating: 4.5,
    reviewCount: 720,
    description: '해상 투어·스노클링 성지! 수상 레포츠를 좋아하면 강력 추천',
    features: ['스노클링 성지', '수상 레포츠', '해상 투어', '프라이빗 비치'],
    amenities: ['수영장', '스파', '레스토랑', '바', '수상스포츠', '카약'],
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
    coordinates: { lat: 12.1678, lng: 109.2234 }
  },

  // ========== 혼총 지역 (Hon Chong) ==========
  {
    id: 'amiana-resort',
    name: 'Amiana Resort Nha Trang',
    nameKo: '아미아나 리조트',
    area: 'honchong',
    areaName: '혼총',
    purpose: ['family', 'couple'],
    priceRange: '$$',
    priceMin: 150000,
    priceMax: 300000,
    rating: 4.7,
    reviewCount: 1850,
    description: '가장 인기! 3박 10%↓, 4박 15%↓, 프라이빗 비치 스노클링, 그랩 3분. 시내와 가까워 관광+리조트 동시 가능',
    features: ['가장 인기', '3박 10% 할인', '4박 15% 할인', '프라이빗 비치', '스노클링', '시내 접근성'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '프라이빗 비치'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: { lat: 12.2789, lng: 109.2145 }
  },
  {
    id: 'alibu-resort',
    name: 'Alibu Resort',
    nameKo: '알리부 리조트',
    area: 'honchong',
    areaName: '혼총',
    purpose: ['couple'],
    priceRange: '$$',
    priceMin: 120000,
    priceMax: 250000,
    rating: 4.5,
    reviewCount: 680,
    description: '최근 뜨는 리조트! 프라이빗하고 한식 조식 제공',
    features: ['최근 인기', '프라이빗', '한식 조식', '조용한 분위기'],
    amenities: ['수영장', '스파', '레스토랑', '프라이빗 비치'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    coordinates: { lat: 12.2756, lng: 109.2167 }
  },
  {
    id: 'boma-resort',
    name: 'Boma Resort Nha Trang',
    nameKo: '보마 리조트',
    area: 'honchong',
    areaName: '혼총',
    purpose: ['couple'],
    priceRange: '$$',
    priceMin: 100000,
    priceMax: 200000,
    rating: 4.6,
    reviewCount: 520,
    description: '2023년 오픈! 40㎡ 넓은 기본룸, 인피니티풀, 시내 셔틀 운행, 조용한 힐링',
    features: ['2023년 오픈', '40㎡ 넓은 객실', '인피니티풀', '시내 셔틀', '조용한 힐링'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    coordinates: { lat: 12.2734, lng: 109.2189 },
    isNew: true,
    openYear: 2023
  },
  {
    id: 'gran-melia',
    name: 'Gran Melia Nha Trang',
    nameKo: '그란멜리아',
    area: 'honchong',
    areaName: '혼총',
    purpose: ['couple'],
    priceRange: '$$$',
    priceMin: 300000,
    priceMax: 450000,
    rating: 4.9,
    reviewCount: 380,
    description: '가장 최신 리조트! 2023년 7월 오픈, 121㎡ 넓은 객실, 전객실 오션뷰, JTB 최고 등급 럭셔리',
    features: ['2023년 오픈', '121㎡ 넓은 객실', '전객실 오션뷰', 'JTB 최고 등급', '프라이빗 해변', '카약/패들보드', '쿠킹클래스'],
    amenities: ['수영장', '스파', '피트니스', '레스토랑', '바', '프라이빗 비치'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    coordinates: { lat: 12.2712, lng: 109.2201 },
    isNew: true,
    openYear: 2023
  },

  // ========== 닌반베이 (Ninh Van Bay) ==========
  {
    id: 'six-senses',
    name: 'Six Senses Ninh Van Bay',
    nameKo: '식스센스 닌반베이',
    area: 'ninhvan',
    areaName: '닌반베이',
    purpose: ['couple'],
    priceRange: '$$$$',
    priceMin: 650000,
    priceMax: 900000,
    rating: 4.9,
    reviewCount: 890,
    description: '세계적 허니문 브랜드! 전 객실 풀빌라, 2박 필수, 공항 왕복 셔틀+보트 무료. 보트로만 접근 가능한 프라이빗 천국',
    features: ['세계적 허니문 브랜드', '전 객실 풀빌라', '버틀러 서비스', '공항 셔틀+보트 무료', '2박 필수'],
    amenities: ['프라이빗 풀', '스파', '요가', '레스토랑', '와인셀러', '수상스포츠'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    coordinates: { lat: 12.3521, lng: 109.2654 }
  },
  {
    id: 'lalia-resort',
    name: 'L\'Alya Ninh Van Bay',
    nameKo: '랄리아 리조트',
    area: 'ninhvan',
    areaName: '닌반베이',
    purpose: ['couple'],
    priceRange: '$$$',
    priceMin: 350000,
    priceMax: 550000,
    rating: 4.7,
    reviewCount: 420,
    description: '닌반베이 중 가장 합리적 가격! 스피드보트 15분, 풀빌라',
    features: ['합리적 가격', '풀빌라', '스피드보트 15분', '프라이빗'],
    amenities: ['프라이빗 풀', '스파', '레스토랑', '바', '수상스포츠'],
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    coordinates: { lat: 12.3489, lng: 109.2623 }
  },
  {
    id: 'anlam-retreat',
    name: 'An Lam Retreats Ninh Van Bay',
    nameKo: '안람 리트리트',
    area: 'ninhvan',
    areaName: '닌반베이',
    purpose: ['couple'],
    priceRange: '$$$$',
    priceMin: 500000,
    priceMax: 800000,
    rating: 4.8,
    reviewCount: 350,
    description: '자연과 하나 된 힐링, 버틀러 서비스로 완벽한 프라이버시',
    features: ['자연 친화', '버틀러 서비스', '힐링', '완벽한 프라이버시'],
    amenities: ['프라이빗 풀', '스파', '요가', '레스토랑', '버틀러 서비스'],
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
    coordinates: { lat: 12.3456, lng: 109.2601 }
  },

  // ========== 신상 호텔 (2023-2025) ==========
  {
    id: 'champtron-hotel',
    name: 'Champtron Hotel',
    nameKo: '챔프턴 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 80000,
    priceMax: 150000,
    rating: 4.6,
    reviewCount: 180,
    description: '2025년 10월 오픈! 가장 최신 5성급, 루프탑풀/바, 해변 도보5분, 시내 중심',
    features: ['2025년 오픈', '가장 최신 5성급', '루프탑풀', '루프탑바', '해변 도보5분'],
    amenities: ['수영장', '피트니스', '레스토랑', '바', '스파'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: { lat: 12.2467, lng: 109.1928 },
    isNew: true,
    openYear: 2025
  },
  {
    id: 'iconic-hotel',
    name: 'Iconic Hotel Nha Trang',
    nameKo: '이코니크 호텔',
    area: 'city',
    areaName: '시내',
    purpose: ['budget', 'family'],
    priceRange: '$',
    priceMin: 50000,
    priceMax: 100000,
    rating: 4.5,
    reviewCount: 150,
    description: '2025년 8월 오픈! 챔프턴 바로 옆, 키즈클럽, 스타벅스/해변 도보5분',
    features: ['2025년 오픈', '키즈클럽', '스타벅스 근처', '해변 도보5분'],
    amenities: ['수영장', '키즈클럽', '피트니스', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    coordinates: { lat: 12.2469, lng: 109.1931 },
    isNew: true,
    openYear: 2025
  },
  {
    id: 'best-western-marvella',
    name: 'Best Western Premier Marvella',
    nameKo: '베스트웨스턴 마벨라',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 60000,
    priceMax: 120000,
    rating: 4.4,
    reviewCount: 620,
    description: '2023년 9월 오픈! 355객실, 32층 스카이라운지, 31층 인피니티풀, 해변 바로 앞',
    features: ['2023년 오픈', '355객실', '32층 스카이라운지', '31층 인피니티풀', '해변 바로 앞'],
    amenities: ['수영장', '피트니스', '레스토랑', '바', '스카이라운지'],
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    coordinates: { lat: 12.2445, lng: 109.1952 },
    isNew: true,
    openYear: 2023
  },
  {
    id: 'signature-hotel',
    name: 'The Signature Hotel',
    nameKo: '더 시그니처',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 40000,
    priceMax: 80000,
    rating: 4.5,
    reviewCount: 480,
    description: '2024년 6월 오픈! 한국식 찜질방 보유, 27층 인피니티풀, 26층 조식, 해변 도보5분',
    features: ['2024년 오픈', '한국식 찜질방', '27층 인피니티풀', '26층 조식', '해변 도보5분'],
    amenities: ['수영장', '찜질방', '피트니스', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    coordinates: { lat: 12.2456, lng: 109.1941 },
    isNew: true,
    openYear: 2024
  },
  {
    id: 'seaside-boutique',
    name: 'Seaside Boutique Hotel',
    nameKo: '시사이드 부티크',
    area: 'city',
    areaName: '시내',
    purpose: ['budget'],
    priceRange: '$',
    priceMin: 20000,
    priceMax: 40000,
    rating: 4.3,
    reviewCount: 220,
    description: '2025년 3월 오픈! 초가성비! 루프탑풀, 야시장/해변 도보10분, 시내 중심',
    features: ['2025년 오픈', '초가성비', '루프탑풀', '야시장 도보10분', '시내 중심'],
    amenities: ['수영장', '레스토랑'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    coordinates: { lat: 12.2434, lng: 109.1965 },
    isNew: true,
    openYear: 2025
  },
];

export function filterAccommodations(
  data: Accommodation[],
  filters: {
    area?: string;
    purpose?: string;
    priceRange?: string;
    search?: string;
  }
): Accommodation[] {
  return data.filter((item) => {
    // Area filter
    if (filters.area && filters.area !== 'all' && item.area !== filters.area) {
      return false;
    }

    // Purpose filter
    if (filters.purpose && filters.purpose !== 'all' && !item.purpose.includes(filters.purpose as any)) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === filters.priceRange);
      if (range && (item.priceMin > range.max || item.priceMax < range.min)) {
        return false;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.nameKo.includes(filters.search) ||
        item.areaName.includes(filters.search) ||
        item.description.includes(filters.search)
      );
    }

    return true;
  });
}
