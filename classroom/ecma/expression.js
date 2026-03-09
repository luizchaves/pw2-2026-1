// error: unary, binary, ternary operator
// console.log(20 - +++ 10 * 2);

// precedence: MDN Operator precedence and associativity
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table
// - precedence 11
// * precedence 12
console.log(20 - 10 * 2);

// associativity
// - precedence 11, associativity right-to-left
console.log(20 - 10 - 5);
// *, / precedence 12, associativity left-to-right
console.log(20 * 10 / 5);

// return value
1 + 1; // 2

// coercion
console.log('1' + 1); // '11', string concatenation
console.log('1' - 1); // 0, numeric subtraction, '1' coerced to 1
console.log(+'1'); // 1, unary plus, '1' coerced to 1
console.log(Number('1')); // 1, Number constructor, '1' coerced to 1

// equality operator
console.log(1 == 1); // true
console.log(1 === 1); // true
console.log(1 == '1'); // true, type coercion
console.log(1 === '1'); // false, strict equality, no type coercion

// bitwise operators
// 1 in binary: 0001
// 1 in binary: 0001
// 0001 &
// 0001
// -----
// 0001 (1 in decimal)
console.log(1 & 1); // 1, bitwise AND
// 2 in binary: 0010
// 0010 &
// 0001
// -----
// 0000
console.log(2 & 1); // 0, bitwise AND
// 3 in binary: 0011
// 0011 &
// 0001
// -----
// 0001
console.log(3 & 1); // 1, bitwise AND
// 4 in binary: 0100
// 0100 &
// 0001
// -----
// 0000
console.log(4 & 1); // 0, bitwise AND

// logical operators
console.log(true && true); // true
console.log(true && false); // false
console.log(false && false); // false
console.log(true || true); // true
console.log(true || false); // true
console.log(false || false); // false
console.log(!true); // false
console.log(!false); // true

let number;

// process number
// number = false;

console.log(number || 0);

// Nullish coalescing operator (??)
console.log(number ?? 0);

// Increment and decrement operators
console.log('Increment and decrement operators'); //
let count = 0;

// pós fixado
let x = count++;
console.log(x); // 0

// pré fixado
let y = ++count;
console.log(y); // 2

// console.log(++count++);
console.log((++count)++);

