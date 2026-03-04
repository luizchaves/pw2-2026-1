// Primitive
// String, Number, Boolean, Null, Undefined, Symbol

// Null
console.log(null);

// Undefined
console.log(undefined);

// String
console.log("Hello, World!");
console.log('Hello, World!');
// Template literals
console.log(`Hello, ${1 + 1}`); // interpolation
console.log(`Hello,
  World!`);

// Number
console.log(-15);
console.log(15);
console.log(0b1111);
console.log(0o17);
console.log(0xF);
console.log(3.14);
console.log(Math.PI);
console.log(314e-2);
console.log(0 / 0); // NaN, Number.NaN
console.log(1 / 0); // Infinity, Number.POSITIVE_INFINITY
console.log(-1 / 0); // -Infinity, Number.NEGATIVE_INFINITY
// BigInt
console.log(9007199254740991n);
// IEEE 754
console.log(0.1 + 0.2); // 0.30000000000000004

// Object
// Object, Array, Function, Date, RegExp, etc.

console.log([]);
console.log([1, 2, 3]);
console.log([1, , 3]);
console.log([1010, 'Fulano', true, ['PW2', 'ER']]);

// JSON
console.log({ id: 1010, name: 'Fulano', active: true, courses: ['PW2', 'ER'] });
