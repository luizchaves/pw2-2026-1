function sum(a, b) {
  return a + b;
}

console.log(sum(1, 1)); // 2
console.log(sum(2, 2)); // 4

function sumPromise(a, b) {
  // return new Promise((resolve, reject) => {
  //   if (typeof a !== 'number' || typeof b !== 'number') {
  //     reject(new Error('Both arguments must be numbers'));
  //   } else {
  //     resolve(a + b);
  //   }
  // });

  if (typeof a !== 'number' || typeof b !== 'number') {
    return Promise.reject(new Error('Both arguments must be numbers'));
  }

  return Promise.resolve(a + b);
}

console.log(sumPromise(3, 3));
// Promise {[[PromiseState]]: 'fulfilled', [[PromiseResult]]: 6}
sumPromise(3, 3).then((result) => console.log(result)); // 6

console.log(sumPromise(3, '3'));
// Promise {[[PromiseState]]: 'rejected', [[PromiseResult]]: Error: Both arguments must be numbers}
sumPromise(3, '3').catch((error) => console.error(error.message)); // Both arguments must be numbers

const result = sumPromise(4, 4);
console.log(result);
// Promise {[[PromiseState]]: 'fulfilled', [[PromiseResult]]: 8}

sumPromise(4, 4)
  .then((result) => console.log(result))
  .catch((error) => console.error(error.message)); // Both arguments must be numbers

// 5 + 5
// r + 5
sumPromise(5, 5)
  .then((result) => sumPromise(result, 5))
  .then((result) => console.log(result)) // 15
  .catch((error) => console.error(error.message));

async function sumAsync(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  return a + b;
}

sumAsync(6, 6)
  .then((result) => console.log(result)) // 12
  .catch((error) => console.error(error.message));

async function main() {
  try {
    const result = await sumAsync(7, 7);
    console.log(result); // 14
  } catch (error) {
    console.error(error.message);
  }
}

main();

try {
  const result = await sumAsync(8, 8);
  console.log(result); // 16
} catch (error) {
  console.error(error.message);
}

// Promise<number>[]
const sums = [sumAsync(9, 9), sumAsync(10, 10), sumAsync(11, 11)];
const values = await Promise.all(sums);
console.log(values); // [18, 20, 22]

// map, filter, reduce with async functions
const numbers = [1, 2, 3, 4, 5];

// map
const squares = await Promise.all(numbers.map((n) => sumAsync(n, n)));
console.log(squares); // [2, 4, 6, 8, 10]

// filter
const evenNumbers = await Promise.all(
  numbers.map(async (n) => {
    const isEven = await sumAsync(n % 2, 0);
    return isEven === 0 ? n : null;
  })
);
console.log(evenNumbers.filter((n) => n !== null)); // [2, 4]

// reduce
const total = await numbers.reduce(async (accPromise, n) => {
  const acc = await accPromise;
  const sum = await sumAsync(acc, n);
  return sum;
}, Promise.resolve(0));
console.log(total); // 15
