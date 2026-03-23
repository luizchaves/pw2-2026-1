import { sum, sumOdds, product } from './lib.js';
import { describe, it } from 'node:test';
import asserts from 'node:assert';

describe('sum()', () => {
  it('should return the sum of all arguments', () => {
    asserts.equal(sum(1, 2, 3), 6);
    asserts.equal(sum(2, 2, 2), 6);
    asserts.equal(sum(1, 2, 3, 4, 5, 6), 21);
  });
});

describe('sumOdds()', () => {
  it('should return the sum of all odd arguments', () => {
    asserts.equal(sumOdds(1, 2, 3), 4);
    asserts.equal(sumOdds(2, 2, 2), 0);
    asserts.equal(sumOdds(1, 2, 3, 4, 5, 6), 9);
  });
});

describe('product()', () => {
  it('should return the product of all arguments', () => {
    asserts.equal(product(1, 2, 3), 6);
    asserts.equal(product(2, 2, 2), 8);
    asserts.equal(product(1, 2, 3, 4, 5, 6), 720);
  });
});
