async function getRealId(keyword) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(keyword)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`${keyword}: HTTP error ${res.status}`);
      return null;
    }
    const html = await res.text();
    // Search for URLs like https://images.unsplash.com/photo-12345678-abcdef123456
    // or just the photo-12345678-abcdef123456 pattern inside src attributes
    const regex = /https:\/\/images\.unsplash\.com\/(photo-\d+-[a-f0-9]{12})/gi;
    let match;
    const matches = new Set();
    while ((match = regex.exec(html)) !== null) {
      matches.add(match[1]);
    }
    
    if (matches.size > 0) {
      const array = Array.from(matches);
      // Let's test if the first one returns 200
      for (const id of array) {
        const testUrl = `https://images.unsplash.com/${id}?w=200&h=200&fit=crop`;
        const testRes = await fetch(testUrl, { method: 'HEAD' });
        if (testRes.status === 200) {
          console.log(`  ${keyword}: "${id}",`);
          return id;
        }
      }
    }
    console.log(`  ${keyword}: no valid images found (found matches: ${Array.from(matches).join(', ') || 'none'})`);
    return null;
  } catch (e) {
    console.log(`  ${keyword}: error - ${e.message}`);
    return null;
  }
}

async function run() {
  const keywords = [
    'perfume', 'fruits', 'grocery', 'clothing', 'fashion',
    'adult products', 'car', 'ayurveda', 'baby care', 'bicycle',
    'bride', 'children', 'christmas', 'office', 'curd',
    'diwali', 'food', 'voucher', 'greeting card', 'halloween',
    'household', 'love', 'new year', 'ornament', 'party',
    'pet', 'pharmacy', 'promotion', 'delivery truck', 'school',
    'service', 'sports', 'sympathy', 'teacher', 'pongal',
    'gift box', 'valentine', 'vegetable', 'women', 'romantic couple',
    'combo pack', 'soft toy', 'best seller', 'new arrival', 'birthday',
    'anniversary', 'wedding'
  ];

  console.log('Starting extraction of valid Unsplash IDs:');
  for (const kw of keywords) {
    await getRealId(kw);
    await new Promise(r => setTimeout(r, 800));
  }
  console.log('Finished extraction.');
}

run();
