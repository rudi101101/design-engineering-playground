import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderPage() {
  render(
    <MemoryRouter>
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a card for each track', () => {
    renderPage();
    expect(screen.getByText('Data Engineering')).toBeInTheDocument();
  });

  it('shows 0 XP when nothing has been learned yet', () => {
    renderPage();
    expect(screen.getByText('0 XP')).toBeInTheDocument();
  });
});
