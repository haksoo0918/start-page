export interface Region {
  id: string;
  name: string;
  fullName: string;
  lat: number;
  lng: number;
}

export const KOREA_REGIONS: Region[] = [
  // 경기도 고양시 (구 단위 세분화)
  { id: 'ilsan-east', name: '고양시 일산동구', fullName: '경기도 고양시 일산동구', lat: 37.6584, lng: 126.7725 },
  { id: 'ilsan-west', name: '고양시 일산서구', fullName: '경기도 고양시 일산서구', lat: 37.6788, lng: 126.7538 },
  { id: 'deokyang', name: '고양시 덕양구', fullName: '경기도 고양시 덕양구', lat: 37.6374, lng: 126.8329 },

  // 서울특별시
  { id: 'gangnam', name: '서울 강남구', fullName: '서울특별시 강남구', lat: 37.5172, lng: 127.0473 },
  { id: 'mapo', name: '서울 마포구', fullName: '서울특별시 마포구', lat: 37.5663, lng: 126.9016 },
  { id: 'jongno', name: '서울 종로구', fullName: '서울특별시 종로구', lat: 37.5730, lng: 126.9794 },
  { id: 'yeouido', name: '서울 영등포구(여의도)', fullName: '서울특별시 영등포구', lat: 37.5264, lng: 126.8962 },
  { id: 'songpa', name: '서울 송파구', fullName: '서울특별시 송파구', lat: 37.5145, lng: 127.1059 },
  { id: 'seocho', name: '서울 서초구', fullName: '서울특별시 서초구', lat: 37.4836, lng: 127.0327 },
  { id: 'yongsan', name: '서울 용산구', fullName: '서울특별시 용산구', lat: 37.5326, lng: 126.9900 },
  { id: 'seongdong', name: '서울 성동구(성수)', fullName: '서울특별시 성동구', lat: 37.5634, lng: 127.0368 },

  // 경기도 주요 지역
  { id: 'bundang', name: '성남시 분당구', fullName: '경기도 성남시 분당구', lat: 37.3827, lng: 127.1189 },
  { id: 'pangyo', name: '성남시 판교', fullName: '경기도 성남시 분당구 판교', lat: 37.3948, lng: 127.1119 },
  { id: 'suwon-yeongtong', name: '수원시 영통구(광교)', fullName: '경기도 수원시 영통구', lat: 37.2596, lng: 127.0465 },
  { id: 'yongin-suji', name: '용인시 수지구', fullName: '경기도 용인시 수지구', lat: 37.3223, lng: 127.0975 },
  { id: 'dongtan', name: '화성시 동탄', fullName: '경기도 화성시 동탄', lat: 37.2003, lng: 127.0863 },
  { id: 'anyang', name: '안양시 동안구(평촌)', fullName: '경기도 안양시 동안구', lat: 37.3927, lng: 126.9536 },
  { id: 'bucheon', name: '부천시 원미구', fullName: '경기도 부천시 원미구', lat: 37.5034, lng: 126.7660 },
  { id: 'gimpo', name: '김포시', fullName: '경기도 김포시', lat: 37.6153, lng: 126.7156 },
  { id: 'paju', name: '파주시(운정)', fullName: '경기도 파주시', lat: 37.7600, lng: 126.7800 },
  { id: 'namyangju', name: '남양주시(다산)', fullName: '경기도 남양주시', lat: 37.6360, lng: 127.2165 },
  { id: 'hanam', name: '하남시(미사)', fullName: '경기도 하남시', lat: 37.5393, lng: 127.2148 },

  // 인천 및 광역시
  { id: 'songdo', name: '인천 연수구(송도)', fullName: '인천광역시 연수구 송도동', lat: 37.3917, lng: 126.6385 },
  { id: 'incheon-bupyeong', name: '인천 부평구', fullName: '인천광역시 부평구', lat: 37.5070, lng: 126.7219 },
  { id: 'busan-haeundae', name: '부산 해운대구', fullName: '부산광역시 해운대구', lat: 35.1631, lng: 129.1636 },
  { id: 'busan-busanjin', name: '부산 부산진구(서면)', fullName: '부산광역시 부산진구', lat: 35.1627, lng: 129.0532 },
  { id: 'daegu-suseong', name: '대구 수성구', fullName: '대구광역시 수성구', lat: 35.8580, lng: 128.6306 },
  { id: 'daejeon-yuseong', name: '대전 유성구', fullName: '대전광역시 유성구', lat: 36.3622, lng: 127.3563 },
  { id: 'gwangju-seo', name: '광주 서구', fullName: '광주광역시 서구', lat: 35.1520, lng: 126.8895 },
  { id: 'ulsan-nam', name: '울산 남구', fullName: '울산광역시 남구', lat: 35.5360, lng: 129.3300 },
  { id: 'sejong', name: '세종특별자치시', fullName: '세종특별자치시', lat: 36.4800, lng: 127.2890 },
  { id: 'jeju-city', name: '제주시', fullName: '제주특별자치도 제주시', lat: 33.4996, lng: 126.5312 },
  { id: 'seogwipo', name: '서귀포시', fullName: '제주특별자치도 서귀포시', lat: 33.2541, lng: 126.5601 }
];

export const DEFAULT_REGION: Region = KOREA_REGIONS[0]; // 최초 실행 시 사용할 기본 지역
