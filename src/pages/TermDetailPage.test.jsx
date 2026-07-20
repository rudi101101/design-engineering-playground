// src/pages/TermDetailPage.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TermDetailPage } from './TermDetailPage';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { getTrackProgress } from '../lib/progress';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button onClick={toggleLanguage}>
      {language === 'id' ? 'EN' : 'ID'}
    </button>
  );
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/data-engineering/etl']}>
      <LanguageProvider>
        <Routes>
          <Route path="/:trackId/:termId" element={<TermDetailPage />} />
        </Routes>
        <LanguageToggle />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('TermDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Overview content by default', () => {
    renderPage();
    expect(screen.getByText(/ETL adalah pola pemrosesan data klasik/)).toBeInTheDocument();
  });

  it('switches to Teknis tab content when clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Teknis' }));
    expect(screen.getByText(/Tiga tahap berurutan/)).toBeInTheDocument();
    expect(
      screen.queryByText(/ETL adalah pola pemrosesan data klasik/)
    ).not.toBeInTheDocument();
  });

  it('marks the term as seen and awards xp on mount', () => {
    renderPage();
    expect(getTrackProgress('data-engineering')).toEqual({ seen: ['etl'], xp: 10 });
  });

  it('shows language-aware chrome strings when language is toggled', () => {
    renderPage();

    // Confirm Indonesian strings by default
    expect(screen.getByRole('button', { name: 'Teknis' })).toBeInTheDocument();
    expect(screen.getByText(/Ilustrasi:/)).toBeInTheDocument();

    // Click language toggle
    const toggleButton = screen.getByText(/^(ID|EN)$/);
    fireEvent.click(toggleButton);

    // Confirm English strings are now shown
    expect(screen.queryByRole('button', { name: 'Teknis' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Technical' })).toBeInTheDocument();
    expect(screen.queryByText(/Ilustrasi:/)).not.toBeInTheDocument();
    expect(screen.getByText(/Illustration:/)).toBeInTheDocument();
  });
});
