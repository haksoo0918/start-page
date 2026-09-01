export interface BookmarkLink {
  id: string;
  title: string;
  url: string;
  category: string;
  customIcon?: string;
}

export const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'daily', name: '자주 가는 곳' },
  { id: 'work', name: '업무/생산성' },
  { id: 'dev', name: '개발' },
  { id: 'media', name: '미디어/커뮤니티' },
  { id: 'shopping', name: '쇼핑/금융' }
];

export const PRESET_LINKS: BookmarkLink[] = [
  { id: '1', title: 'YouTube', url: 'https://www.youtube.com', category: 'media' },
  { id: '2', title: 'GitHub', url: 'https://github.com', category: 'dev' },
  { id: '3', title: 'ChatGPT', url: 'https://chatgpt.com', category: 'work' },
  { id: '4', title: 'Naver', url: 'https://www.naver.com', category: 'daily' },
  { id: '5', title: 'Google', url: 'https://www.google.com', category: 'daily' },
  { id: '6', title: 'Claude', url: 'https://claude.ai', category: 'work' },
  { id: '7', title: 'Notion', url: 'https://www.notion.so', category: 'work' },
  { id: '8', title: 'Gmail', url: 'https://mail.google.com', category: 'work' },
  { id: '9', title: 'Reddit', url: 'https://www.reddit.com', category: 'media' },
  { id: '10', title: '쿠팡', url: 'https://www.coupang.com', category: 'shopping' },
  { id: '11', title: '토스', url: 'https://toss.im', category: 'shopping' },
  { id: '12', title: 'Velog', url: 'https://velog.io', category: 'dev' },
  { id: '13', title: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'dev' },
  { id: '14', title: '네이버 웹툰', url: 'https://comic.naver.com', category: 'media' },
  { id: '15', title: '당근마켓', url: 'https://www.daangn.com', category: 'shopping' },
  { id: '16', title: '네이버 지도', url: 'https://map.naver.com', category: 'daily' }
];
