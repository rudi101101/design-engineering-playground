import { describe, it, expect } from 'vitest';
import { validateTerms } from './validateContent';

function makeValidTerm(overrides = {}) {
  return {
    id: 'sample-term',
    track: 'data-engineering',
    category: 'Pipeline',
    color: '#3e5eea',
    icon: 'M0 0h24v24H0z',
    simulation: 'generic',
    tools: ['Spark'],
    prerequisites: [],
    related: [],
    name: { id: 'Contoh Term', en: 'Sample Term' },
    content: {
      description: { id: 'Deskripsi.', en: 'Description.' },
      concept: { id: 'Analogi.', en: 'Analogy.' },
      methodology: { id: 'Cara kerja.', en: 'How it works.' },
      objective: { id: 'Kenapa.', en: 'Why.' },
      goal: { id: 'Target.', en: 'Goal.' },
      exampleImplementation: { id: 'Contoh.', en: 'Example.' },
      exampleEnterprise: { id: 'Skenario.', en: 'Scenario.' },
      prosAndCons: {
        pros: { id: '- baik', en: '- good' },
        cons: { id: '- buruk', en: '- bad' },
      },
    },
    ...overrides,
  };
}

describe('validateTerms', () => {
  it('returns no errors or warnings for a fully valid term', () => {
    const { errors, warnings } = validateTerms([makeValidTerm()]);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('errors on duplicate ids', () => {
    const { errors } = validateTerms([makeValidTerm(), makeValidTerm()]);
    expect(errors).toContain('Duplicate term id: "sample-term"');
  });

  it('errors when a required scalar field is missing', () => {
    const term = makeValidTerm();
    delete term.color;
    const { errors } = validateTerms([term]);
    expect(errors).toContain('Term "sample-term" is missing required field: color');
  });

  it('errors when prerequisites reference a non-existent id', () => {
    const term = makeValidTerm({ prerequisites: ['does-not-exist'] });
    const { errors } = validateTerms([term]);
    expect(errors).toContain(
      'Term "sample-term" has prerequisites reference to unknown term id: "does-not-exist"'
    );
  });

  it('warns (not errors) when one language of a content field is empty', () => {
    const term = makeValidTerm();
    term.content.goal.en = '';
    const { errors, warnings } = validateTerms([term]);
    expect(errors).toEqual([]);
    expect(warnings).toContain(
      'Term "sample-term" field "content.goal" is missing an "en" translation'
    );
  });
});
