"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X, Check } from "lucide-react";

type Props = {
  url: string;
  onApply: (newUrl: string) => void;
  onClose: () => void;
};

type Rect = { x: number; y: number; w: number; h: number }; // tum degerler 0-100 (yuzde)

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "Serbest", value: null },
  { label: "3:4", value: 3 / 4 },
  { label: "4:5", value: 4 / 5 },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
];

const HANDLES = ["nw", "ne", "sw", "se"] as const;
type Handle = (typeof HANDLES)[number];

export default function CropEditor({ url, onApply, onClose }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<Rect>({ x: 10, y: 10, w: 80, h: 80 });
  const [aspect, setAspect] = useState<number | null>(3 / 4);
  const [working, setWorking] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Aspect degisirse kutuyu o orana cek
  useEffect(() => {
    if (!aspect || !stageRef.current) return;
    setCrop((c) => fitAspect(c, aspect, stageRef.current!));
  }, [aspect]);

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !working && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, working]);

  function fitAspect(r: Rect, a: number, stage: HTMLDivElement): Rect {
    // Aspect = w / h (image koordinatlarinda). Stage'in en/boy oranina gore yuzdelere dondur.
    const stageRatio = stage.clientWidth / stage.clientHeight;
    const wPct = r.w;
    // r.h'yi a'ya gore hesapla (image koordinati): pix_w / pix_h = a
    // pix_w = (r.w/100) * stage_w; pix_h = (r.h/100) * stage_h
    // pix_w / pix_h = a => (r.w * stage_w) / (r.h * stage_h) = a
    // r.h = (r.w * stage_w) / (a * stage_h) = r.w * stageRatio / a
    let hPct = (wPct * stageRatio) / a;
    if (hPct > 100) {
      hPct = 100;
      const newW = (hPct * a) / stageRatio;
      return clampRect({ x: r.x, y: r.y, w: newW, h: hPct });
    }
    return clampRect({ x: r.x, y: r.y, w: wPct, h: hPct });
  }

  function clampRect(r: Rect): Rect {
    const w = Math.max(5, Math.min(100, r.w));
    const h = Math.max(5, Math.min(100, r.h));
    const x = Math.max(0, Math.min(100 - w, r.x));
    const y = Math.max(0, Math.min(100 - h, r.y));
    return { x, y, w, h };
  }

  function startMove(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const stage = stageRef.current!;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...crop };
    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / sw) * 100;
      const dy = ((ev.clientY - startY) / sh) * 100;
      setCrop(clampRect({ ...startCrop, x: startCrop.x + dx, y: startCrop.y + dy }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(handle: Handle) {
    return (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const stage = stageRef.current!;
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const startX = e.clientX;
      const startY = e.clientY;
      const start = { ...crop };
      const stageRatio = sw / sh;

      const move = (ev: PointerEvent) => {
        const dx = ((ev.clientX - startX) / sw) * 100;
        const dy = ((ev.clientY - startY) / sh) * 100;

        let next = { ...start };
        // Resize davranisi: hangi kose suruluyorsa karsi kosesabit kalir.
        if (handle === "se") { next.w = start.w + dx; next.h = start.h + dy; }
        if (handle === "ne") { next.w = start.w + dx; next.y = start.y + dy; next.h = start.h - dy; }
        if (handle === "sw") { next.x = start.x + dx; next.w = start.w - dx; next.h = start.h + dy; }
        if (handle === "nw") { next.x = start.x + dx; next.w = start.w - dx; next.y = start.y + dy; next.h = start.h - dy; }

        if (aspect) {
          // Image koordinatlarinda aspect'e uyacak sekilde h'yi w'den hesapla
          const wPct = next.w;
          const hPct = (wPct * stageRatio) / aspect;
          // Anchor'a gore y'yi adapte et
          if (handle === "ne" || handle === "nw") {
            // ust kose suruluyor, alt sabit -> y degissin
            const oldBottom = start.y + start.h;
            next.h = hPct;
            next.y = oldBottom - hPct;
          } else {
            // alt kose suruluyor, ust sabit -> sadece h degissin
            next.h = hPct;
          }
        }

        setCrop(clampRect(next));
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }

  async function handleApply() {
    setErr(null);
    if (!naturalSize.w || !naturalSize.h) {
      setErr("Görsel henüz yüklenmedi.");
      return;
    }
    setWorking(true);
    try {
      // Origin'den blob'u indir (CORS taint problemi olmasin diye fetch).
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Görsel indirilemedi (${resp.status})`);
      const blob = await resp.blob();
      const objectUrl = URL.createObjectURL(blob);

      const sourceImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new window.Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Görsel decode edilemedi"));
        i.src = objectUrl;
      });

      const sx = (crop.x / 100) * sourceImg.naturalWidth;
      const sy = (crop.y / 100) * sourceImg.naturalHeight;
      const sw = (crop.w / 100) * sourceImg.naturalWidth;
      const sh = (crop.h / 100) * sourceImg.naturalHeight;

      // Cikti boyutu: max 2000px en — performans icin downscale.
      const MAX = 2000;
      const scale = Math.min(1, MAX / sw);
      const outW = Math.round(sw * scale);
      const outH = Math.round(sh * scale);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context yok");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, outW, outH);

      URL.revokeObjectURL(objectUrl);

      const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
      if (!out) throw new Error("Görsel kırpılamadı");

      const file = new File([out], "cropped.jpg", { type: "image/jpeg" });
      const fd = new FormData();
      fd.append("file", file);
      const upload = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await upload.json().catch(() => ({}));
      if (!upload.ok || !data.url) {
        throw new Error(data.error || `Yükleme hatası (HTTP ${upload.status})`);
      }
      onApply(data.url as string);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setWorking(false);
    }
  }

  const cropStyle = useMemo(
    () => ({
      left: `${crop.x}%`,
      top: `${crop.y}%`,
      width: `${crop.w}%`,
      height: `${crop.h}%`,
    }),
    [crop]
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-[min(1100px,95vw)] max-h-[95vh] w-full flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold">Görseli Kırp</h3>
            <p className="text-xs text-gray-500 mt-0.5">Kutuyu sürükle, köşelerden boyutlandır.</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 mr-1">Oran:</span>
            {ASPECTS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => setAspect(a.value)}
                className={`px-2.5 py-1 rounded border ${aspect === a.value ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50 flex items-center justify-center min-h-0">
          <div
            ref={stageRef}
            className="relative inline-block max-w-full max-h-[calc(95vh-200px)] select-none touch-none"
            style={{ lineHeight: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={url}
              alt=""
              className="max-w-full max-h-[calc(95vh-200px)] object-contain"
              draggable={false}
              onLoad={(e) => {
                const i = e.currentTarget;
                setNaturalSize({ w: i.naturalWidth, h: i.naturalHeight });
                setImgLoaded(true);
                if (aspect && stageRef.current) {
                  setCrop((c) => fitAspect(c, aspect, stageRef.current!));
                }
              }}
              onError={() => setErr("Görsel yüklenemedi (kaynak erişim hatası).")}
            />
            {imgLoaded && (
              <>
                {/* Karartma maskeleri (4 yan) */}
                <div className="absolute bg-black/55 left-0 top-0 right-0 pointer-events-none" style={{ height: `${crop.y}%` }} />
                <div className="absolute bg-black/55 left-0 right-0 bottom-0 pointer-events-none" style={{ top: `${crop.y + crop.h}%` }} />
                <div className="absolute bg-black/55 left-0 pointer-events-none" style={{ top: `${crop.y}%`, height: `${crop.h}%`, width: `${crop.x}%` }} />
                <div className="absolute bg-black/55 right-0 pointer-events-none" style={{ top: `${crop.y}%`, height: `${crop.h}%`, left: `${crop.x + crop.w}%` }} />

                {/* Crop kutu */}
                <div
                  className="absolute border border-white shadow-[0_0_0_1px_rgba(0,0,0,.3)] cursor-move"
                  style={cropStyle}
                  onPointerDown={startMove}
                >
                  {/* Iki yatay + iki dikey ucte-bir kilavuzlari */}
                  <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
                  <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
                  <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
                  <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />

                  {/* Kose tutamaclari */}
                  {HANDLES.map((h) => (
                    <div
                      key={h}
                      onPointerDown={startResize(h)}
                      className="absolute w-3 h-3 bg-white border border-black"
                      style={{
                        cursor: h === "nw" || h === "se" ? "nwse-resize" : "nesw-resize",
                        ...(h.includes("n") ? { top: -6 } : { bottom: -6 }),
                        ...(h.includes("w") ? { left: -6 } : { right: -6 }),
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {err && (
          <div className="px-4 py-2 text-xs text-red-700 bg-red-50 border-t border-red-200">{err}</div>
        )}

        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 font-mono">
            {imgLoaded
              ? `${Math.round((crop.w / 100) * naturalSize.w)} × ${Math.round((crop.h / 100) * naturalSize.h)} px`
              : "Yükleniyor…"}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={working} className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-40">
              İptal
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={working || !imgLoaded}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-40 flex items-center gap-2"
            >
              {working ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {working ? "Kırpılıyor…" : "Onayla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
