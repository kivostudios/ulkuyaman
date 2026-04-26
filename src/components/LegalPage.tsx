import Link from "next/link";

export default function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <nav className="text-xs text-gray-400 mb-6 flex gap-2">
        <Link href="/" className="hover:text-black">Anasayfa</Link>
        <span>/</span>
        <span className="text-black">{title}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-3">{title}</h1>
      {updatedAt && (
        <p className="text-xs text-black/50 mb-10">Son güncelleme: {updatedAt}</p>
      )}
      <article className="prose prose-sm md:prose-base max-w-none text-black/85 leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-wide [&_h2]:uppercase [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:underline">
        {children}
      </article>
    </div>
  );
}
