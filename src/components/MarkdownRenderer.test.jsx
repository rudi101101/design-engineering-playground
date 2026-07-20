import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders bold text', () => {
    render(<MarkdownRenderer text="this is **bold**" />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('renders fenced code blocks via CodeBlock with a language label', () => {
    render(<MarkdownRenderer text={'```bash\necho hi\n```'} />);
    expect(screen.getByText('bash')).toBeInTheDocument();
    expect(screen.getByText('echo hi')).toBeInTheDocument();
  });
});
