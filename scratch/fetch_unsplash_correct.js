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

async function run() {
  for (const k of keywords) {
    try {
      const url = 'https://unsplash.com/s/photos/' + encodeURIComponent(k);
      const html = await fetch(url).then(r => r.text());
      // Look for full photo URLs, e.g. photo-1234567890-abcdef123456
      const match = html.match(/photo-(\d+)-([a-fA-F0-9]{12})/);
      if (match) {
        console.log(`${k}: "photo-${match[1]}-${match[2]}",`);
      } else {
        // Fallback search in the html
        const matchAny = html.match(/photo-([a-zA-Z0-9\-]+)/g);
        console.log(`${k}: missing (found candidates: ${matchAny ? matchAny.slice(0, 3).join(', ') : 'none'})`);
      }
    } catch (e) {
      console.log(`${k}: error - ${e.message}`);
    }
    // Small delay to avoid hammering
    await new Promise(r => setTimeout(r, 500));
  }
}
run();
