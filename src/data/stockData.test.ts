import { describe, it, expect } from 'vitest';
import { STOCK_DATA } from './stockData';

describe('STOCK_DATA 7대 주요 자산 무결성 및 타임라인 검증 (TDD Seam)', () => {
  const EXPECTED_7_KEYS = ['KOSPI', 'KOSDAQ', 'SPX', 'IXIC', 'TLT', 'GOLD', 'BTC'];

  it('7개 핵심 종목이 누락 없이 모두 정의되어 있어야 한다', () => {
    EXPECTED_7_KEYS.forEach((key) => {
      expect(STOCK_DATA[key]).toBeDefined();
      expect(STOCK_DATA[key].symbol).toBeTruthy();
      expect(STOCK_DATA[key].name).toBeTruthy();
      expect(STOCK_DATA[key].price).toBeTruthy();
    });
  });

  it('각 종목은 1D, 1W, 1M, 1Y 시계열 데이터를 완전하게 보유해야 한다', () => {
    EXPECTED_7_KEYS.forEach((key) => {
      const stock = STOCK_DATA[key];
      expect(stock.history).toBeDefined();
      expect(stock.history['1D'].length).toBeGreaterThan(0);
      expect(stock.history['1W'].length).toBeGreaterThan(0);
      expect(stock.history['1M'].length).toBeGreaterThan(0);
      expect(stock.history['1Y'].length).toBe(12); // 정확히 12개월
    });
  });

  it('1Y 타임라인의 마지막 항목은 현재 월(현재)로 끝나야 한다', () => {
    const currentMonth = new Date().getMonth() + 1;
    EXPECTED_7_KEYS.forEach((key) => {
      const y1 = STOCK_DATA[key].history['1Y'];
      const lastPoint = y1[y1.length - 1];
      expect(lastPoint.time).toBe(`${currentMonth}월(현재)`);
    });
  });

  it('한국 증시(KOSPI, KOSDAQ)의 1D 타임라인은 정규장(09:00~15:30)이어야 한다', () => {
    const kospi1D = STOCK_DATA['KOSPI'].history['1D'];
    expect(kospi1D[0].time).toBe('09:00');
    expect(kospi1D[kospi1D.length - 1].time).toBe('15:30');
    expect(STOCK_DATA['KOSPI'].marketType).toBe('KR');
  });

  it('미국 증시(SPX, IXIC, TLT, GOLD)의 1D 타임라인은 미국 정규장(09:30~16:00)이어야 한다', () => {
    const spx1D = STOCK_DATA['SPX'].history['1D'];
    expect(spx1D[0].time).toBe('09:30');
    expect(spx1D[spx1D.length - 1].time).toBe('16:00');
    expect(STOCK_DATA['SPX'].marketType).toBe('US');
  });

  it('가상자산(BTC)의 1D 타임라인은 24시간(00:00~24:00)이어야 한다', () => {
    const btc1D = STOCK_DATA['BTC'].history['1D'];
    expect(btc1D[0].time).toBe('00:00');
    expect(btc1D[btc1D.length - 1].time).toBe('24:00');
    expect(STOCK_DATA['BTC'].marketType).toBe('CRYPTO_24H');
  });
});
