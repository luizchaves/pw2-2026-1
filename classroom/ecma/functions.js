// function declaration
function sum(a, b) {
  return a + b;
}

// anonymous function
// function expression
const subtract = function (a, b) {
  return a - b;
};

// arrow function
const multiply = (a, b) => {
  return a * b;
};

// shorter arrow function
const divide = (a, b) => a / b;

// calling the functions
console.log(sum(2)); // NaN
console.log(sum(2, 1)); // 3
console.log(sum(2, 1, 1)); // 3
console.log(subtract(2, 1)); // 1
console.log(multiply(2, 1)); // 2
console.log(divide(2, 1)); // 2

// function with default parameters
function power(base, exponent = 1) {
  return base ** exponent;
}

console.log(power(2)); // 2
console.log(power(2, 3)); // 8

// function with rest parameters
function sumAll(...numbers) {
  // return numbers.reduce((acc, num) => acc + num, 0);

  let total = 0;

  for (const num of numbers) {
    total += num;
  }

  return total;
}

console.log(sumAll(1, 2, 3)); // 6 | number = [1, 2, 3]
console.log(sumAll(1, 2, 3, 4, 5)); // 15 | number = [1, 2, 3, 4, 5]

// callback function
function calc(a, b, operation) {
  return operation(a, b);
}

console.log(calc(2, 1, sum)); // 3
console.log(calc(2, 1, subtract)); // 1
console.log(calc(2, 1, multiply)); // 2
console.log(calc(2, 1, divide)); // 2
console.log(calc(2, 1, power)); // 2
console.log(calc(2, 1, (base, exponent) => base ** exponent)); // 2
