import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('toggles progress text language when language button is clicked', () => {
    renderPage();

    // Confirm Indonesian text is shown by default
    expect(screen.getByText('0/2 dipelajari')).toBeInTheDocument();

    // Click language toggle button
    const toggleButton = screen.getByText(/^(ID|EN)$/);
    fireEvent.click(toggleButton);

    // Confirm English text is now shown
    expect(screen.queryByText('0/2 dipelajari')).not.toBeInTheDocument();
    expect(screen.getByText('0/2 learned')).toBeInTheDocument();
  });
});
