const keywords = ['perfume', 'fruits', 'grocery', 'clothing', 'fashion', 'gift', 'car', 'baby', 'bicycle', 'bride', 'christmas', 'corporate', 'diwali', 'food', 'halloween', 'household', 'love', 'new year', 'party', 'pet', 'pharmacy', 'sports', 'vegetables', 'wedding', 'graduation', 'mother', 'father', 'anniversary'];
async function run() {
  for (const k of keywords) {
    try {
      const html = await fetch('https://unsplash.com/s/photos/' + encodeURIComponent(k)).then(r => r.text());
      const match = html.match(/photo-([a-zA-Z0-9\-]+)/);
      if (match) console.log(k + ': "photo-' + match[1] + '"');
      else console.log(k + ': missing');
    } catch (e) {
      console.log(k + ': error');
    }
  }
}
run();
