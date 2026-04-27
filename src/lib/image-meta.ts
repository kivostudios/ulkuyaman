// Resim URL'lerinde "#pos=top" gibi crop pozisyonu metadata'si saklıyoruz.
// Browser hash'i istek'e dahil etmez, bu yüzden origin'i etkilemez.
//
// Kullanım:
//   const { url, position } = parseImageMeta(rawUrl);
//   <Image src={url} style={{ objectPosition: position }} />

export type ImageMeta = { url: string; position: string };

const VALID_POSITIONS = new Set(["center", "top", "bottom", "left", "right"]);

export function parseImageMeta(raw: string): ImageMeta {
  if (!raw) return { url: raw, position: "center" };
  const i = raw.indexOf("#");
  if (i === -1) return { url: raw, position: "center" };
  const url = raw.slice(0, i);
  const params = new URLSearchParams(raw.slice(i + 1));
  const pos = params.get("pos") || "center";
  return { url, position: VALID_POSITIONS.has(pos) ? pos : "center" };
}
