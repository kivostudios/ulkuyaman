// SSRF (Server-Side Request Forgery) korumasi.
//
// Server-side fetch yapan endpoint'ler (proxy-image gibi) kullanici kontrolundeki
// URL'leri internal network'e yonlendirebilir. Bu modul:
//
//   1. Hostname'in IP literal mi domain mi oldugunu tespit eder
//   2. Domain ise DNS ile A/AAAA kayitlarini cozer
//   3. Sonucta gelen IP adresleri private/loopback/link-local mu kontrol eder
//
// Engellenen aralıklar:
//   IPv4: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16,
//         169.254.0.0/16 (link-local + AWS/GCP metadata), 0.0.0.0/8,
//         100.64.0.0/10 (CGNAT), 224.0.0.0/4 (multicast)
//   IPv6: ::1, fc00::/7 (ULA), fe80::/10 (link-local), ::/128

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

function ipv4ToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return -1;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  if (n === -1) return false;
  // 0.0.0.0/8
  if ((n & 0xff000000) === 0x00000000) return true;
  // 10.0.0.0/8
  if ((n & 0xff000000) === 0x0a000000) return true;
  // 100.64.0.0/10 (CGNAT)
  if ((n & 0xffc00000) === 0x64400000) return true;
  // 127.0.0.0/8
  if ((n & 0xff000000) === 0x7f000000) return true;
  // 169.254.0.0/16 (link-local + metadata)
  if ((n & 0xffff0000) === 0xa9fe0000) return true;
  // 172.16.0.0/12
  if ((n & 0xfff00000) === 0xac100000) return true;
  // 192.168.0.0/16
  if ((n & 0xffff0000) === 0xc0a80000) return true;
  // 224.0.0.0/4 (multicast)
  if ((n & 0xf0000000) === 0xe0000000) return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  // ::1 (loopback)
  if (lower === "::1") return true;
  // :: (unspecified)
  if (lower === "::") return true;
  // fc00::/7 (ULA: fc00..fdff)
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  // fe80::/10 (link-local)
  if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
  // IPv4-mapped IPv6: ::ffff:1.2.3.4 — IPv4 kismina bak
  const m = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (m) return isPrivateIPv4(m[1]);
  return false;
}

export function isPrivateAddress(ipOrHostname: string): boolean {
  const v = isIP(ipOrHostname);
  if (v === 4) return isPrivateIPv4(ipOrHostname);
  if (v === 6) return isPrivateIPv6(ipOrHostname);
  return false;
}

/**
 * URL'i SSRF acisindan dogrula. Hostname domain ise DNS ile cozer ve
 * cozulen IP'leri kontrol eder. Reject sebebi varsa Error throw eder.
 */
export async function assertSafeUrl(target: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw new Error("Gecersiz URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Sadece http/https protokolleri kabul edilir");
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, ""); // [::1] -> ::1

  // Bos veya 'localhost' gibi sembolik
  if (!hostname) {
    throw new Error("Hostname bos");
  }
  if (hostname.toLowerCase() === "localhost" || hostname === "0.0.0.0") {
    throw new Error("Localhost'a istek yapilamaz");
  }

  // IP literali ise dogrudan kontrol
  const v = isIP(hostname);
  if (v) {
    if (isPrivateAddress(hostname)) {
      throw new Error(`Private IP'ye istek yapilamaz: ${hostname}`);
    }
    return parsed;
  }

  // Domain — DNS ile coz, hem IPv4 hem IPv6 sonuclarini kontrol et
  const all = await lookup(hostname, { all: true }).catch(() => {
    throw new Error(`DNS coozulemedi: ${hostname}`);
  });
  for (const r of all) {
    if (isPrivateAddress(r.address)) {
      throw new Error(`Hostname private IP'ye cozuluyor (${r.address})`);
    }
  }
  return parsed;
}
