import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TrackListPage } from './TrackListPage';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';

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
    <MemoryRouter initialEntries={['/data-engineering']}>
      <LanguageProvider>
        <Routes>
          <Route path="/:trackId" element={<TrackListPage />} />
        </Routes>
        <LanguageToggle />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('TrackListPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows every category section when "All" is active', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Performa' })).toBeInTheDocument();
  });

  it('narrows to one category when its pill is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Pipeline' }));
    expect(screen.getByText('ETL — Extract, Transform, Load')).toBeInTheDocument();
    expect(screen.queryByText('Lapisan Cache (Caching Layers)')).not.toBeInTheDocument();
  });

  it('filters terms by search query', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Cari term...'), {
      target: { value: 'caching' },
    });
    expect(screen.queryByText('ETL — Extract, Transform, Load')).not.toBeInTheDocument();
    expect(screen.getByText('Lapisan Cache (Caching Layers)')).toBeInTheDocument();
  });

  it('shows language-aware chrome strings when language is toggled', () => {
    renderPage();

    // Confirm Indonesian strings by default
    expect(screen.getByPlaceholderText('Cari term...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();

    // Click language toggle
    const toggleButton = screen.getByText(/^(ID|EN)$/);
    fireEvent.click(toggleButton);

    // Confirm English strings are now shown
    expect(screen.queryByPlaceholderText('Cari term...')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search terms...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Semua' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });
});
