const puppeteer = require('puppeteer');

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set up localStorage with sample itinerary data that includes travel times
  await page.goto('http://localhost:3000/itinerary', { waitUntil: 'networkidle0' });

  // Inject sample itinerary with multiple items to show travel times
  await page.evaluate(() => {
    const sampleItinerary = {
      id: 'sample123',
      title: '나트랑 3박 4일 여행',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      days: [
        {
          id: 'day1',
          date: '2024-03-15',
          dayNumber: 1,
          items: [
            {
              id: 'item1',
              itemId: 'sheraton',
              category: 'accommodation',
              name: 'Sheraton Nha Trang',
              nameKo: '쉐라톤 나트랑',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
              time: '09:00',
              duration: '체크인',
            },
            {
              id: 'item2',
              itemId: 'lanterns',
              category: 'restaurant',
              name: 'Lanterns Restaurant',
              nameKo: '랜턴스',
              image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
              time: '12:00',
              duration: '1시간',
            },
            {
              id: 'item3',
              itemId: 'ponagar-tower',
              category: 'attraction',
              name: 'Po Nagar Cham Towers',
              nameKo: '포나가르 참 탑',
              image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
              time: '14:00',
              duration: '1-2시간',
            },
            {
              id: 'item4',
              itemId: 'dam-market',
              category: 'shopping',
              name: 'Dam Market',
              nameKo: '담 시장',
              image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
              time: '16:30',
              duration: '2시간',
            },
          ],
        },
        {
          id: 'day2',
          date: '2024-03-16',
          dayNumber: 2,
          items: [],
        },
        {
          id: 'day3',
          date: '2024-03-17',
          dayNumber: 3,
          items: [],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('nhatrang-itinerary', JSON.stringify(sampleItinerary));
  });

  // Reload to show the itinerary with travel times
  await page.reload({ waitUntil: 'networkidle0' });

  // Desktop viewport
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'screenshot-itinerary-travel-desktop.png', fullPage: true });
  console.log('Screenshot saved: screenshot-itinerary-travel-desktop.png');

  // Mobile viewport
  await page.setViewport({ width: 375, height: 812 });
  await page.screenshot({ path: 'screenshot-itinerary-travel-mobile.png', fullPage: true });
  console.log('Screenshot saved: screenshot-itinerary-travel-mobile.png');

  await browser.close();
  console.log('Screenshots completed!');
}

takeScreenshot().catch(console.error);
