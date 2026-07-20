import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const STRINGS = {
  id: {
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
    backLink: '← Kembali ke beranda',
  },
  en: {
    title: 'Page not found',
    body: "The page you're looking for doesn't exist or has moved.",
    backLink: '← Back to home',
  },
};

export function NotFoundPage() {
  const { language } = useLanguage();
  const t = STRINGS[language];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-heading font-bold text-ink mb-2">{t.title}</h1>
      <p className="text-body text-slate-gray mb-6">{t.body}</p>
      <Link to="/" className="text-indigo-primary text-label font-semibold">
        {t.backLink}
      </Link>
    </div>
  );
}
