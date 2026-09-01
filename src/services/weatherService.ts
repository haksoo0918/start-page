import { Region } from '../data/koreaRegions';

export interface HourlyForecast {
  time: string;
  hour: string;
  isToday: boolean;
  rainProb: number;
  temp: number;
  weatherCode: number;
}

export interface DayRainSummary {
  date: string;
  dayLabel: '오늘' | '내일';
  maxRainProb: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  needUmbrella: boolean;
}

export interface WeatherData {
  region: Region;
  today: DayRainSummary;
  tomorrow: DayRainSummary;
  hourly: HourlyForecast[];
  currentTemp: number;
  currentRainProb: number;
}

// Weather code to Korean label & Icon mapping
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

export async function fetchRainWeather(region: Region): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lng}&hourly=precipitation_probability,temperature_2m,weathercode&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FSeoul&forecast_days=2`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();

    const hourlyList: HourlyForecast[] = [];
    const hourlyTimes: string[] = data.hourly.time;
    const hourlyRain: number[] = data.hourly.precipitation_probability;
    const hourlyTemp: number[] = data.hourly.temperature_2m;
    const hourlyCodes: number[] = data.hourly.weathercode;

    const currentHourIndex = new Date().getHours();

    for (let i = 0; i < hourlyTimes.length; i++) {
      const dateObj = new Date(hourlyTimes[i]);
      const hourStr = `${String(dateObj.getHours()).padStart(2, '0')}시`;
      const isToday = i < 24;

      hourlyList.push({
        time: hourlyTimes[i],
        hour: hourStr,
        isToday,
        rainProb: hourlyRain[i] ?? 0,
        temp: Math.round(hourlyTemp[i] ?? 0),
        weatherCode: hourlyCodes[i] ?? 0
      });
    }

    const todayMaxRain = data.daily.precipitation_probability_max[0] ?? 0;
    const tomorrowMaxRain = data.daily.precipitation_probability_max[1] ?? 0;

    return {
      region,
      today: {
        date: data.daily.time[0],
        dayLabel: '오늘',
        maxRainProb: todayMaxRain,
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        weatherCode: data.daily.weathercode[0] ?? 0,
        needUmbrella: todayMaxRain >= 40
      },
      tomorrow: {
        date: data.daily.time[1],
        dayLabel: '내일',
        maxRainProb: tomorrowMaxRain,
        tempMax: Math.round(data.daily.temperature_2m_max[1]),
        tempMin: Math.round(data.daily.temperature_2m_min[1]),
        weatherCode: data.daily.weathercode[1] ?? 0,
        needUmbrella: tomorrowMaxRain >= 40
      },
      hourly: hourlyList,
      currentTemp: Math.round(hourlyTemp[currentHourIndex] || hourlyTemp[0] || 20),
      currentRainProb: hourlyRain[currentHourIndex] || 0
    };
  } catch (err) {
    console.warn('Using fallback rain data:', err);
    // Fallback Mock data for Ilsan / Selected Region
    return generateFallbackRainData(region);
  }
}

function generateFallbackRainData(region: Region): WeatherData {
  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 48; i++) {
    const hourNum = i % 24;
    const isToday = i < 24;
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
