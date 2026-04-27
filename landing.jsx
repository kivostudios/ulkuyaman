/* eslint-disable */
const { useState, useEffect, useRef, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// TWEAKS — exposed via the toolbar Tweaks toggle
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bgCream": "#f6f1e8",
  "paper": "#fbf8f2",
  "ink": "#1a1410",
  "muted": "#8a7d6b",
  "stoneSoft": "#ece4d4",
  "stone": "#d9cdb6",
  "accent": "#7a5a3a",
  "displayFont": "\"Cormorant Garamond\", \"Times New Roman\", serif",
  "sansFont": "\"Inter Tight\", \"Helvetica Neue\", Helvetica, sans-serif"
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────
// IMAGES — placeholder editorial shots (Unsplash, leather sandal / atelier mood)
// ─────────────────────────────────────────────────────────────
const IMG = {
  hero: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=2400&q=92&auto=format&fit=crop",
  heroAlt: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=2200&q=92&auto=format&fit=crop",
  about1: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&q=92&auto=format&fit=crop",
  about2: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1400&q=92&auto=format&fit=crop",
  atelier: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=2400&q=92&auto=format&fit=crop",
  craft1: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&q=90&auto=format&fit=crop",
  craft2: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=1200&q=90&auto=format&fit=crop",
  craft3: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=90&auto=format&fit=crop",
  cat1: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=92&auto=format&fit=crop",
  cat2: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&q=92&auto=format&fit=crop",
  cat3: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=1400&q=92&auto=format&fit=crop",
  prod: [
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631971456293-cf28dba87800?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622760807800-66cf1466fc08?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573100925118-870b8efc799d?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564605499500-b8a8f5af3756?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=900&q=90&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612902456551-333ac5afa56e?w=900&q=90&auto=format&fit=crop",
  ],
};

const PRODUCTS = [
  { id: "p1", name: "ELARA — Bronz", price: 3450, img: IMG.prod[0] },
  { id: "p2", name: "MIRA — Krem", price: 2950, img: IMG.prod[1] },
  { id: "p3", name: "LIRA — Taba", price: 3250, img: IMG.prod[2] },
  { id: "p4", name: "AYLIN — Siyah", price: 2850, img: IMG.prod[3] },
  { id: "p5", name: "DELYA — Naturel", price: 3650, img: IMG.prod[4] },
  { id: "p6", name: "NORA — Konyak", price: 3150, img: IMG.prod[5] },
  { id: "p7", name: "SELIN — Beyaz", price: 2750, img: IMG.prod[6] },
  { id: "p8", name: "VERA — Antrasit", price: 3350, img: IMG.prod[7] },
];

const TESTIMONIALS = [
  { quote: "Bir çift sandalet değil, alışkanlığa dönüştü. Üç sezondur giyiyorum, deri yumuşadıkça daha güzel.", author: "Defne K.", city: "İstanbul" },
  { quote: "Manisa'daki atölyeyi ziyaret ettim — her bir parça gerçekten elden geçiyor. Hak ettiği özen.", author: "Selin A.", city: "İzmir" },
  { quote: "Hem yazlık hem akşam giyilebilen az şeyden biri. Heykelsi ama mütevazı.", author: "Ayşe T.", city: "Ankara" },
];

// ─────────────────────────────────────────────────────────────
// REVEAL hook — lightweight scroll-in animation
// ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
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
  return [ref, visible];
}

const Reveal = ({ children, delay = 0, as: Tag = "div", className = "", style = {} }) => {
  const [ref, visible] = useReveal();
  return (
    <Tag
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
    </Tag>
  );
};

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`uy-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="uy-nav-inner">
        <nav className="uy-nav-left">
          <a href="#sandaletler">TÜM SANDALETLER</a>
          <a href="#yeni">YENİ GELENLER</a>
          <a href="#indirim">İNDİRİM</a>
          <a href="#hikaye">HİKÂYE</a>
        </nav>
        <a href="#" className="uy-brand">ÜLKÜ YAMAN</a>
        <div className="uy-nav-right">
          <button className="uy-locale">
            <span className="on">TR</span><span>/</span><span>EN</span>
          </button>
          <button aria-label="Search" className="uy-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <button aria-label="Account" className="uy-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
          </button>
          <button aria-label="Cart" className="uy-icon uy-cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 7h14l-1.5 12.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
            <span className="uy-cart-count">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="uy-hero" data-screen-label="01 Hero">
      <div className="uy-hero-img">
        <img src={IMG.hero} alt="Ülkü Yaman SS26"/>
        <div className="uy-hero-overlay"/>
      </div>

      <div className="uy-hero-eyebrow">
        <span className="uy-dot"/>
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
        <a href="#yeni" className="uy-cta">
          KOLEKSİYONU GÖR
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// MARQUEE — sürekli kayan şerit
// ─────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "EL YAPIMI", "✦", "MANİSA ATÖLYESİ", "✦", "HAKİKİ DERİ", "✦",
    "SINIRLI ÜRETİM", "✦", "TÜRKİYE'YE ÜCRETSİZ KARGO", "✦",
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="uy-marquee" aria-hidden="true">
      <div className="uy-marquee-track">
        {row.map((t, i) => (
          <span key={i} className={t === "✦" ? "uy-mark" : "uy-mword"}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="uy-about" id="hikaye">
      <Reveal className="uy-about-text">
        <span className="uy-eyebrow">— ÜLKÜ YAMAN HAKKINDA</span>
        <h2 className="uy-display">
          Gündelik fonksiyonun içinde <em>heykelsi formu</em> arayan ayakkabılar.
        </h2>
        <p>
          Manisa'daki atölyemizde, sertifikalı hakiki deri ile bağımsız ustalar tarafından
          elle üretilir. Sade, ölçülü, ama ayırt edilebilir bir estetiği savunuyoruz —
          modern hayatın ritmiyle doğal şekilde hareket eden parçalar.
        </p>
      </Reveal>

      <div className="uy-about-grid">
        <Reveal delay={0.1} className="uy-about-img is-tall">
          <img src={IMG.about1} alt=""/>
        </Reveal>
        <Reveal delay={0.2} className="uy-about-img is-short">
          <img src={IMG.about2} alt=""/>
          <div className="uy-about-tag">
            <span>FW · 24</span>
            <span>Manisa, TR</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT GRID — sürüklenebilir / draggable
// ─────────────────────────────────────────────────────────────
function ProductGrid() {
  const [tab, setTab] = useState("best");
  const trackRef = useRef(null);
  const items = tab === "best" ? PRODUCTS : [...PRODUCTS].reverse();

  // drag-to-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let isDown = false, startX = 0, startScroll = 0;
    const down = (e) => {
      isDown = true; el.classList.add("is-grabbing");
      startX = (e.touches?.[0]?.pageX ?? e.pageX) - el.offsetLeft;
      startScroll = el.scrollLeft;
    };
    const up = () => { isDown = false; el.classList.remove("is-grabbing"); };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.touches?.[0]?.pageX ?? e.pageX) - el.offsetLeft;
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

  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="uy-shop" id="yeni" data-screen-label="02 Shop">
      <Reveal className="uy-shop-head">
        <div className="uy-tabs">
          <button className={tab === "best" ? "is-active" : ""} onClick={() => setTab("best")}>ÇOK SATANLAR</button>
          <button className={tab === "new" ? "is-active" : ""} onClick={() => setTab("new")}>YENİ GELENLER</button>
        </div>
        <div className="uy-shop-nudge">
          <span className="uy-hint">SÜRÜKLE</span>
          <button onClick={() => nudge(-1)} aria-label="Önceki">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => nudge(1)} aria-label="Sonraki">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </Reveal>

      <div className="uy-shop-track" ref={trackRef}>
        {items.map((p, i) => (
          <a key={p.id} href="#" className="uy-card" style={{ "--i": i }}>
            <div className="uy-card-img">
              <img src={p.img} alt={p.name} draggable="false"/>
              <span className="uy-card-num">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="uy-card-meta">
              <span className="uy-card-name">{p.name}</span>
              <span className="uy-card-price">₺{p.price.toLocaleString("tr-TR")}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// STICKY ATELIER — sticky-scroll editorial
// ─────────────────────────────────────────────────────────────
function Atelier() {
  const stepsRef = useRef(null);
  const [active, setActive] = useState(0);
  const steps = [
    { n: "01", t: "DERİ SEÇİMİ", b: "Sertifikalı tabakhanelerden gelen sebze tabaklı dana derisi. Her parça elle inceleniyor; doku, esneklik, renk uyumu için." , img: IMG.craft1 },
    { n: "02", t: "KESİM & ŞABLON", b: "Heykelsi siluet, milimetrik şablonlarla başlıyor. Bir usta her gün yalnızca on çift kesebilir.", img: IMG.craft2 },
    { n: "03", t: "EL DİKİŞİ", b: "Saten dikiş ve elle çakılan tabanlar — ayağa zamanla şekil veren, yumuşayan bir his. Manisa'da, üç ustanın imzasıyla.", img: IMG.craft3 },
  ];

  useEffect(() => {
    const onScroll = () => {
      const el = stepsRef.current;
      if (!el) return;
      const children = [...el.querySelectorAll("[data-step]")];
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
              <img
                key={s.n}
                src={s.img}
                alt={s.t}
                className={`uy-atelier-img ${i === active ? "is-active" : ""}`}
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
          <a href="#" className="uy-cta uy-cta-dark">
            ATÖLYEYİ KEŞFET
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────
function Categories() {
  const cats = [
    { t: "TÜM SANDALETLER", sub: "01 — Koleksiyon", img: IMG.cat1, cta: "Tümünü İncele" },
    { t: "YENİ GELENLER", sub: "02 — SS26", img: IMG.cat2, cta: "Yeni Sezon" },
    { t: "İNDİRİM", sub: "03 — Sezon Sonu", img: IMG.cat3, cta: "Fırsatları Gör" },
  ];
  return (
    <section className="uy-cats" id="sandaletler">
      <Reveal className="uy-cats-head">
        <span className="uy-eyebrow">— KOLEKSİYONU KEŞFET</span>
        <h2 className="uy-display">Üç giriş, bir koleksiyon.</h2>
      </Reveal>
      <div className="uy-cats-grid">
        {cats.map((c, i) => (
          <Reveal key={c.t} delay={i * 0.08} className="uy-cat">
            <div className="uy-cat-img">
              <img src={c.img} alt={c.t}/>
            </div>
            <div className="uy-cat-meta">
              <div>
                <span className="uy-cat-sub">{c.sub}</span>
                <span className="uy-cat-name">{c.t}</span>
              </div>
              <span className="uy-cat-cta">{c.cta} →</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
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
            <p className="uy-display"><span className="uy-mark-q">“</span>{t.quote}<span className="uy-mark-q">”</span></p>
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
          <button key={i} className={i === idx ? "is-active" : ""} onClick={() => setIdx(i)} aria-label={`Yorum ${i+1}`}/>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// JOURNAL + NEWSLETTER
// ─────────────────────────────────────────────────────────────
function JournalAndNewsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="uy-foot-feature">
      <Reveal className="uy-feat journal">
        <span className="uy-eyebrow">— GÜNCE</span>
        <h3 className="uy-display">Atölyeden notlar, sezon arasında.</h3>
        <p>Sezon kampanyaları, sınırlı sayıda üretilen parçalar ve atölye günlükleri için listemize katılın.</p>
        <a href="#" className="uy-cta">DEVAMINI OKU →</a>
      </Reveal>
      <Reveal delay={0.1} className="uy-feat newsletter">
        <span className="uy-eyebrow">— BÜLTEN</span>
        <h3 className="uy-display">Yeni siluetlere ilk siz erişin.</h3>
        <form className="uy-news-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <input
            type="email"
            placeholder={sent ? "Listemize katıldınız ✓" : "E-posta adresiniz"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
            required
          />
          <button type="submit" disabled={sent}>{sent ? "GÖNDERİLDİ" : "ABONE OL"}</button>
        </form>
        <span className="uy-fineprint">Üye olarak Gizlilik Politikamızı kabul etmiş olursunuz.</span>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="uy-footer">
      <div className="uy-footer-top">
        <div className="uy-footer-brand">
          <span className="uy-display-lg">Ülkü Yaman</span>
          <p>Manisa atölyemizde el yapımı, hakiki deri kadın sandaletleri. Sade, dayanıklı, ayırt edilebilir.</p>
          <div className="uy-social">
            <a href="#">IG</a><span>·</span><a href="#">PINTEREST</a>
          </div>
        </div>
        <div className="uy-footer-cols">
          <div>
            <h4>Alışveriş</h4>
            <a href="#">Tüm Sandaletler</a>
            <a href="#">Yeni Gelenler</a>
            <a href="#">İndirimde</a>
            <a href="#">Çok Satanlar</a>
          </div>
          <div>
            <h4>Yardım</h4>
            <a href="#">İletişim</a>
            <a href="#">Hakkımızda</a>
            <a href="#">Teslimat & İade</a>
            <a href="#">Mesafeli Satış</a>
          </div>
          <div>
            <h4>İletişim</h4>
            <a href="tel:+905074530166">+90 507 453 01 66</a>
            <a href="mailto:info@ulkuyamancollection.com">info@ulkuyamancollection.com</a>
            <span>Güzelyurt Mah. 5749 Sok. No: 10/A<br/>Yunusemre / Manisa</span>
          </div>
        </div>
      </div>
      <div className="uy-footer-bot">
        <span>© {new Date().getFullYear()} Ülkü Yaman Collection. Tüm hakları saklıdır.</span>
        <div>
          <a href="#">Gizlilik</a>
          <a href="#">KVKK</a>
          <a href="#">Çerezler</a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// TWEAKS PANEL
// ─────────────────────────────────────────────────────────────
function Tweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tokens to :root
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--bg-cream", tweaks.bgCream);
    r.style.setProperty("--paper", tweaks.paper);
    r.style.setProperty("--ink", tweaks.ink);
    r.style.setProperty("--muted", tweaks.muted);
    r.style.setProperty("--stone-soft", tweaks.stoneSoft);
    r.style.setProperty("--stone", tweaks.stone);
    r.style.setProperty("--accent", tweaks.accent);
    r.style.setProperty("--font-display", tweaks.displayFont);
    r.style.setProperty("--font-sans", tweaks.sansFont);
  }, [tweaks]);

  const PRESETS = [
    { name: "Warm Cream (önerilen)", v: { bgCream:"#f6f1e8", paper:"#fbf8f2", ink:"#1a1410", stoneSoft:"#ece4d4", stone:"#d9cdb6", accent:"#7a5a3a", muted:"#8a7d6b" } },
    { name: "Saf Beyaz (klasik)", v: { bgCream:"#ffffff", paper:"#fafaf8", ink:"#0a0a0a", stoneSoft:"#f1efe9", stone:"#e3ddce", accent:"#1a1410", muted:"#7a7468" } },
    { name: "Bronz Mood", v: { bgCream:"#f3ece0", paper:"#f9f3e7", ink:"#241810", stoneSoft:"#e8dcc5", stone:"#c9b393", accent:"#8c5a2a", muted:"#7d6a52" } },
    { name: "Stone & Ink", v: { bgCream:"#eeeae3", paper:"#f5f2ec", ink:"#181818", stoneSoft:"#dcd6c8", stone:"#b9b09c", accent:"#3a3026", muted:"#6f685c" } },
  ];

  return (
    <TweaksPanel title="Tweaks" defaultOpen={false}>
      <TweakSection title="Hızlı Palet">
        <div style={{ display:"grid", gap:6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setTweak(p.v)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                background:"#fff", border:"1px solid #e6e2d8", borderRadius:6,
                cursor:"pointer", fontSize:12, color:"#1a1410", textAlign:"left"
              }}
            >
              <span style={{ display:"flex", gap:3 }}>
                <span style={{ width:14, height:14, background:p.v.bgCream, border:"1px solid #ddd6c8" }}/>
                <span style={{ width:14, height:14, background:p.v.stone }}/>
                <span style={{ width:14, height:14, background:p.v.accent }}/>
                <span style={{ width:14, height:14, background:p.v.ink }}/>
              </span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Renkler">
        <TweakColor label="Arka plan (krem)" value={tweaks.bgCream} onChange={(v) => setTweak("bgCream", v)}/>
        <TweakColor label="Yüzey (paper)" value={tweaks.paper} onChange={(v) => setTweak("paper", v)}/>
        <TweakColor label="Mürekkep (ink)" value={tweaks.ink} onChange={(v) => setTweak("ink", v)}/>
        <TweakColor label="Taş yumuşak" value={tweaks.stoneSoft} onChange={(v) => setTweak("stoneSoft", v)}/>
        <TweakColor label="Taş" value={tweaks.stone} onChange={(v) => setTweak("stone", v)}/>
        <TweakColor label="Aksan" value={tweaks.accent} onChange={(v) => setTweak("accent", v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="uy-root">
      <Navbar/>
      <main>
        <Hero/>
        <Marquee/>
        <About/>
        <ProductGrid/>
        <Atelier/>
        <Categories/>
        <Testimonials/>
        <JournalAndNewsletter/>
      </main>
      <Footer/>
      <Tweaks/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
