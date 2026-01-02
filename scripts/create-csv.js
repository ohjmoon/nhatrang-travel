const fs = require('fs');

// UTF-8 BOM
const BOM = '\uFEFF';

// CSV 내용 생성
const headers = '카테고리,ID,한글명,영문명,검색어,현재이미지URL,수집완료';

const items = [
  // 맛집 - 한식 (16)
  ['맛집-한식','gohyang-bapsang','고향밥상','Gohyang Bapsang','나트랑 고향밥상','https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800',''],
  ['맛집-한식','seoul-sikdang','서울식당','Seoul Restaurant','나트랑 서울식당','https://images.unsplash.com/photo-1544025162-d76694265947?w=800',''],
  ['맛집-한식','busan-hoetjip','부산횟집','Busan Raw Fish','나트랑 부산횟집','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',''],
  ['맛집-한식','myeongdong-kalguksu','명동칼국수','Myeongdong Kalguksu','나트랑 명동칼국수','https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',''],
  ['맛집-한식','jeonju-bibimbap','전주비빔밥','Jeonju Bibimbap','나트랑 전주비빔밥','https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800',''],
  ['맛집-한식','hansik-maeul','한식마을','Korean Village','나트랑 한식마을','https://images.unsplash.com/photo-1583224994076-1809be8c39e3?w=800',''],
  ['맛집-한식','halmae-sundaeguk','할매순대국','Grandma Sundae Soup','나트랑 할매순대국','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',''],
  ['맛집-한식','sinchon-tteokbokki','신촌떡볶이','Sinchon Tteokbokki','나트랑 신촌떡볶이','https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800',''],
  ['맛집-한식','daegu-makchang','대구막창','Daegu Makchang','나트랑 대구막창','https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',''],
  ['맛집-한식','gyeongju-hanjeonsik','경주한정식','Gyeongju Hanjeonsik','나트랑 경주한정식','https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800',''],
  ['맛집-한식','incheon-jjajangmyeon','인천짜장면','Incheon Jjajangmyeon','나트랑 인천짜장면','https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800',''],
  ['맛집-한식','gangnam-chicken','강남치킨','Gangnam Chicken','나트랑 강남치킨','https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',''],
  ['맛집-한식','sokcho-agujjim','속초아구찜','Sokcho Agujjim','나트랑 속초아구찜','https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',''],
  ['맛집-한식','gwangju-yukjeon','광주육전','Gwangju Yukjeon','나트랑 광주육전','https://images.unsplash.com/photo-1580985488777-b4ece09fffa2?w=800',''],
  ['맛집-한식','jeju-heukdwaeji','제주흑돼지','Jeju Black Pork','나트랑 제주흑돼지','https://images.unsplash.com/photo-1558030006-450675393462?w=800',''],
  ['맛집-한식','gopchang-story','곱창스토리','Gopchang Story','나트랑 곱창스토리','https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',''],

  // 맛집 - 베트남 (11)
  ['맛집-베트남','pho-hong','퍼홍','Phở Hồng','Nha Trang Pho Hong','https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',''],
  ['맛집-베트남','banh-mi-vu','반미 부','Bánh Mì Vũ','Nha Trang Banh Mi Vu','https://images.unsplash.com/photo-1600688640154-9619e002df30?w=800',''],
  ['맛집-베트남','bun-cha-hanoi','분짜 하노이','Bún Chả Hà Nội','Nha Trang Bun Cha Hanoi','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',''],
  ['맛집-베트남','com-tam-saigon','껌땀 사이공','Cơm Tấm Sài Gòn','Nha Trang Com Tam Saigon','https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',''],
  ['맛집-베트남','nem-nuong-ninh-hoa','넴느엉 닌호아','Nem Nướng Ninh Hòa','Nha Trang Nem Nuong Ninh Hoa','https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',''],
  ['맛집-베트남','bun-ca','분까','Bún Cá','Nha Trang Bun Ca','https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',''],
  ['맛집-베트남','banh-xeo-ba-duong','반쎄오 바즈엉','Bánh Xèo Bà Dưỡng','Nha Trang Banh Xeo Ba Duong','https://images.unsplash.com/photo-1590846083693-f23fdede3a7e?w=800',''],
  ['맛집-베트남','bun-bo-hue','분보 후에','Bún Bò Huế','Nha Trang Bun Bo Hue','https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800',''],
  ['맛집-베트남','goi-cuon','고이꾸온','Gỏi Cuốn','Nha Trang Goi Cuon','https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=800',''],
  ['맛집-베트남','quan-an-ngon','꽌안응온','Quán Ăn Ngon','Nha Trang Quan An Ngon','https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',''],
  ['맛집-베트남','mi-quang','미꽝','Mì Quảng','Nha Trang Mi Quang','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800',''],

  // 맛집 - 해산물 (8)
  ['맛집-해산물','langoustine-house','랑구스틴 하우스','Langoustine House','Nha Trang Langoustine House','https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',''],
  ['맛집-해산물','costa-seafood','코스타 씨푸드','Costa Seafood','Nha Trang Costa Seafood','https://images.unsplash.com/photo-1565680018093-ebb6b9e3c8f2?w=800',''],
  ['맛집-해산물','nha-trang-seafood','나트랑 씨푸드','Nha Trang Seafood','Nha Trang Seafood Restaurant','https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',''],
  ['맛집-해산물','mango-room-seafood','망고룸 씨푸드','Mango Room Seafood','Nha Trang Mango Room Seafood','https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',''],
  ['맛집-해산물','yen-restaurant','옌 레스토랑','Yen Restaurant','Nha Trang Yen Restaurant','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800',''],
  ['맛집-해산물','lac-canh-restaurant','락까잉 레스토랑','Lac Canh Restaurant','Nha Trang Lac Canh','https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',''],
  ['맛집-해산물','oc-gio-dat-phuong-nam','옥지오 닷프엉남','Ốc Gió Đất Phương Nam','Nha Trang Oc Gio','https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',''],
  ['맛집-해산물','hai-san-hoa-bien','하이산 호아비엔','Hải Sản Hoa Biển','Nha Trang Hai San Hoa Bien','https://images.unsplash.com/photo-1565680018093-ebb6b9e3c8f2?w=800',''],

  // 맛집 - 카페 (12)
  ['맛집-카페','rainforest-cafe','레인포레스트 카페','Rainforest Cafe','Nha Trang Rainforest Cafe','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',''],
  ['맛집-카페','skylight-coffee','스카이라이트 커피','Skylight Coffee','Nha Trang Skylight Coffee','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',''],
  ['맛집-카페','the-song-cafe','더 송 카페','The Song Cafe','Nha Trang The Song Cafe','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',''],
  ['맛집-카페','rooftop-cafe','루프탑 카페','Rooftop Cafe','Nha Trang Rooftop Cafe','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',''],
  ['맛집-카페','highlands-coffee','하이랜드 커피','Highlands Coffee','Nha Trang Highlands Coffee','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',''],
  ['맛집-카페','the-coffee-house','더 커피하우스','The Coffee House','Nha Trang Coffee House','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800',''],
  ['맛집-카페','cong-caphe','콩카페','Cộng Cà Phê','Nha Trang Cong Caphe','https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',''],
  ['맛집-카페','me-trang-coffee','미짱 커피','Me Trang Coffee','Nha Trang Me Trang Coffee','https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',''],
  ['맛집-카페','summer-coffee','썸머 커피','Summer Coffee','Nha Trang Summer Coffee','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',''],
  ['맛집-카페','an-cafe','안 카페','An Cafe','Nha Trang An Cafe','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',''],
  ['맛집-카페','phuc-long-coffee','푹롱 커피','Phuc Long Coffee','Nha Trang Phuc Long','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',''],
  ['맛집-카페','oia-coffee','오이아 커피','Oia Coffee','Nha Trang Oia Coffee','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',''],

  // 맛집 - 바 (7)
  ['맛집-바','sailing-club','세일링 클럽','Sailing Club','Nha Trang Sailing Club','https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',''],
  ['맛집-바','havana-club','하바나 클럽','Havana Club','Nha Trang Havana Club','https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',''],
  ['맛집-바','skylight-rooftop','스카이라이트 루프탑','Skylight Rooftop','Nha Trang Skylight Rooftop Bar','https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',''],
  ['맛집-바','louisiane-brewhouse','루이지애나 브루하우스','Louisiane Brewhouse','Nha Trang Louisiane Brewhouse','https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',''],
  ['맛집-바','altitude','알티튜드','Altitude Bar','Nha Trang Altitude Bar','https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',''],
  ['맛집-바','why-not-bar','와이낫 바','Why Not Bar','Nha Trang Why Not Bar','https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800',''],
  ['맛집-바','beach-club','비치 클럽','Beach Club','Nha Trang Beach Club','https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',''],

  // 맛집 - 양식 (6)
  ['맛집-양식','olive-kitchen','올리브 키친','Olive Kitchen','Nha Trang Olive Kitchen','https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',''],
  ['맛집-양식','la-mancha','라만차','La Mancha','Nha Trang La Mancha','https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',''],
  ['맛집-양식','au-lac','오락','Au Lac Restaurant','Nha Trang Au Lac','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800',''],
  ['맛집-양식','omar-khayam','오마르 카얌','Omar Khayam','Nha Trang Omar Khayam','https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',''],
  ['맛집-양식','guava','구아바','Guava Restaurant','Nha Trang Guava Restaurant','https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',''],
  ['맛집-양식','da-fernando','다 페르난도','Da Fernando','Nha Trang Da Fernando','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',''],

  // 맛집 - 일식 (5)
  ['맛집-일식','sushi-corner','스시 코너','Sushi Corner','Nha Trang Sushi Corner','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',''],
  ['맛집-일식','izakaya-nha-trang','이자카야 나트랑','Izakaya Nha Trang','Nha Trang Izakaya','https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',''],
  ['맛집-일식','japanese-garden','재패니즈 가든','Japanese Garden','Nha Trang Japanese Garden','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',''],
  ['맛집-일식','ramen-house','라멘 하우스','Ramen House','Nha Trang Ramen House','https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800',''],
  ['맛집-일식','tokyo-deli','도쿄 델리','Tokyo Deli','Nha Trang Tokyo Deli','https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',''],

  // 맛집 - 기타 (4)
  ['맛집-기타','kkokkomom','꼬꼬맘','Kkokkomom','Nha Trang Kkokkomom','https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',''],
  ['맛집-기타','jollibee','졸리비','Jollibee','Nha Trang Jollibee','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',''],
  ['맛집-기타','kfc-nha-trang','KFC 나트랑','KFC Nha Trang','Nha Trang KFC','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',''],
  ['맛집-기타','lotteria','롯데리아','Lotteria','Nha Trang Lotteria','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',''],

  // 볼거리 - 섬/해변 (7)
  ['볼거리-섬해변','hon-tam','혼땀섬','Hon Tam Island','Nha Trang Hon Tam Island','https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800',''],
  ['볼거리-섬해변','hon-mun','혼문섬','Hon Mun Island','Nha Trang Hon Mun Island','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',''],
  ['볼거리-섬해변','hon-mieu','혼미우섬','Hon Mieu Island','Nha Trang Hon Mieu Mini Beach','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',''],
  ['볼거리-섬해변','orchid-island','오키드 아일랜드','Orchid Island','Nha Trang Orchid Island','https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',''],
  ['볼거리-섬해변','bai-dai-beach','바이다이 비치','Bai Dai Beach','Nha Trang Bai Dai Beach','https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800',''],
  ['볼거리-섬해변','jungle-beach','정글비치','Jungle Beach','Nha Trang Jungle Beach','https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',''],
  ['볼거리-섬해변','dam-bay','담베이','Dam Bay','Nha Trang Dam Bay','https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800',''],

  // 볼거리 - 자연/폭포 (4)
  ['볼거리-자연폭포','ba-ho-falls','바호 폭포','Ba Ho Falls','Nha Trang Ba Ho Falls','https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',''],
  ['볼거리-자연폭포','yang-bay','양베이 폭포공원','Yang Bay Waterfall','Nha Trang Yang Bay Waterfall','https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800',''],
  ['볼거리-자연폭포','hon-chong','혼총곶','Hon Chong Promontory','Nha Trang Hon Chong','https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800',''],
  ['볼거리-자연폭포','suoi-thach-lam','수오이탁람','Suoi Thach Lam','Nha Trang Suoi Thach Lam','https://images.unsplash.com/photo-1552083375-1447ce886485?w=800',''],

  // 볼거리 - 문화/역사 (11)
  ['볼거리-문화역사','nha-trang-cathedral','나짱대성당','Nha Trang Cathedral','Nha Trang Cathedral','https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',''],
  ['볼거리-문화역사','long-son-pagoda','롱선사','Long Son Pagoda','Nha Trang Long Son Pagoda','https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',''],
  ['볼거리-문화역사','po-nagar','포나가르 사원','Po Nagar Cham Towers','Nha Trang Po Nagar','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',''],
  ['볼거리-문화역사','po-rome-tower','포롱자라이 사원','Po Rome Tower','Nha Trang Po Rome Tower','https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800',''],
  ['볼거리-문화역사','dam-market','담 시장','Dam Market','Nha Trang Dam Market','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',''],
  ['볼거리-문화역사','night-market','나트랑 야시장','Nha Trang Night Market','Nha Trang Night Market','https://images.unsplash.com/photo-1519227355453-8f982e425321?w=800',''],
  ['볼거리-문화역사','oceanographic-museum','국립해양박물관','Oceanographic Museum','Nha Trang Oceanographic Museum','https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',''],
  ['볼거리-문화역사','tri-nguyen-aquarium','트리응우옌 수족관','Tri Nguyen Aquarium','Nha Trang Tri Nguyen Aquarium','https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',''],
  ['볼거리-문화역사','yersin-museum','알렉산더 예르센 박물관','Yersin Museum','Nha Trang Yersin Museum','https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800',''],
  ['볼거리-문화역사','tram-huong-tower','찜향탑','Tram Huong Tower','Nha Trang Tram Huong Tower','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',''],
  ['볼거리-문화역사','do-theatre','도극장','Do Theatre','Nha Trang Do Theatre','https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',''],

  // 볼거리 - 테마파크 (6)
  ['볼거리-테마파크','vinwonders','빈원더스','VinWonders','Nha Trang VinWonders','https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800',''],
  ['볼거리-테마파크','vinpearl-waterpark','빈펄 워터파크','Vinpearl Water Park','Nha Trang Vinpearl Waterpark','https://images.unsplash.com/photo-1565377005067-5a44e93a4d79?w=800',''],
  ['볼거리-테마파크','vinpearl-safari','빈펄 사파리','Vinpearl Safari','Nha Trang Vinpearl Safari','https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800',''],
  ['볼거리-테마파크','vinpearl-aquarium','빈펄 아쿠아리움','Vinpearl Aquarium','Nha Trang Vinpearl Aquarium','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',''],
  ['볼거리-테마파크','vinpearl-harbour','빈펄 하버','Vinpearl Harbour','Nha Trang Vinpearl Harbour','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',''],
  ['볼거리-테마파크','vinpearl-golf','빈펄 골프','Vinpearl Golf','Nha Trang Vinpearl Golf','https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',''],

  // 액티비티 - 수상 (8)
  ['액티비티-수상','island-hopping','호핑투어','Island Hopping Tour','Nha Trang Hopping Tour','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',''],
  ['액티비티-수상','snorkeling','스노클링','Snorkeling','Nha Trang Snorkeling','https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',''],
  ['액티비티-수상','scuba-diving','체험 다이빙','Scuba Diving','Nha Trang Scuba Diving','https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800',''],
  ['액티비티-수상','sea-walking','씨워킹','Sea Walking','Nha Trang Sea Walking','https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',''],
  ['액티비티-수상','parasailing','패러세일링','Parasailing','Nha Trang Parasailing','https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800',''],
  ['액티비티-수상','jet-ski','제트스키','Jet Ski','Nha Trang Jet Ski','https://images.unsplash.com/photo-1626607556444-f0c39a3bab09?w=800',''],
  ['액티비티-수상','banana-boat','바나나보트','Banana Boat','Nha Trang Banana Boat','https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800',''],
  ['액티비티-수상','emperor-cruise','황제 크루즈','Emperor Cruise','Nha Trang Emperor Cruise','https://images.unsplash.com/photo-1544551763-8dd44758c2dd?w=800',''],

  // 액티비티 - 스파 (4)
  ['액티비티-스파','i-resort-mud','아이리조트 머드스파','I-Resort Mud Spa','Nha Trang I-Resort Mud Spa','https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',''],
  ['액티비티-스파','galina-mud','갈리나 머드스파','Galina Mud Spa','Nha Trang Galina Mud Spa','https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',''],
  ['액티비티-스파','hon-tam-mud','혼땀섬 머드온천','Hon Tam Mud Spa','Nha Trang Hon Tam Mud Spa','https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800',''],
  ['액티비티-스파','amiana-spa','아미아나 스파','Amiana Resort Spa','Nha Trang Amiana Resort Spa','https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800',''],

  // 액티비티 - 투어 (5)
  ['액티비티-투어','dalat-tour','달랏 데이투어','Da Lat Day Tour','Nha Trang Da Lat Day Tour','https://images.unsplash.com/photo-1600359756098-8bc52195bbf4?w=800',''],
  ['액티비티-투어','phan-rang-desert','판랑 사막투어','Phan Rang Desert','Nha Trang Phan Rang Desert','https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',''],
  ['액티비티-투어','mui-ne-tour','무이네 투어','Mui Ne Tour','Nha Trang Mui Ne Tour','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',''],
  ['액티비티-투어','yang-bay-tour','양베이 폭포투어','Yang Bay Tour','Nha Trang Yang Bay Tour','https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800',''],
  ['액티비티-투어','ba-ho-trekking','바호 폭포 트레킹','Ba Ho Falls Trekking','Nha Trang Ba Ho Trekking','https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',''],

  // 액티비티 - 파티 (4)
  ['액티비티-파티','pirate-hopping','해적 호핑투어','Pirate Hopping Tour','Nha Trang Pirate Hopping Tour','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',''],
  ['액티비티-파티','yolo-hopping','YOLO 호핑투어','YOLO Hopping Tour','Nha Trang YOLO Hopping Tour','https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800',''],
  ['액티비티-파티','sailing-club-party','세일링클럽 비치파티','Sailing Club Beach Party','Nha Trang Sailing Club Party','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',''],
  ['액티비티-파티','skylight-rooftop','스카이라이트 루프탑','Skylight Rooftop','Nha Trang Skylight Rooftop','https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',''],

  // 쇼핑 - 대형마트 (3)
  ['쇼핑-대형마트','lotte-mart-gold-coast','롯데마트 골드코스트점','Lotte Mart Gold Coast','Nha Trang Lotte Mart Gold Coast','https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',''],
  ['쇼핑-대형마트','lotte-mart-nha-trang','롯데마트 냐짱점','Lotte Mart Nha Trang','Nha Trang Lotte Mart','https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800',''],
  ['쇼핑-대형마트','go-nha-trang','GO! 나트랑','GO! Nha Trang','Nha Trang GO Big C','https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800',''],

  // 쇼핑 - 쇼핑몰 (4)
  ['쇼핑-쇼핑몰','vincom-plaza-tran-phu','빈컴 플라자 쩐푸','Vincom Plaza Tran Phu','Nha Trang Vincom Plaza Tran Phu','https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800',''],
  ['쇼핑-쇼핑몰','vincom-plaza-le-thanh-ton','빈컴 플라자 레탄똔','Vincom Plaza Le Thanh Ton','Nha Trang Vincom Plaza Le Thanh Ton','https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800',''],
  ['쇼핑-쇼핑몰','gold-coast-mall','골드코스트몰','Gold Coast Mall','Nha Trang Gold Coast Mall','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',''],
  ['쇼핑-쇼핑몰','nha-trang-center','나트랑 센터','Nha Trang Center','Nha Trang Center Mall','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',''],

  // 쇼핑 - 전통시장 (2)
  ['쇼핑-전통시장','dam-market-shopping','담 시장','Dam Market','Nha Trang Dam Market Shopping','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',''],
  ['쇼핑-전통시장','xom-moi-market','쫌모이 시장','Xom Moi Market','Nha Trang Xom Moi Market','https://images.unsplash.com/photo-1519227355453-8f982e425321?w=800',''],

  // 쇼핑 - 야시장 (1)
  ['쇼핑-야시장','nha-trang-night-market','나트랑 야시장','Nha Trang Night Market','Nha Trang Night Market Shopping','https://images.unsplash.com/photo-1519227355453-8f982e425321?w=800',''],
];

const csvContent = BOM + headers + '\n' + items.map(row => row.join(',')).join('\n');

fs.writeFileSync('image-collection-list.csv', csvContent, 'utf8');
console.log('CSV file created with UTF-8 BOM');
console.log('Total items:', items.length);
