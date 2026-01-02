export interface Activity {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  image: string;
  description: string;
  price: string;
  priceValue?: { min: number; max: number }; // in KRW (만원)
  duration: string;
  tips?: string;
}

export const categories = [
  { id: 'all', name: '전체', icon: '🎯', count: 21 },
  { id: 'water', name: '수상 액티비티', icon: '🌊', count: 8 },
  { id: 'spa', name: '스파/힐링', icon: '🧖', count: 4 },
  { id: 'tour', name: '근교 투어', icon: '🚗', count: 5 },
  { id: 'party', name: '파티/나이트', icon: '🎉', count: 4 },
];

export const activities: Activity[] = [
  // 🌊 수상 액티비티 (8종)
  {
    id: 'island-hopping',
    name: 'Island Hopping Tour',
    nameKo: '호핑투어',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    description: '3섬 투어, 선상파티, 점심 포함',
    price: '3~6만원',
    priceValue: { min: 3, max: 6 },
    duration: '6-7시간',
  },
  {
    id: 'snorkeling',
    name: 'Snorkeling',
    nameKo: '스노클링',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
    description: '혼문섬, 담베이 등 투명한 바다',
    price: '3~5만원',
    priceValue: { min: 3, max: 5 },
    duration: '반나절',
  },
  {
    id: 'scuba-diving',
    name: 'Scuba Diving Experience',
    nameKo: '체험 다이빙 (스쿠버)',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800',
    description: '자격증 없이 체험 가능',
    price: '5~8만원',
    priceValue: { min: 5, max: 8 },
    duration: '반나절',
  },
  {
    id: 'sea-walking',
    name: 'Sea Walking',
    nameKo: '씨워킹 (해저산책)',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    description: '헬멧 쓰고 바닥 걷기',
    price: '4~6만원',
    priceValue: { min: 4, max: 6 },
    duration: '15-20분',
  },
  {
    id: 'parasailing',
    name: 'Parasailing',
    nameKo: '패러세일링',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800',
    description: '보트 연결 낙하산 비행',
    price: '현장 별도',
    duration: '10-15분',
  },
  {
    id: 'jet-ski',
    name: 'Jet Ski',
    nameKo: '제트스키',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1626607556444-f0c39a3bab09?w=800',
    description: '스피드 수상 오토바이',
    price: '현장 별도',
    duration: '15-30분',
  },
  {
    id: 'banana-boat',
    name: 'Banana Boat',
    nameKo: '바나나보트',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800',
    description: '튜브 보트 액티비티',
    price: '현장 별도',
    duration: '15분',
  },
  {
    id: 'emperor-cruise',
    name: 'Emperor Cruise',
    nameKo: '황제 크루즈',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1544551763-8dd44758c2dd?w=800',
    description: '럭셔리 선상 디너, 야경',
    price: '5~10만원',
    priceValue: { min: 5, max: 10 },
    duration: '2-3시간',
  },

  // 🧖 스파/힐링 (4종)
  {
    id: 'i-resort-mud',
    name: 'I-Resort Mud Spa',
    nameKo: '아이리조트 머드스파',
    category: 'spa',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    description: '대형 머드배스 + 온천 + 워터파크',
    price: '2~5만원',
    priceValue: { min: 2, max: 5 },
    duration: '반나절',
    tips: '가장 인기! 시간 무제한',
  },
  {
    id: 'galina-mud',
    name: 'Galina Mud Spa',
    nameKo: '갈리나 머드스파',
    category: 'spa',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    description: '시내 중심, 접근성 좋음',
    price: '2~4만원',
    priceValue: { min: 2, max: 4 },
    duration: '2-3시간',
    tips: '시내 유일 머드스파',
  },
  {
    id: 'hon-tam-mud',
    name: 'Hon Tam Island Mud Spa',
    nameKo: '혼땀섬 머드온천',
    category: 'spa',
    image: 'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800',
    description: '섬에서 머드배스 체험',
    price: '투어 포함',
    duration: '반나절',
  },
  {
    id: 'amiana-spa',
    name: 'Amiana Resort Spa',
    nameKo: '아미아나 리조트 스파',
    category: 'spa',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800',
    description: '프라이빗 머드 스파',
    price: '3~6만원',
    priceValue: { min: 3, max: 6 },
    duration: '2-3시간',
  },

  // 🚗 근교 투어 (5종)
  {
    id: 'dalat-tour',
    name: 'Da Lat Day Tour',
    nameKo: '달랏 데이투어',
    category: 'tour',
    image: 'https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?w=800',
    description: '꽃의 도시, 폭포, 카페',
    price: '4~7만원',
    priceValue: { min: 4, max: 7 },
    duration: '당일 (10-12시간)',
  },
  {
    id: 'phan-rang-desert',
    name: 'Phan Rang Desert Tour',
    nameKo: '판랑 사막투어',
    category: 'tour',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    description: '지프타고 일출/사막 체험',
    price: '3~5만원',
    priceValue: { min: 3, max: 5 },
    duration: '반나절~당일',
  },
  {
    id: 'mui-ne-tour',
    name: 'Mui Ne Tour',
    nameKo: '무이네 투어',
    category: 'tour',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    description: '붉은/흰 사막, 요정의 샘',
    price: '5~8만원',
    priceValue: { min: 5, max: 8 },
    duration: '당일',
  },
  {
    id: 'yang-bay-tour',
    name: 'Yang Bay Waterfall Tour',
    nameKo: '양베이 폭포투어',
    category: 'tour',
    image: 'https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800',
    description: '폭포+온천+동물체험',
    price: '2~4만원',
    priceValue: { min: 2, max: 4 },
    duration: '반나절',
  },
  {
    id: 'ba-ho-trekking',
    name: 'Ba Ho Falls Trekking',
    nameKo: '바호 폭포 트레킹',
    category: 'tour',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
    description: '자연 트레킹, 수영',
    price: '2~3만원',
    priceValue: { min: 2, max: 3 },
    duration: '반나절',
  },

  // 🎉 파티/나이트라이프 (4종)
  {
    id: 'pirate-hopping',
    name: 'Pirate Hopping Tour',
    nameKo: '해적 호핑투어',
    category: 'party',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',
    description: '선상파티 + MC진행 + 음료무제한',
    price: '5~7만원',
    priceValue: { min: 5, max: 7 },
    duration: '6-7시간',
  },
  {
    id: 'yolo-hopping',
    name: 'YOLO Hopping Tour',
    nameKo: 'YOLO 호핑투어',
    category: 'party',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800',
    description: '플로팅바 + 칵테일 + 선상공연',
    price: '4~6만원',
    priceValue: { min: 4, max: 6 },
    duration: '7시간',
  },
  {
    id: 'sailing-club-party',
    name: 'Sailing Club Beach Party',
    nameKo: '세일링클럽 비치파티',
    category: 'party',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    description: '해변가 주말 파티',
    price: '입장료 별도',
    duration: '저녁~새벽',
  },
  {
    id: 'skylight-rooftop',
    name: 'Skylight Rooftop',
    nameKo: '스카이라이트 루프탑',
    category: 'party',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
    description: '야경 칵테일바',
    price: '음료값',
    duration: '저녁',
  },
];

export function filterActivities(category?: string): Activity[] {
  let filtered = activities;

  if (category && category !== 'all') {
    filtered = filtered.filter((a) => a.category === category);
  }

  return filtered;
}
