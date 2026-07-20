import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrackById } from '../content';
import { useLanguage } from '../i18n/LanguageContext';
import { TermCard } from '../components/TermCard';

export function TrackListPage() {
  const { trackId } = useParams();
  const { language } = useLanguage();
  const track = getTrackById(trackId);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = useMemo(
    () => ['All', ...new Set(track.terms.map((term) => term.category))],
    [track]
  );

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return track.terms.filter((term) => {
      if (!query) return true;
      return term.name[language].toLowerCase().includes(query);
    });
  }, [track, search, language]);

  const termsByCategory = useMemo(() => {
    const groups = {};
    for (const term of filteredTerms) {
      if (activeCategory !== 'All' && term.category !== activeCategory) continue;
      groups[term.category] = groups[term.category] || [];
      groups[term.category].push(term);
    }
    return groups;
  }, [filteredTerms, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-heading font-bold text-ink mb-4">{track.name}</h1>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari term..."
        className="w-full rounded-input border border-hairline-border px-4 py-2 mb-4 text-body"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 rounded-pill text-label font-semibold ${
              activeCategory === category
                ? 'bg-indigo-wash text-indigo-primary'
                : 'bg-pure-white border border-hairline-border text-slate-gray'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {Object.entries(termsByCategory).map(([category, terms]) => (
        <section key={category} className="mb-8">
          <h2 className="text-section-title font-bold text-ink mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {terms.map((term) => (
              <TermCard key={term.id} term={term} trackId={track.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
