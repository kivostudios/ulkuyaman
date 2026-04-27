// Resim URL'lerinin hash'inde "#pos=X,Y" (yuzde) crop pozisyonu sakliyoruz.
// X = yatay (0=sol, 50=orta, 100=sag), Y = dikey (0=ust, 50=orta, 100=alt).
//
// Browser hash'i istek'e dahil etmez, origin etkilenmez.

export type ImageMeta = { url: string; position: string };

// CSS object-position "X% Y%" formatinda gerek; X ve Y sayilari 0-100 arasi clamp.
function clampPercent(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Backward compat: eski keyword pozisyonlari yuzdeye cevir.
const KEYWORD_TO_XY: Record<string, [number, number]> = {
  center: [50, 50],
  top: [50, 0],
  bottom: [50, 100],
  left: [0, 50],
  right: [100, 50],
};

export function parseImageMeta(raw: string): ImageMeta {
  if (!raw) return { url: raw, position: "50% 50%" };
  const i = raw.indexOf("#");
  if (i === -1) return { url: raw, position: "50% 50%" };

  const url = raw.slice(0, i);
  const params = new URLSearchParams(raw.slice(i + 1));
  const pos = params.get("pos") || "";

  // Format 1: "X,Y" sayilar
  const m = pos.match(/^(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/);
  if (m) {
    return {
      url,
      position: `${clampPercent(parseFloat(m[1]))}% ${clampPercent(parseFloat(m[2]))}%`,
    };
  }

  // Format 2: keyword (eski kayitlar icin)
  const xy = KEYWORD_TO_XY[pos];
  if (xy) {
    return { url, position: `${xy[0]}% ${xy[1]}%` };
  }

  return { url, position: "50% 50%" };
}

// Admin yazma tarafi: X,Y sayilarini URL hash'ine yaz.
// Default (50,50) ise hash'e eklenmiyor — daha temiz.
export function joinImageUrl(bareUrl: string, x: number, y: number): string {
  const cx = clampPercent(x);
  const cy = clampPercent(y);
  if (cx === 50 && cy === 50) return bareUrl;
  return `${bareUrl}#pos=${cx},${cy}`;
}

// Admin formu icin: raw URL'i (bareUrl, x%, y%) tuple'ina parse et.
export function parseImageEditable(raw: string): { url: string; x: number; y: number } {
  if (!raw) return { url: raw, x: 50, y: 50 };
  const i = raw.indexOf("#");
  if (i === -1) return { url: raw, x: 50, y: 50 };

  const url = raw.slice(0, i);
  const params = new URLSearchParams(raw.slice(i + 1));
  const pos = params.get("pos") || "";

  const m = pos.match(/^(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/);
  if (m) {
    return { url, x: clampPercent(parseFloat(m[1])), y: clampPercent(parseFloat(m[2])) };
  }
  const xy = KEYWORD_TO_XY[pos];
  if (xy) return { url, x: xy[0], y: xy[1] };
  return { url, x: 50, y: 50 };
}
