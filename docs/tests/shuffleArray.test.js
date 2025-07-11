import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../src/utils/shuffleArray.js';

describe('shuffleArray', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toHaveLength(arr.length);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });
});
