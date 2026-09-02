import { describe, it, expect } from 'vitest';
import { normalizeUrl } from './urlHelper';

describe('urlHelper 단위 테스트 (TDD Seam)', () => {
  describe('normalizeUrl', () => {
    it('프로토콜이 없는 URL에 https://를 자동으로 붙여야 한다', () => {
      expect(normalizeUrl('naver.com')).toBe('https://naver.com');
      expect(normalizeUrl('github.com/trending')).toBe('https://github.com/trending');
      expect(normalizeUrl('  google.com  ')).toBe('https://google.com');
    });

    it('이미 http 또는 https가 있는 URL은 그대로 유지해야 한다', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
      expect(normalizeUrl('https://example.com/path')).toBe('https://example.com/path');
    });

    it('빈 문자열은 빈 문자열을 반환해야 한다', () => {
      expect(normalizeUrl('')).toBe('');
      expect(normalizeUrl('   ')).toBe('');
    });
  });
});
