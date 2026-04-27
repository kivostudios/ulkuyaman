"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type CardProduct = {
  id: string;
  name: string;
  price: number;
  image: string | null;
};

type Props = {
  newArrivals: CardProduct[];
  bestsellers: CardProduct[];
};

// Hero gorseli /public altinda; Next.js Image otomatik optimize ediyor.
const HERO_IMG = "/hero.png";
const ABOUT_IMG_1 =
  "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&q=92&auto=format&fit=crop";
const ABOUT_IMG_2 =
  "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1400&q=92&auto=format&fit=crop";
const CRAFT_IMGS = [
  "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=1200&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=90&auto=format&fit=crop",
];
const CAT_IMGS = [
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=92&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&q=92&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1400&q=92&auto=format&fit=crop",
];
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=90&auto=format&fit=crop";

const TESTIMONIALS = [
  {
    quote:
      "Bir çift sandalet değil, alışkanlığa dönüştü. Üç sezondur giyiyorum, deri yumuşadıkça daha güzel.",
    author: "Defne K.",
    city: "İstanbul",
  },
  {
    quote:
      "Manisa'daki atölyeyi ziyaret ettim — her bir parça gerçekten elden geçiyor. Hak ettiği özen.",
    author: "Selin A.",
    city: "İzmir",
  },
  {
    quote:
      "Hem yazlık hem akşam giyilebilen az şeyden biri. Heykelsi ama mütevazı.",
    author: "Ayşe T.",
    city: "Ankara",
  },
];

// ── REVEAL ────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

function Reveal({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 1.1s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="uy-hero">
      <div className="uy-hero-img">
        <Image
          src={HERO_IMG}
          alt="Ülkü Yaman SS26"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="uy-hero-eyebrow">
        <span className="uy-dot" />
        <span>BAHAR / YAZ 2026</span>
      </div>

      <div className="uy-hero-headline">
        <h1>
          <span className="line">Heykelsi siluetler,</span>
          <span className="line italic">gündelik bir dilde.</span>
        </h1>
      </div>

      <div className="uy-hero-foot">
        <div className="uy-hero-meta">
          <span>EL YAPIMI · MANİSA</span>
          <span className="uy-sep">—</span>
          <span>SERTİFİKALI HAKİKİ DERİ</span>
        </div>
        <Link href="/sandaletler?yeni=1" className="uy-cta">
          KOLEKSİYONU GÖR
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "EL YAPIMI",
    "✦",
    "MANİSA ATÖLYESİ",
    "✦",
    "HAKİKİ DERİ",
    "✦",
    "SINIRLI ÜRETİM",
    "✦",
    "TÜRKİYE'YE ÜCRETSİZ KARGO",
    "✦",
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="uy-marquee" aria-hidden="true">
      <div className="uy-marquee-track">
        {row.map((t, i) => (
          <span key={i} className={t === "✦" ? "uy-mark" : "uy-mword"}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="uy-about" id="hikaye">
      <Reveal className="uy-about-text">
        <span className="uy-eyebrow">— ÜLKÜ YAMAN HAKKINDA</span>
        <h2 className="uy-display">
          Gündelik fonksiyonun içinde <em>heykelsi formu</em> arayan ayakkabılar.
        </h2>
        <p>
          Manisa&apos;daki atölyemizde, sertifikalı hakiki deri ile bağımsız ustalar tarafından
          elle üretilir. Sade, ölçülü, ama ayırt edilebilir bir estetiği savunuyoruz —
          modern hayatın ritmiyle doğal şekilde hareket eden parçalar.
        </p>
      </Reveal>

      <div className="uy-about-grid">
        <Reveal delay={0.1} className="uy-about-img is-tall">
          <Image src={ABOUT_IMG_1} alt="" fill sizes="(max-width: 980px) 50vw, 25vw" style={{ objectFit: "cover" }} />
        </Reveal>
        <Reveal delay={0.2} className="uy-about-img is-short">
          <Image src={ABOUT_IMG_2} alt="" fill sizes="(max-width: 980px) 50vw, 25vw" style={{ objectFit: "cover" }} />
          <div className="uy-about-tag">
            <span>FW · 24</span>
            <span>Manisa, TR</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── PRODUCT GRID ──────────────────────────────────────────────────────────
function ProductGrid({ bestsellers, newArrivals }: { bestsellers: CardProduct[]; newArrivals: CardProduct[] }) {
  const [tab, setTab] = useState<"best" | "new">("best");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const items = tab === "best" ? bestsellers : newArrivals;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let isDown = false,
      startX = 0,
      startScroll = 0;
    const down = (e: MouseEvent) => {
      isDown = true;
      el.classList.add("is-grabbing");
      startX = e.pageX - el.offsetLeft;
      startScroll = el.scrollLeft;
    };
    const up = () => {
      isDown = false;
      el.classList.remove("is-grabbing");
    };
    const move = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = startScroll - (x - startX) * 1.2;
    };
    el.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    el.addEventListener("mouseleave", up);
    el.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      el.removeEventListener("mouseleave", up);
      el.removeEventListener("mousemove", move);
    };
  }, []);

  const nudge = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="uy-shop" id="yeni">
      <Reveal>
        <div className="uy-shop-head">
          <div className="uy-tabs">
            <button className={tab === "best" ? "is-active" : ""} onClick={() => setTab("best")}>
              ÇOK SATANLAR
            </button>
            <button className={tab === "new" ? "is-active" : ""} onClick={() => setTab("new")}>
              YENİ GELENLER
            </button>
          </div>
          <div className="uy-shop-nudge">
            <span className="uy-hint">SÜRÜKLE</span>
            <button onClick={() => nudge(-1)} aria-label="Önceki">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => nudge(1)} aria-label="Sonraki">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </Reveal>

      {items.length === 0 ? (
        <div style={{ padding: "0 32px", color: "var(--muted)", fontSize: 14 }}>
          Bu kategoride şu an gösterilecek ürün yok.
        </div>
      ) : (
        <div className="uy-shop-track" ref={trackRef}>
          {items.map((p, i) => (
            <Link key={p.id} href={`/urunler/${p.id}`} className="uy-card">
              <div className="uy-card-img">
                <Image
                  src={p.image ?? FALLBACK_IMG}
                  alt={p.name}
                  fill
                  draggable={false}
                  sizes="(max-width: 980px) 75vw, 25vw"
                  style={{ objectFit: "cover", pointerEvents: "none" }}
                  unoptimized
                />
                <span className="uy-card-num">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="uy-card-meta">
                <span className="uy-card-name">{p.name}</span>
                <span className="uy-card-price">₺{p.price.toLocaleString("tr-TR")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── ATELIER ───────────────────────────────────────────────────────────────
function Atelier() {
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const steps = [
    {
      n: "01",
      t: "DERİ SEÇİMİ",
      b:
        "Sertifikalı tabakhanelerden gelen sebze tabaklı dana derisi. Her parça elle inceleniyor; doku, esneklik, renk uyumu için.",
      img: CRAFT_IMGS[0],
    },
    {
      n: "02",
      t: "KESİM & ŞABLON",
      b: "Heykelsi siluet, milimetrik şablonlarla başlıyor. Bir usta her gün yalnızca on çift kesebilir.",
      img: CRAFT_IMGS[1],
    },
    {
      n: "03",
      t: "EL DİKİŞİ",
      b: "Saten dikiş ve elle çakılan tabanlar — ayağa zamanla şekil veren, yumuşayan bir his. Manisa'da, üç ustanın imzasıyla.",
      img: CRAFT_IMGS[2],
    },
  ];

  useEffect(() => {
    const onScroll = () => {
      const el = stepsRef.current;
      if (!el) return;
      const children = Array.from(el.querySelectorAll<HTMLDivElement>("[data-step]"));
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      children.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.top <= mid) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="uy-atelier">
      <div className="uy-atelier-rail">
        <div className="uy-atelier-sticky">
          <div className="uy-atelier-img-wrap">
            {steps.map((s, i) => (
              <Image
                key={s.n}
                src={s.img}
                alt={s.t}
                fill
                sizes="50vw"
                className={`uy-atelier-img ${i === active ? "is-active" : ""}`}
                style={{ objectFit: "cover" }}
              />
            ))}
            <div className="uy-atelier-badge">
              <span className="uy-eyebrow">ATÖLYE</span>
              <span className="uy-display-sm">Manisa, Türkiye</span>
              <span className="uy-tag-line">41° kuzey · 27° doğu</span>
            </div>
          </div>
        </div>
      </div>

      <div className="uy-atelier-steps" ref={stepsRef}>
        <Reveal>
          <span className="uy-eyebrow">— YAPIM SÜRECİ</span>
          <h2 className="uy-display">Üç usta, üç adım, bir çift.</h2>
        </Reveal>
        {steps.map((s, i) => (
          <div key={s.n} className={`uy-atelier-step ${i === active ? "is-active" : ""}`} data-step>
            <span className="uy-step-num">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.b}</p>
          </div>
        ))}
        <Reveal delay={0.05}>
          <Link href="/hakkimizda" className="uy-cta uy-cta-dark">
            ATÖLYEYİ KEŞFET
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────────────────
function Categories() {
  const cats = [
    { t: "TÜM SANDALETLER", sub: "01 — Koleksiyon", img: CAT_IMGS[0], cta: "Tümünü İncele", href: "/sandaletler" },
    { t: "YENİ GELENLER", sub: "02 — SS26", img: CAT_IMGS[1], cta: "Yeni Sezon", href: "/sandaletler?yeni=1" },
    { t: "İNDİRİM", sub: "03 — Sezon Sonu", img: CAT_IMGS[2], cta: "Fırsatları Gör", href: "/sandaletler?indirim=1" },
  ];
  return (
    <section className="uy-cats" id="sandaletler">
      <Reveal className="uy-cats-head">
        <span className="uy-eyebrow">— KOLEKSİYONU KEŞFET</span>
        <h2 className="uy-display">Üç giriş, bir koleksiyon.</h2>
      </Reveal>
      <div className="uy-cats-grid">
        {cats.map((c, i) => (
          <Reveal key={c.t} delay={i * 0.08}>
            <Link href={c.href} className="uy-cat">
              <div className="uy-cat-img">
                <Image src={c.img} alt={c.t} fill sizes="(max-width: 980px) 100vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
              <div className="uy-cat-meta">
                <div>
                  <span className="uy-cat-sub">{c.sub}</span>
                  <span className="uy-cat-name">{c.t}</span>
                </div>
                <span className="uy-cat-cta">{c.cta} →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="uy-testimonials">
      <Reveal>
        <span className="uy-eyebrow">— MÜŞTERİLERİMİZ</span>
      </Reveal>
      <div className="uy-quote-stage">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className={`uy-quote ${i === idx ? "is-active" : ""}`}>
            <p className="uy-display">
              <span className="uy-mark-q">“</span>
              {t.quote}
              <span className="uy-mark-q">”</span>
            </p>
            <footer>
              <span>{t.author}</span>
              <span className="uy-sep">—</span>
              <span>{t.city}</span>
            </footer>
          </blockquote>
        ))}
      </div>
      <div className="uy-quote-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={i === idx ? "is-active" : ""}
            onClick={() => setIdx(i)}
            aria-label={`Yorum ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── JOURNAL + NEWSLETTER ──────────────────────────────────────────────────
function JournalAndNewsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="uy-foot-feature">
      <Reveal className="uy-feat journal">
        <span className="uy-eyebrow">— GÜNCE</span>
        <h3 className="uy-display">Atölyeden notlar, sezon arasında.</h3>
        <p>
          Sezon kampanyaları, sınırlı sayıda üretilen parçalar ve atölye günlükleri için listemize
          katılın.
        </p>
        <Link href="/hakkimizda" className="uy-cta">
          DEVAMINI OKU →
        </Link>
      </Reveal>
      <Reveal delay={0.1} className="uy-feat newsletter">
        <span className="uy-eyebrow">— BÜLTEN</span>
        <h3 className="uy-display">Yeni siluetlere ilk siz erişin.</h3>
        <form
          className="uy-news-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            type="email"
            placeholder={sent ? "Listemize katıldınız ✓" : "E-posta adresiniz"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
            required
          />
          <button type="submit" disabled={sent}>
            {sent ? "GÖNDERİLDİ" : "ABONE OL"}
          </button>
        </form>
        <span className="uy-fineprint">
          Üye olarak <Link href="/gizlilik" style={{ textDecoration: "underline" }}>Gizlilik Politikamızı</Link> kabul etmiş olursunuz.
        </span>
      </Reveal>
    </section>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────
export default function HomeClient({ newArrivals, bestsellers }: Props) {
  return (
    <div className="uy-root">
      <Hero />
      <Marquee />
      <About />
      <ProductGrid bestsellers={bestsellers} newArrivals={newArrivals} />
      <Atelier />
      <Categories />
      <Testimonials />
      <JournalAndNewsletter />
    </div>
  );
}
