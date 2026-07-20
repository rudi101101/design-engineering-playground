import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTermById, getTrackById } from '../content';
import { useLanguage } from '../i18n/LanguageContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { markTermSeen } from '../lib/progress';
import { NotFoundPage } from './NotFoundPage';

const TABS = ['overview', 'teknis', 'bisnis'];

const CHROME_STRINGS = {
  id: {
    tabs: { overview: 'Overview', teknis: 'Teknis', bisnis: 'Bisnis' },
    illustration: 'Ilustrasi',
    tools: 'Tools:',
    prerequisites: 'Prasyarat:',
    related: 'Terkait:',
  },
  en: {
    tabs: { overview: 'Overview', teknis: 'Technical', bisnis: 'Business' },
    illustration: 'Illustration',
    tools: 'Tools:',
    prerequisites: 'Prerequisites:',
    related: 'Related:',
  },
};

export function TermDetailPage() {
  const { trackId, termId } = useParams();
  const { language } = useLanguage();
  const track = getTrackById(trackId);
  const term = track ? getTermById(termId) : undefined;
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (track && term) {
      markTermSeen(trackId, termId);
    }
  }, [trackId, termId, track, term]);

  const index = track ? track.terms.findIndex((t) => t.id === termId) : -1;
  const prevTerm = track ? track.terms[index - 1] : undefined;
  const nextTerm = track ? track.terms[index + 1] : undefined;

  if (!track || !term) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/${trackId}`} className="text-label text-slate-gray">
        ← {track.name} / {term.category}
      </Link>
      <h1 className="text-heading font-bold text-ink mt-2">{term.name[language]}</h1>

      <div className="rounded-notification-card bg-hairline-border/40 h-40 flex items-center justify-center my-6 text-slate-gray text-label">
        {CHROME_STRINGS[language].illustration}: {term.simulation}
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-button text-label font-semibold ${
              activeTab === tab ? 'bg-indigo-wash text-indigo-primary' : 'text-slate-gray'
            }`}
          >
            {CHROME_STRINGS[language].tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <MarkdownRenderer text={term.content.description[language]} />
          <MarkdownRenderer text={term.content.concept[language]} />
          <MarkdownRenderer text={term.content.objective[language]} />
          <MarkdownRenderer text={term.content.goal[language]} />
        </div>
      )}
      {activeTab === 'teknis' && (
        <div>
          <MarkdownRenderer text={term.content.methodology[language]} />
          <MarkdownRenderer text={term.content.exampleImplementation[language]} />
        </div>
      )}
      {activeTab === 'bisnis' && (
        <div>
          <MarkdownRenderer text={term.content.exampleEnterprise[language]} />
          <MarkdownRenderer text={term.content.prosAndCons.pros[language]} />
          <MarkdownRenderer text={term.content.prosAndCons.cons[language]} />
        </div>
      )}

      <div className="mt-8 text-label text-slate-gray space-y-1">
        <p><strong className="text-ink">{CHROME_STRINGS[language].tools}</strong> {term.tools.join(', ')}</p>
        {term.prerequisites.length > 0 && (
          <p><strong className="text-ink">{CHROME_STRINGS[language].prerequisites}</strong> {term.prerequisites.join(', ')}</p>
        )}
        {term.related.length > 0 && (
          <p><strong className="text-ink">{CHROME_STRINGS[language].related}</strong> {term.related.join(', ')}</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        {prevTerm ? (
          <Link to={`/${trackId}/${prevTerm.id}`} className="text-indigo-primary text-label">
            ← {prevTerm.name[language]}
          </Link>
        ) : (
          <span />
        )}
        {nextTerm ? (
          <Link to={`/${trackId}/${nextTerm.id}`} className="text-indigo-primary text-label">
            {nextTerm.name[language]} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
