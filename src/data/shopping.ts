export interface ShoppingPlace {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  priceLevel: 'budget' | 'moderate' | 'premium';
  image: string;
  address: string;
  hours: string;
  description: string;
  rating: number;
  reviewCount: number;
  bargainOk: boolean;
  popularItems: string[];
  highlights: string[];
  tips?: string;
}

export const categories = [
  { id: 'all', name: '전체', icon: '🛒', count: 10 },
  { id: 'mart', name: '대형마트', icon: '🏪', count: 3 },
  { id: 'mall', name: '쇼핑몰', icon: '🏬', count: 4 },
  { id: 'market', name: '전통시장', icon: '🏮', count: 2 },
  { id: 'night-market', name: '야시장', icon: '🌙', count: 1 },
];

export const priceLevels = [
  { id: 'all', name: '전체' },
  { id: 'budget', name: '저렴' },
  { id: 'moderate', name: '보통' },
  { id: 'premium', name: '고급' },
];

export const shoppingPlaces: ShoppingPlace[] = [
  // 🏪 대형마트 (3곳)
  {
    id: 'lotte-mart-gold-coast',
    name: 'Lotte Mart Gold Coast',
    nameKo: '롯데마트 골드코스트점',
    category: 'mart',
    priceLevel: 'moderate',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    address: '01 Trần Hưng Đạo, Lộc Thọ',
    hours: '08:30~22:00',
    description: '시내 접근성 최고, 해변 도보 3분',
    rating: 4.5,
    reviewCount: 2840,
    bargainOk: false,
    popularItems: ['G7커피', '망고젤리', '건망고', '센소다인 치약', '쌀국수라면'],
    highlights: ['짐보관 서비스', '볼링장', '푸드코트', '키즈카페'],
    tips: '한국인 여행객 많아 인기 상품 코너 별도 마련, 카드결제 가능',
  },
  {
    id: 'lotte-mart-nha-trang',
    name: 'Lotte Mart Nha Trang',
    nameKo: '롯데마트 냐짱점',
    category: 'mart',
    priceLevel: 'moderate',
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800',
    address: '롱선사 근처 (시내에서 차로 8분)',
    hours: '08:00~22:00',
    description: '1호점, 건물 전체가 롯데마트로 규모 최대',
    rating: 4.4,
    reviewCount: 1520,
    bargainOk: false,
    popularItems: ['커피', '과자', '라면', '화장품'],
    highlights: ['물건 종류 다양', '대량 구매 적합'],
    tips: '골드코스트점보다 한산해서 쇼핑 편함',
  },
  {
    id: 'go-nha-trang',
    name: 'GO! Nha Trang',
    nameKo: 'GO! 나트랑 (구 빅씨마트)',
    category: 'mart',
    priceLevel: 'budget',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800',
    address: 'Vinh Diem 지역 (시내에서 차로 약 10분)',
    hours: '07:00~23:00',
    description: '30,000㎡ 대규모, 28,000여 종 상품',
    rating: 4.3,
    reviewCount: 980,
    bargainOk: false,
    popularItems: ['로컬 식품', '생활용품', '의류'],
    highlights: ['3,000㎡ 어린이 놀이터', '현지인 위주'],
    tips: '2020년 Big C에서 GO!로 브랜드 변경, 현지인 위주로 가격 저렴',
  },

  // 🏬 쇼핑몰 (4곳)
  {
    id: 'vincom-plaza-tran-phu',
    name: 'Vincom Plaza Tran Phu',
    nameKo: '빈컴 플라자 쩐푸',
    category: 'mall',
    priceLevel: 'premium',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',
    address: '20 Tran Phu Street',
    hours: '09:00~22:00',
    description: '해변가 오션뷰, 지상4층+지하2층',
    rating: 4.6,
    reviewCount: 1850,
    bargainOk: false,
    popularItems: ['패션 브랜드', '화장품', '전자기기'],
    highlights: ['패션브랜드', '영화관', '오락실', '바다뷰'],
    tips: '윈마트(2층), CGV영화관(4층), 다양한 레스토랑',
  },
  {
    id: 'vincom-plaza-le-thanh-ton',
    name: 'Vincom Plaza Le Thanh Ton',
    nameKo: '빈컴 플라자 레탄똔',
    category: 'mall',
    priceLevel: 'premium',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800',
    address: '시내 중심가 (나트랑 대성당 도보 5분)',
    hours: '10:00~22:00',
    description: '국내외 브랜드 매장, 어린이 놀이터',
    rating: 4.5,
    reviewCount: 1420,
    bargainOk: false,
    popularItems: ['브랜드 의류', '액세서리', '카페'],
    highlights: ['영화관', '레스토랑', '짐보관 무료(2층)'],
    tips: '10km 이내 무료 배달 서비스',
  },
  {
    id: 'gold-coast-mall',
    name: 'Gold Coast Mall',
    nameKo: '골드코스트몰',
    category: 'mall',
    priceLevel: 'moderate',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    address: 'Trần Hưng Đạo (롯데마트 골드코스트점과 같은 건물)',
    hours: '08:30~22:00',
    description: '나트랑 최초 국제표준 쇼핑센터',
    rating: 4.4,
    reviewCount: 890,
    bargainOk: false,
    popularItems: ['의류', '캐리어', '잡화'],
    highlights: ['의류', '캐리어', '푸드코트'],
  },
  {
    id: 'nha-trang-center',
    name: 'Nha Trang Center',
    nameKo: '나트랑 센터',
    category: 'mall',
    priceLevel: 'moderate',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    address: '20 Tran Phu Street (해변가)',
    hours: '08:00~22:00',
    description: '4층 규모, 바다뷰 감상하며 쇼핑/식사',
    rating: 4.3,
    reviewCount: 720,
    bargainOk: false,
    popularItems: ['기념품', '의류', '식사'],
    highlights: ['쇼핑', '식사', '엔터테인먼트'],
  },

  // 🏮 전통시장 (2곳)
  {
    id: 'dam-market',
    name: 'Dam Market',
    nameKo: '담 시장',
    category: 'market',
    priceLevel: 'budget',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    address: 'Phan Bội Châu, Xương Huân',
    hours: '05:00~18:30 (대부분 17시부터 정리)',
    description: '나트랑 최대 재래시장, 연꽃 모양 독특한 건축물',
    rating: 4.2,
    reviewCount: 2100,
    bargainOk: true,
    popularItems: ['캐슈넛/마카다미아', '라탄백', '크록스', '건어물'],
    highlights: ['5,000㎡ 규모', '신선 해산물', '건어물', '열대과일'],
    tips: '흥정 필수! 처음 제시 가격의 50%부터 시작, 현금(VND) 준비',
  },
  {
    id: 'xom-moi-market',
    name: 'Xom Moi Market',
    nameKo: '쫌모이 시장',
    category: 'market',
    priceLevel: 'budget',
    image: 'https://images.unsplash.com/photo-1519227355453-8f982e425321?w=800',
    address: '시내 중심부 (담시장보다 접근성 좋음)',
    hours: '06:00~18:00',
    description: '현지인 위주 로컬시장, 저렴한 농수산물',
    rating: 4.1,
    reviewCount: 650,
    bargainOk: true,
    popularItems: ['열대과일', '해산물', '채소'],
    highlights: ['열대과일', '농수산물', '현지 분위기'],
    tips: '담시장보다 작지만 더 저렴하고 현지 분위기 물씬',
  },

  // 🌙 야시장 (1곳)
  {
    id: 'nha-trang-night-market',
    name: 'Nha Trang Night Market',
    nameKo: '나트랑 야시장',
    category: 'night-market',
    priceLevel: 'budget',
    image: 'https://images.unsplash.com/photo-1519227355453-8f982e425321?w=800',
    address: 'Tran Phu Road (해변가, 트람흐엉타워 맞은편)',
    hours: '19:00~22:00 (연중무휴)',
    description: '약 200m 거리, 비치웨어/기념품/진주액세서리',
    rating: 4.3,
    reviewCount: 1580,
    bargainOk: true,
    popularItems: ['비치 원피스', '크록스', '말린과일', '라탄가방'],
    highlights: ['비치웨어', '기념품', '진주 액세서리', '먹거리'],
    tips: '흥정 필수, 가장 붐비는 시간 20~21시, 롤 크림(철판 아이스크림) 유명',
  },
];

// 필수 쇼핑 아이템 추천 목록
export const recommendedShoppingItems = [
  { name: 'G7 커피', price: '믹스커피 21개입 약 2,750원', where: '롯데마트' },
  { name: '콘삭 커피', price: '드리퍼 세트', where: '롯데마트' },
  { name: '체리쉬 망고젤리', price: '8봉지 약 13,000원', where: '롯데마트' },
  { name: '건망고/말린 파인애플', price: '-', where: '롯데마트/담시장' },
  { name: '캐슈넛/마카다미아', price: '-', where: '담시장 (더 저렴)' },
  { name: '센소다인 치약', price: '약 2,900원', where: '롯데마트' },
  { name: '바나나 선크림', price: '-', where: '롯데마트 (약국보다 저렴)' },
  { name: '커피 드리퍼', price: '약 1,200원', where: '롯데마트' },
  { name: '칼치즈 크래커', price: '17입 약 1,450원', where: '롯데마트' },
  { name: 'COZY 복숭아 차', price: '25티백 약 1,900원', where: '롯데마트' },
];

interface FilterOptions {
  category?: string;
  priceLevel?: string;
  search?: string;
}

export function filterShopping(
  items: ShoppingPlace[],
  filters: FilterOptions
): ShoppingPlace[] {
  let filtered = items;

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.priceLevel && filters.priceLevel !== 'all') {
    filtered = filtered.filter((p) => p.priceLevel === filters.priceLevel);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.nameKo.includes(filters.search!) ||
        p.description.includes(filters.search!) ||
        p.popularItems.some((item) => item.includes(filters.search!))
    );
  }

  return filtered;
}

export function filterShoppingPlaces(category?: string): ShoppingPlace[] {
  let filtered = shoppingPlaces;

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  return filtered;
}
