/**
 * URL 정규화 함수 (프로토콜 누락 시 https:// 자동 부착)
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * HTML 문자열에서 <title> 태그 추출 및 정돈
 */
export function extractTitleFromHtml(html: string): string {
  if (!html) return '';
  
  // 1. <title> 태그 검색
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return cleanTitle(titleMatch[1]);
  }

  // 2. <meta property="og:title"> 검색
  const ogMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (ogMatch && ogMatch[1]) {
    return cleanTitle(ogMatch[1]);
  }

  return '';
}

/**
 * 타이틀 문자열 디코딩 및 공백 정리
 */
function cleanTitle(raw: string): string {
  let text = raw
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

  return text;
}

/**
 * 웹페이지 실제 제목 비동기 페칭
 */
export async function fetchPageTitle(rawUrl: string): Promise<string> {
  const url = normalizeUrl(rawUrl);
  if (!url) return '';

  try {
    // 1. Microlink API 시도 (CORS 및 다양한 웹페이지 타이틀 지원)
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const res = await fetch(microlinkUrl, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.title) {
        return cleanTitle(data.data.title);
      }
    }
  } catch {
    // fallback 진행
  }

  try {
    // 2. AllOrigins CORS 프록시 fallback
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.contents) {
        const title = extractTitleFromHtml(data.contents);
        if (title) return title;
      }
    }
  } catch {
    // fallback 진행
  }

  // 3. 도메인 호스트네임 fallback
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, '');
    return domain.split('.')[0] || domain;
  } catch {
    return '';
  }
}
