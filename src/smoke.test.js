import { describe, it, expect } from 'vitest';

describe('test runner smoke test', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
