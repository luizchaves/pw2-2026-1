import { describe, test } from 'node:test';
import assert from 'node:assert';
import { areaOfCircle } from './lib.js';

describe('areaOfCircle()', () => {
  describe('cenários válidos', () => {
    test('calcula a área de um círculo com raio 10', () => {
      const result = areaOfCircle(10);
      assert.strictEqual(result, 314.1592653589793);
    });

    test('calcula a área de um círculo com raio 1', () => {
      const result = areaOfCircle(1);
      assert.strictEqual(result, 3.141592653589793);
    });

    test('calcula a área de um círculo com raio 0', () => {
      const result = areaOfCircle(0);
      assert.strictEqual(result, 0);
    });

    test('calcula a área de um círculo com raio 5', () => {
      const result = areaOfCircle(5);
      assert.strictEqual(result, 78.53981633974483);
    });

    test('calcula a área de um círculo com raio decimal 2.5', () => {
      const result = areaOfCircle(2.5);
      assert.strictEqual(result, 19.634954084936208);
    });

    test('calcula a área de um círculo com raio muito pequeno 0.1', () => {
      const result = areaOfCircle(0.1);
      assert.strictEqual(result, 0.031415926535897934);
    });
  });

  describe('cenários de estresse - valores inválidos', () => {
    test('retorna NaN quando recebe uma string', () => {
      const result = areaOfCircle('10');
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe uma string não numérica', () => {
      const result = areaOfCircle('texto');
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe null', () => {
      const result = areaOfCircle(null);
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe undefined', () => {
      const result = areaOfCircle(undefined);
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe um objeto', () => {
      const result = areaOfCircle({});
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe um array', () => {
      const result = areaOfCircle([]);
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe um array com valores', () => {
      const result = areaOfCircle([1, 2, 3]);
      assert.ok(isNaN(result));
    });

    test('retorna NaN quando recebe uma função', () => {
      const result = areaOfCircle(() => { });
      assert.ok(isNaN(result));
    });
  });
});
