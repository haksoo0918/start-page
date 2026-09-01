import { describe, it, expect } from 'vitest';
import { normalizeUrl, extractTitleFromHtml } from './urlHelper';

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

  describe('extractTitleFromHtml', () => {
    it('<title> 태그에서 제목을 정확히 파싱해야 한다', () => {
      const html = '<html><head><title>GitHub: Let’s build from here</title></head><body></body></html>';
      expect(extractTitleFromHtml(html)).toBe('GitHub: Let’s build from here');
    });

    it('HTML 엔티티(&amp;, &quot; 등)를 올바르게 디코딩해야 한다', () => {
      const html = '<title>NAVER &amp; Friends &quot;Portal&quot;</title>';
      expect(extractTitleFromHtml(html)).toBe('NAVER & Friends "Portal"');
    });

    it('<title> 태그가 없을 때 og:title 메타태그에서 제목을 추출해야 한다', () => {
      const html = '<meta property="og:title" content="OpenGraph Title" />';
      expect(extractTitleFromHtml(html)).toBe('OpenGraph Title');
    });

    it('타이틀이 없는 HTML은 빈 문자열을 반환해야 한다', () => {
      expect(extractTitleFromHtml('<div>Hello World</div>')).toBe('');
    });
  });
});
