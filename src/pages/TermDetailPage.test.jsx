// src/pages/TermDetailPage.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TermDetailPage } from './TermDetailPage';
import { LanguageProvider } from '../i18n/LanguageContext';
import { getTrackProgress } from '../lib/progress';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/data-engineering/etl']}>
      <LanguageProvider>
        <Routes>
          <Route path="/:trackId/:termId" element={<TermDetailPage />} />
        </Routes>
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
});
