import { Region } from '../data/koreaRegions';

/**
 * 시간대별 예보 데이터 인터페이스
 */
export interface HourlyForecast {
  /** ISO 형식의 일시 문자열 (예: 2026-09-01T14:00) */
  time: string;
  /** 표시용 시간 문자열 (예: 14시) */
  hour: string;
  /** 오늘 예보 여부 (true: 오늘, false: 내일) */
  isToday: boolean;
  /** 강수 확률 (0 ~ 100%) */
  rainProb: number;
  /** 기온 (℃, 반올림 정수) */
  temp: number;
  /** WMO 날씨 코드 */
  weatherCode: number;
}

/**
 * 일별 날씨 및 강수 요약 정보 인터페이스
 */
export interface DayRainSummary {
  /** YYYY-MM-DD 형식 날짜 */
  date: string;
  /** 표시 라벨 ('오늘' | '내일') */
  dayLabel: '오늘' | '내일';
  /** 당일 최고 강수 확률 (%) */
  maxRainProb: number;
  /** 최고 기온 (℃) */
  tempMax: number;
  /** 최저 기온 (℃) */
  tempMin: number;
  /** 대표 WMO 날씨 코드 */
  weatherCode: number;
  /** 우산 필요 여부 (비 예보 또는 강수확률 30% 이상) */
  needUmbrella: boolean;
}

/**
 * 컴포넌트에서 사용하는 통합 날씨 데이터 인터페이스
 */
export interface WeatherData {
  /** 선택된 지역 정보 */
  region: Region;
  /** 오늘 날씨 요약 */
  today: DayRainSummary;
  /** 내일 날씨 요약 */
  tomorrow: DayRainSummary;
  /** 48시간(오늘+내일) 시간대별 예보 목록 */
  hourly: HourlyForecast[];
  /** 현재 시간대 기온 (℃) */
  currentTemp: number;
  /** 현재 시간대 강수 확률 (%) */
  currentRainProb: number;
}

/**
 * WMO 날씨 코드(0~99)를 한글 명칭과 날씨 이모지 아이콘으로 변환합니다.
 * @param code WMO 날씨 코드
 * @returns { label: string, icon: string } 한글 상태명 및 이모지
 */
export function getWeatherInfo(code: number) {
  if (code === 0) return { label: '맑음', icon: '☀️' };
  if (code === 1 || code === 2) return { label: '구름 조금', icon: '🌤️' };
  if (code === 3) return { label: '흐림', icon: '☁️' };
  if (code >= 45 && code <= 48) return { label: '안개', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: '이슬비', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { label: '비', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: '눈', icon: '❄️' };
  if (code >= 80 && code <= 82) return { label: '소나기', icon: '🌦️' };
  if (code >= 95) return { label: '뇌우', icon: '⛈️' };
  return { label: '구름 많음', icon: '⛅' };
}

/**
 * Open-Meteo 무료 일기예보 API를 호출하여 지정된 지역의 오늘/내일 날씨 및 강수 예보를 가져옵니다.
 * API 호출 실패 시 대체(Mock) 데이터를 반환합니다.
 * 
 * @param region 조회 대상 지역 (위도/경도 포함)
 * @returns 날씨 데이터 객체
 */
export async function fetchRainWeather(region: Region): Promise<WeatherData> {
  try {
    // Open-Meteo API 엔드포인트 구성 (시간별 강수확률, 기온, 날씨코드 및 일별 최고/최저 기온, 최대 강수확률)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lng}&hourly=precipitation_probability,temperature_2m,weathercode&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FSeoul&forecast_days=2`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo 날씨 API 호출 실패');
    const data = await res.json();

    // 시간대별 예보 목록 가공 (총 48시간: 오늘 24시간 + 내일 24시간)
    const hourlyList: HourlyForecast[] = [];
    const hourlyTimes: string[] = data.hourly.time;
    const hourlyRain: number[] = data.hourly.precipitation_probability;
    const hourlyTemp: number[] = data.hourly.temperature_2m;
    const hourlyCodes: number[] = data.hourly.weathercode;

    // 현재 시각 인덱스 (0~23)
    const currentHourIndex = new Date().getHours();

    for (let i = 0; i < hourlyTimes.length; i++) {
      const dateObj = new Date(hourlyTimes[i]);
      const hourStr = `${String(dateObj.getHours()).padStart(2, '0')}시`;
      const isToday = i < 24; // 앞의 24개는 오늘, 뒤의 24개는 내일

      hourlyList.push({
        time: hourlyTimes[i],
        hour: hourStr,
        isToday,
        rainProb: hourlyRain[i] ?? 0,
        temp: Math.round(hourlyTemp[i] ?? 0),
        weatherCode: hourlyCodes[i] ?? 0
      });
    }

    // 오늘/내일 일별 요약 데이터 추출
    const todayMaxRain = data.daily.precipitation_probability_max[0] ?? 0;
    const tomorrowMaxRain = data.daily.precipitation_probability_max[1] ?? 0;
    const todayCode = data.daily.weathercode[0] ?? 0;
    const tomorrowCode = data.daily.weathercode[1] ?? 0;

    // 우산 필요 여부 판정: 날씨 코드가 비/이슬비/소나기/눈(>= 51)이거나 최대 강수 확률이 30% 이상일 때
    const isTodayRainy = todayCode >= 51 || todayMaxRain >= 30;
    const isTomorrowRainy = tomorrowCode >= 51 || tomorrowMaxRain >= 30;

    return {
      region,
      today: {
        date: data.daily.time[0],
        dayLabel: '오늘',
        maxRainProb: todayMaxRain,
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        weatherCode: todayCode,
        needUmbrella: isTodayRainy
      },
      tomorrow: {
        date: data.daily.time[1],
        dayLabel: '내일',
        maxRainProb: tomorrowMaxRain,
        tempMax: Math.round(data.daily.temperature_2m_max[1]),
        tempMin: Math.round(data.daily.temperature_2m_min[1]),
        weatherCode: tomorrowCode,
        needUmbrella: isTomorrowRainy
      },
      hourly: hourlyList,
      // 현재 시간에 해당하는 기온 및 강수확률 매핑 (기본값 설정 포함)
      currentTemp: Math.round(hourlyTemp[currentHourIndex] || hourlyTemp[0] || 20),
      currentRainProb: hourlyRain[currentHourIndex] || 0
    };
  } catch (err) {
    console.warn('날씨 API 오류로 대체(Fallback) 데이터를 사용합니다:', err);
    // API 장애 또는 오프라인 상태일 때 사용할 대체 Mock 데이터 반환
    return generateFallbackRainData(region);
  }
}

/**
 * 네트워크 오류 또는 API 제한 시 사용하는 대체(Fallback) 날씨 데이터 생성 함수
 * 
 * @param region 대상 지역 정보
 * @returns 가상의 48시간 날씨 데이터
 */
function generateFallbackRainData(region: Region): WeatherData {
  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 48; i++) {
    const hourNum = i % 24;
    const isToday = i < 24;
    // 오후 시간대(14시~20시)에 일시적으로 비가 오는 시나리오의 가상 강수 확률
    const rainProb = isToday 
      ? (hourNum >= 14 && hourNum <= 20 ? 65 + (hourNum % 4) * 5 : 10 + (hourNum % 5) * 4)
      : (hourNum >= 8 && hourNum <= 12 ? 30 : 5);
    
    hourly.push({
      time: `2026-09-${isToday ? '01' : '02'}T${String(hourNum).padStart(2, '0')}:00`,
      hour: `${String(hourNum).padStart(2, '0')}시`,
      isToday,
      rainProb,
      temp: 21 + Math.round(Math.sin(hourNum / 3) * 5),
      weatherCode: rainProb > 50 ? 61 : 1
    });
  }

  return {
    region,
    today: {
      date: '2026-09-01',
      dayLabel: '오늘',
      maxRainProb: 75,
      tempMax: 26,
      tempMin: 18,
      weatherCode: 61,
      needUmbrella: true
    },
    tomorrow: {
      date: '2026-09-02',
      dayLabel: '내일',
      maxRainProb: 30,
      tempMax: 27,
      tempMin: 17,
      weatherCode: 1,
      needUmbrella: false
    },
    hourly,
    currentTemp: 23,
    currentRainProb: 45
  };
}

