const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

/**
 * Demo representative images (remote, sized on demand by `resolveImageUri`).
 * Each destination VISIT in the demo data references at most one of these, so
 * the demo shows the "one image per visit" rule: the three Milan visits use
 * three different images, and some visits intentionally have none.
 */
export const DEMO_IMAGES = {
  paris1: unsplash('photo-1502602898657-3e91760cbb34'),
  paris2: unsplash('photo-1499856871958-5b9627545d1a'),
  paris3: unsplash('photo-1431274172761-fca41d930114'),
  bangkok1: unsplash('photo-1508009603885-50cf7c579365'),
  bangkok2: unsplash('photo-1563492065599-3520f775eeed'),
  samui: unsplash('photo-1552465011-b4e21bf6e79a'),
  pattaya: unsplash('photo-1528181304800-259b08848526'),
  phuket: unsplash('photo-1589394815804-964ed0be2eb5'),
  chiangmai: unsplash('photo-1512553353614-82a7370096dc'),
  milan1: unsplash('photo-1520440229-6469a149ac59'),
  milan2: unsplash('photo-1513581166391-887a96ddeafd'),
  milan3: unsplash('photo-1610016302534-6f67f1c968d8'),
  rome: unsplash('photo-1552832230-c0197dd311b5'),
  florence: unsplash('photo-1541370976299-4d24ebbc9077'),
  venice: unsplash('photo-1514890547357-a9ee288728e0'),
  barcelona: unsplash('photo-1583422409516-2895a77efded'),
  madrid: unsplash('photo-1539037116277-4db20889f2d4'),
  seville: unsplash('photo-1559564484-e48b3e040ff4'),
  tokyo1: unsplash('photo-1540959733332-eab4deabeeaf'),
  tokyo2: unsplash('photo-1503899036084-c55cdd92da26'),
  kyoto: unsplash('photo-1493976040374-85c8e12f0c0e'),
  osaka: unsplash('photo-1590559899731-a382839e5549'),
  seoul: unsplash('photo-1538485399081-7191377e8241'),
  busan: unsplash('photo-1578637387939-43c525550085'),
  nice: unsplash('photo-1491166617655-0723a0999cfc'),
  lyon: unsplash('photo-1524397057410-1e775ed476f3'),
  london: unsplash('photo-1513635269975-59663e0ac1ad'),
  amsterdam: unsplash('photo-1534351590666-13e3e96b5017'),
  berlin: unsplash('photo-1560969184-10fe8719e047'),
  munich: unsplash('photo-1595867818082-083862f3d630'),
  lisbon: unsplash('photo-1548707309-dcebeab9ea9b'),
  porto: unsplash('photo-1555881400-74d7acaacd8b'),
  athens: unsplash('photo-1555993539-1732b0258235'),
  santorini: unsplash('photo-1570077188670-e3a8d69ac5ff'),
  newyork: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  losangeles: unsplash('photo-1534190760961-74e8c1c5c3da'),
  dubai: unsplash('photo-1512453979798-5ea266f8880c'),
  singapore: unsplash('photo-1525625293386-3f8f99389edd'),
  istanbul: unsplash('photo-1524231757912-21f4fe3a7200'),
  stockholm: unsplash('photo-1509356843151-3e7d96241e11'),
  copenhagen: unsplash('photo-1513622470522-26c3c8a854bc'),
  malmo: unsplash('photo-1578894381163-e72c17f2d45f'),
  sydney: unsplash('photo-1506973035872-a4ec16b8e8d9'),
  oslo: unsplash('photo-1601628828688-632f38a5a7d0'),
  hero: unsplash('photo-1464822759023-fed622ff2c3b'),
} as const;

export type DemoImageKey = keyof typeof DEMO_IMAGES;

export const DEMO_AVATARS: Record<string, string> = {
  u_marcus: 'https://i.pravatar.cc/200?img=12',
  u_anna: 'https://i.pravatar.cc/200?img=47',
  u_kenji: 'https://i.pravatar.cc/200?img=33',
  u_sofia: 'https://i.pravatar.cc/200?img=45',
  u_mina: 'https://i.pravatar.cc/200?img=44',
  u_lukas: 'https://i.pravatar.cc/200?img=15',
  u_elin: 'https://i.pravatar.cc/200?img=49',
};
