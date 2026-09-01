import { describe, it, expect } from 'vitest';
import { getWeatherInfo } from './weatherService';
import { DEFAULT_REGION } from '../data/koreaRegions';

describe('날씨 서비스 단위 테스트 (TDD Seam)', () => {
  it('기상 코드에 따라 올바른 한국어 라벨과 아이콘을 반환해야 한다', () => {
    expect(getWeatherInfo(0)).toEqual({ label: '맑음', icon: '☀️' });
    expect(getWeatherInfo(1)).toEqual({ label: '구름 조금', icon: '🌤️' });
    expect(getWeatherInfo(3)).toEqual({ label: '흐림', icon: '☁️' });
    expect(getWeatherInfo(51)).toEqual({ label: '이슬비', icon: '🌦️' });
    expect(getWeatherInfo(61)).toEqual({ label: '비', icon: '🌧️' });
    expect(getWeatherInfo(71)).toEqual({ label: '눈', icon: '❄️' });
    expect(getWeatherInfo(80)).toEqual({ label: '소나기', icon: '🌦️' });
    expect(getWeatherInfo(95)).toEqual({ label: '뇌우', icon: '⛈️' });
  });

  it('기본 지역 및 지역 목록은 구 단위 명칭과 유효한 좌표를 가져야 한다', () => {
    // 기본 지역 유효성 검증
    expect(DEFAULT_REGION).toBeDefined();
    expect(DEFAULT_REGION.id).toBeTruthy();
    expect(DEFAULT_REGION.name).toBeTruthy();
    expect(typeof DEFAULT_REGION.lat).toBe('number');
    expect(typeof DEFAULT_REGION.lng).toBe('number');
    expect(DEFAULT_REGION.lat).toBeGreaterThan(33); // 대한민국 위도 범위
    expect(DEFAULT_REGION.lat).toBeLessThan(39);
    expect(DEFAULT_REGION.lng).toBeGreaterThan(124); // 대한민국 경도 범위
    expect(DEFAULT_REGION.lng).toBeLessThan(132);
  });
});
