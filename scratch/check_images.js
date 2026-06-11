const STATIC_IMAGES = {
  perfumes: 'photo-1676748933022-e1183e997436',
  fruits: 'photo-1671379041175-782d15092945',
  grocery: 'photo-1664305032567-2c460e29dec1',
  clothing: 'photo-1664202526559-e21e9c0fb46a',
  fashion: 'photo-1664202526559-e21e9c0fb46a',
  gift: 'photo-1676166012743-aee27f3415a7',
  bestsellers: 'photo-1676166012743-aee27f3415a7',
  newadditions: 'photo-1676166012743-aee27f3415a7',
  'adult products': 'photo-1683121105193-837e90f41085',
  automobile: 'photo-1686730540270-93f2c33351b6',
  ayurvedic: 'photo-1675798983878-604c09f6d154',
  babyitems: 'photo-1676049342411-c118fe1570b2',
  bicycle: 'photo-1678718713393-2b88cde9605b',
  bridetobe: 'photo-1675003662150-2569448d2b3b',
  childrensday: 'photo-1676049342411-c118fe1570b2',
  childrens: 'photo-1676049342411-c118fe1570b2',
  christmas: 'photo-1661766896016-16e307246d5d',
  corporate: 'photo-1661772661721-b16346fe5b0f',
  curd: 'photo-1673108852141-e8c3c22a4a22',
  diwali: 'photo-1698500034742-098f7fc04163',
  food: 'photo-1673108852141-e8c3c22a4a22',
  giftcert: 'photo-1676166012743-aee27f3415a7',
  greetingcards: 'photo-1683121105193-837e90f41085',
  halloween: 'photo-1663840243225-3459348a6c1f',
  household: 'photo-1661964014750-963a28aeddea',
  lover: 'photo-1683121105193-837e90f41085',
  momtobe: 'photo-1675103827197-b88ff0586d06',
  newyear_january: 'photo-1663840297088-5b76140d74ba',
  ornaments: 'photo-1661964014750-963a28aeddea',
  party: 'photo-1670333351937-68cb2735a0fd',
  pet: 'photo-1666777247416-ee7a95235559',
  pharmacy: 'photo-1663047392930-7c1c31d7b785',
  pirikara: 'photo-1676166012743-aee27f3415a7',
  promotions: 'photo-1676166012743-aee27f3415a7',
  samedaydelivery: 'photo-1676166012743-aee27f3415a7',
  schoolpride: 'photo-1713296255442-e9338f42aad8',
  services: 'photo-1661772661721-b16346fe5b0f',
  sports: 'photo-1664537975122-9c598d85816e',
  sympathies: 'photo-1683121105193-837e90f41085',
  teachersday: 'photo-1713296255442-e9338f42aad8',
  thaipongle: 'photo-1698500034742-098f7fc04163',
  uniquegifts: 'photo-1676166012743-aee27f3415a7',
  valentine: 'photo-1683121105193-837e90f41085',
  vegetables: 'photo-1675798983878-604c09f6d154',
  womenday: 'photo-1675103827197-b88ff0586d06',
  youandme: 'photo-1683121105193-837e90f41085',
};

async function check() {
  for (const [key, id] of Object.entries(STATIC_IMAGES)) {
    const url = `https://images.unsplash.com/${id}?w=500&h=500&fit=crop`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${key}: ${res.status} (${res.status === 200 ? 'OK' : 'FAIL'})`);
    } catch (e) {
      console.log(`${key}: ERROR - ${e.message}`);
    }
  }
}
check();
