/**
 * URL 정규화 함수 (프로토콜 누락 시 https:// 자동 부착)
 * @param url 정규화할 원본 URL 문자열
 * @returns 'https://'가 포함된 정규화된 URL
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
