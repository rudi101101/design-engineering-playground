import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

function Consumer() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to "id"', () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('id');
  });

  it('toggles between id and en and persists to localStorage', () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(localStorage.getItem('language')).toBe('en');
  });
});
