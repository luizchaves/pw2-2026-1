// let, const, var

// 'const' declarations must be initialized.
// const number;
const number = 42;
console.log(number); // 42

// TypeError: Assignment to constant variable.
// number += 10;
// console.log(number);

// TypeError: Assignment to constant variable.
// number = 100;

console.log(number);

const numbers = [];
numbers.push(1);
numbers.push(2);
console.log(numbers); // [1, 2]

// Cannot redeclare block-scoped variable 'numbers'.
// const numbers = 10;

let variable;
console.log(variable); // undefined

variable = 100;

variable += 50;
console.log(variable); // 150
