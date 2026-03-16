const names = ['Alice', 'Bob', 'Charlie'];
console.log(names[0]); // 'Alice'

// multiple types
const person = [2025100001, 'Alice', true, ['alice@email.com', 'alice@academico.ifpb.edu.br']];
console.log(person[1]); // 'Alice'
console.log(person[3]); // ['alice@email.com', 'alice@academico.ifpb.edu.br']
console.log(person[3][1]); // 'alice@academico.ifpb.edu.br'

// spread operator
let student = person.concat(['PW2', 'ED']);
student = [...person, ['PW2', 'ED']];
console.log(Math.min(10, 20, 30)); // 10
console.log(Math.min([10, 20, 30])); // NaN
console.log(Math.min(...[10, 20, 30])); // 10

// destructuring assignment
// const id = student[0];
// const name = student[1];
// const isActive = student[2];
// const emails = student[3];

// const [id, name, isActive, emails] = [2025100001, 'Alice', true, ['alice@email.com', 'alice@academico.ifpb.edu.br'], ['PW2', 'ED']];
const [id, name, isActive] = student;
console.log(id); // 2025100001
console.log(name); // 'Alice'
console.log(isActive); // true

// loops
numbers = [1, 2, 3];

for (let i = 0; i < numbers.length; i++) {
  console.log(i, numbers[i]);
}

for (const number of numbers) {
  console.log(number);
}

for (const index in numbers) {
  console.log(index, numbers[index]);
}

// [[0, 1], [1, 2], [2, 3]]
for (const [index, number] of numbers.entries()) {
  console.log(index, number);
}

// mutator: push, pop, shift, unshift, splice
let numbers = [1, 2, 3];
console.log(numbers); // [1, 2, 3]

numbers = [];
console.log(numbers); // []
console.log(numbers[0]); // undefined

numbers[0] = 1;
console.log(numbers); // [1]

numbers.push(2);
console.log(numbers); // [1, 2]

numbers.unshift(0);
console.log(numbers); // [0, 1, 2]

console.log(numbers.length); // 3
console.log(numbers[numbers.length - 1]); // 2
console.log(numbers.at(-1)); // 2

console.log(numbers); // [0, 1, 2]
console.log(numbers.pop()); // 2
console.log(numbers); // [0, 1]
console.log(numbers.shift()); // 0
console.log(numbers); // [1]

numbers = [1, 2, 3, 4, 5];
console.log(numbers); // [1, 2, 3, 4, 5]
numbers.splice(2, 1);
console.log(numbers); // [1, 2, 4, 5]

// accessor: slice, concat, join, indexOf, includes
numbers = [1, 2, 3, 4, 5];

console.log(numbers.slice(1, 4)); // [2, 3, 4]
console.log(numbers.slice(1)); // [2, 3, 4, 5]

console.log([1, 2].concat([3, 4])); // [1, 2, 3, 4]

console.log(['a', 'b', 'c'].join('-')); // 'a-b-c'
console.log(['a', 'b', 'c'].join('')); // 'abc'

console.log([10, 20, 30].indexOf(20)); // 1
console.log([10, 20, 30].indexOf(40)); // -1

console.log([10, 20, 30].includes(20)); // true
console.log([10, 20, 30].includes(40)); // false

// functional programming
// iteration: forEach, map, filter, reduce
numbers = [1, 2, 3, 4, 5];

numbers.forEach((number, index) => {
  console.log(index, number);
});

// f(x) = 2x

// array numbers
// [1, 2, 3, 4, 5]
// (x) => 2 * x
// [2, 4, 6, 8, 10]
console.log(numbers.map((number) => 2 * number)); // [2, 4, 6, 8, 10]

Array.prototype.myMap = (callback) => {
  const array = this;
  const result = [];

  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }

  return result;
}

numbers = [1, 2, 3, 4, 5];
console.log(numbers.myMap((number) => 2 * number)); // [2, 4, 6, 8, 10]


numbers = [1, 2, 3, 4, 5];
numbers.filter((number) => number % 2 === 0); // [2, 4]

numbers = [1, 2, 3, 4, 5];
// const isOdd = (number) => number % 2 === 1;
const isOdd = (number) => number & 1;
console.log(numbers.filter(isOdd)); // [1, 3, 5]


numbers = [1, 2, 3, 4, 5];
const isGreaterThan10 = (number) => number > 10;
console.log(numbers.filter(isGreaterThan10)); // []
const isLessThan10 = (number) => number < 10;
console.log(numbers.filter(isLessThan10)); // [1, 2, 3, 4, 5]

numbers.some(isOdd); // true
numbers.every(isOdd); // false

numbers = [1, 2, 3, 4, 5];
// f(x, y) = x + y
// (accumulator, current) => accumulator + current
// accumulator | current | result
// 0           | 1       | 1
// 1           | 2       | 3
// 3           | 3       | 6
// 6           | 4       | 10
// 10          | 5       | 15
let sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// (accumulator, current) => accumulator + current
// accumulator | current | result
// 1           | 2       | 3
// 3           | 3       | 6
// 6           | 4       | 10
// 10          | 5       | 15
sum = numbers.reduce((accumulator, current) => accumulator + current);
console.log(sum); // 15
