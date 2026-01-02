/**
 * Migration Script: TypeScript Data → Supabase
 *
 * 사용법:
 * 1. .env.local에 Supabase 설정이 되어있어야 합니다
 * 2. npx ts-node scripts/migrate-to-supabase.ts
 *
 * 또는 빌드 후 실행:
 * npx tsc scripts/migrate-to-supabase.ts --outDir scripts/dist --esModuleInterop
 * node scripts/dist/migrate-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('   .env.local 파일에 다음 값들이 있는지 확인하세요:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Import existing data
import { restaurants } from '../src/data/restaurants';
import { attractions } from '../src/data/attractions';
import { activities } from '../src/data/activities';
import { shoppingPlaces } from '../src/data/shopping';

interface PlaceData {
  type: string;
  category: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string | null;
  address: string | null;
  location: string | null;
  hours: string | null;
  price: string | null;
  price_min: number | null;
  price_max: number | null;
  duration: string | null;
  tips: string | null;
  features: string[] | null;
  recommended_items: string[] | null;
  thumbnail: string | null;
  is_published: boolean;
  sort_order: number;
}

async function migrateRestaurants() {
  console.log('\n🍽️  맛집 데이터 마이그레이션 중...');

  const places: PlaceData[] = restaurants.map((r, idx) => ({
    type: 'restaurant',
    category: r.category,
    slug: r.id,
    name: r.name,
    name_ko: r.nameKo,
    description: r.description || null,
    address: r.address || null,
    location: null,
    hours: r.hours || null,
    price: r.priceRange || null,
    price_min: r.priceValue?.min || null,
    price_max: r.priceValue?.max || null,
    duration: null,
    tips: r.tips || null,
    features: r.features || null,
    recommended_items: r.recommendedMenu || null,
    thumbnail: r.image || null,
    is_published: true,
    sort_order: idx,
  }));

  const { data, error } = await supabase.from('places').insert(places).select();

  if (error) {
    console.error('❌ 맛집 마이그레이션 실패:', error.message);
    return [];
  }

  console.log(`✅ 맛집 ${data.length}개 마이그레이션 완료`);
  return data;
}

async function migrateAttractions() {
  console.log('\n🏝️  볼거리 데이터 마이그레이션 중...');

  const places: PlaceData[] = attractions.map((a, idx) => ({
    type: 'attraction',
    category: a.category,
    slug: `attraction-${a.id}`,
    name: a.name,
    name_ko: a.nameKo,
    description: a.description || null,
    address: null,
    location: a.location || null,
    hours: a.hours || null,
    price: a.price || null,
    price_min: null,
    price_max: null,
    duration: a.duration || null,
    tips: a.tips || null,
    features: null,
    recommended_items: null,
    thumbnail: a.image || null,
    is_published: true,
    sort_order: idx,
  }));

  const { data, error } = await supabase.from('places').insert(places).select();

  if (error) {
    console.error('❌ 볼거리 마이그레이션 실패:', error.message);
    return [];
  }

  console.log(`✅ 볼거리 ${data.length}개 마이그레이션 완료`);
  return data;
}

async function migrateActivities() {
  console.log('\n🎯  액티비티 데이터 마이그레이션 중...');

  const places: PlaceData[] = activities.map((a, idx) => ({
    type: 'activity',
    category: a.category,
    slug: `activity-${a.id}`,
    name: a.name,
    name_ko: a.nameKo,
    description: a.description || null,
    address: null,
    location: null,
    hours: null,
    price: a.price || null,
    price_min: a.priceValue?.min || null,
    price_max: a.priceValue?.max || null,
    duration: a.duration || null,
    tips: a.tips || null,
    features: null,
    recommended_items: null,
    thumbnail: a.image || null,
    is_published: true,
    sort_order: idx,
  }));

  const { data, error } = await supabase.from('places').insert(places).select();

  if (error) {
    console.error('❌ 액티비티 마이그레이션 실패:', error.message);
    return [];
  }

  console.log(`✅ 액티비티 ${data.length}개 마이그레이션 완료`);
  return data;
}

async function migrateShopping() {
  console.log('\n🛒  쇼핑 데이터 마이그레이션 중...');

  const places: PlaceData[] = shoppingPlaces.map((s, idx) => ({
    type: 'shopping',
    category: s.category,
    slug: `shopping-${s.id}`,
    name: s.name,
    name_ko: s.nameKo,
    description: s.description || null,
    address: s.address || null,
    location: null,
    hours: s.hours || null,
    price: null,
    price_min: null,
    price_max: null,
    duration: null,
    tips: s.tips || null,
    features: s.features || null,
    recommended_items: s.recommendedItems || null,
    thumbnail: s.image || null,
    is_published: true,
    sort_order: idx,
  }));

  const { data, error } = await supabase.from('places').insert(places).select();

  if (error) {
    console.error('❌ 쇼핑 마이그레이션 실패:', error.message);
    return [];
  }

  console.log(`✅ 쇼핑 ${data.length}개 마이그레이션 완료`);
  return data;
}

async function createPlaceImages(places: any[]) {
  console.log('\n🖼️  이미지 데이터 생성 중...');

  const images = places
    .filter((p) => p.thumbnail)
    .map((p) => ({
      place_id: p.id,
      url: p.thumbnail,
      alt: p.name_ko,
      sort_order: 0,
      is_thumbnail: true,
    }));

  if (images.length === 0) {
    console.log('⚠️  이미지가 없습니다');
    return;
  }

  const { error } = await supabase.from('place_images').insert(images);

  if (error) {
    console.error('❌ 이미지 마이그레이션 실패:', error.message);
    return;
  }

  console.log(`✅ 이미지 ${images.length}개 생성 완료`);
}

async function main() {
  console.log('🚀 나트랑 여행 플래너 데이터 마이그레이션 시작\n');
  console.log('=' .repeat(50));

  try {
    // Check connection
    const { data, error } = await supabase.from('places').select('count');
    if (error) {
      throw new Error(`Supabase 연결 실패: ${error.message}`);
    }

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  기존 데이터 삭제 중...');
    await supabase.from('place_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('places').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ 기존 데이터 삭제 완료');

    // Migrate each type
    const allPlaces: any[] = [];

    const restaurantPlaces = await migrateRestaurants();
    allPlaces.push(...restaurantPlaces);

    const attractionPlaces = await migrateAttractions();
    allPlaces.push(...attractionPlaces);

    const activityPlaces = await migrateActivities();
    allPlaces.push(...activityPlaces);

    const shoppingPlacesData = await migrateShopping();
    allPlaces.push(...shoppingPlacesData);

    // Create images
    await createPlaceImages(allPlaces);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 마이그레이션 완료!\n');
    console.log('📊 총 마이그레이션 수:');
    console.log(`   - 맛집: ${restaurantPlaces.length}개`);
    console.log(`   - 볼거리: ${attractionPlaces.length}개`);
    console.log(`   - 액티비티: ${activityPlaces.length}개`);
    console.log(`   - 쇼핑: ${shoppingPlacesData.length}개`);
    console.log(`   - 총계: ${allPlaces.length}개\n`);

  } catch (err) {
    console.error('\n❌ 마이그레이션 실패:', err);
    process.exit(1);
  }
}

main();
