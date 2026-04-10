import Image from "next/image";
import { signIn } from "@/auth";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Google bağlantısı başlatılamadı.",
  OAuthCallback: "Google'dan geri dönüşte hata oluştu.",
  OAuthCreateAccount: "Hesap oluşturulamadı. Veritabanı bağlantısını kontrol edin.",
  EmailCreateAccount: "Email ile hesap oluşturulamadı.",
  Callback: "Giriş callback hatası.",
  OAuthAccountNotLinked: "Bu email başka bir yöntemle kayıtlı.",
  default: "Giriş sırasında bir hata oluştu.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="min-h-[80vh] grid md:grid-cols-2">
      {/* Sol - görsel */}
      <div className="hidden md:block relative bg-gray-100">
        <Image
          src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=85"
          alt="Ülkü Yaman Collection"
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-12">
          <h2 className="text-white text-3xl font-light leading-snug">
            Hakiki Deri.<br />
            <span className="font-semibold">Gerçek Şıklık.</span>
          </h2>
        </div>
      </div>

      {/* Sağ - giriş formu */}
      <div className="flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-light tracking-wide mb-2">Hoş Geldiniz</h1>
            <p className="text-sm text-gray-500">
              Hesabınıza giriş yapın veya üye olun
            </p>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {ERROR_MESSAGES[error] || ERROR_MESSAGES.default}
              <span className="block mt-1 text-red-400">Kod: {error}</span>
            </div>
          )}

          {/* Google - Server Action ile */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3.5 text-sm font-medium hover:border-black hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Giriş Yap
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-4">
              güvenli giriş
            </div>
          </div>

          <div className="bg-gray-50 p-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Giriş yaparak{" "}
              <a href="/gizlilik" className="underline hover:text-black">Gizlilik Politikamızı</a>{" "}
              ve{" "}
              <a href="/sozlesme" className="underline hover:text-black">Kullanım Şartlarımızı</a>{" "}
              kabul etmiş olursunuz.
            </p>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-sm font-medium mb-4">Üye avantajları</h3>
            <div className="space-y-2">
              {[
                "Sipariş takibi ve geçmiş",
                "Kayıtlı adresler",
                "Favoriler listesi",
                "Özel kampanya bildirimleri",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
