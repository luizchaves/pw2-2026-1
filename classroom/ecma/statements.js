const number = 10;

// if statement
// Truthy and falsy values
// Falsy values: false, 0, -0, 0n, '', null, undefined, NaN
// Truthy values: !Falsy values
if (number > 0) console.log('Positive number');

if (number > 0) {
  console.log('Positive number');
}

// else statement
if (number > 0) {
  console.log('Positive number');
} else {
  console.log('Non-positive number');
}

// else if statement
if (number > 0) {
  console.log('Positive number');
} else if (number < 0) {
  console.log('Negative number');
} else {
  console.log('Zero');
}

// ternary operator (condition ? exprIfTrue : exprIfFalse)
// number > 0 ? 'Positive number' : 'Non-positive number'
// If truthy, return 'Positive number'
// If falsy, return 'Non-positive number'
const result = number > 0 ? 'Positive number' : 'Non-positive number';
console.log(result);

// switch statement
const number1 = 1;
const number2 = 2;
const operator = '%'; // operator can be '+', '-', '*', '/'

if (operator === '+') {
  console.log(number1 + number2);
} else if (operator === '-') {
  console.log(number1 - number2);
} else if (operator === '*') {
  console.log(number1 * number2);
} else if (operator === '/') {
  console.log(number1 / number2);
} else {
  console.log('Invalid operator');
}

switch (operator) {
  case '+':
    console.log(number1 + number2);
    break;
  case '-':
    console.log(number1 - number2);
    break;
  case '*':
    console.log(number1 * number2);
    break;
  case '/':
    console.log(number1 / number2);
    break;
  default:
    console.log('Invalid operator');
}

switch (true) {
  case number > 0:
    console.log('Positive number');
    break;
  case number < 0:
    console.log('Negative number');
    break;
  default:
    console.log('Zero');
}

// while statement
let count = 1;
while (count <= 10) {
  console.log(count);
  count++; //count += 1; count = count + 1;
}

// do...while statement
count = 1;
do {
  console.log(count);
  count++;
} while (count <= 10);

// for statement
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// TODO
console.log(`
00, 01, 02, 03, 04, 05, 06, 07, 08, 09,
10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
90, 91, 92, 93, 94, 95, 96, 97, 98, 99
`);

let numbers = '';

for (let count = 0; count < 100; count++) {
  numbers += count < 10 ? '0' + count : count;

  if (count < 99) {
    numbers += ',';
  }

  // if (String(count).at(-1) === '9') {
  //   numbers += '\n'
  // } else {
  //   numbers += ' '
  // }

  // if ((count + 1) % 10 === 0) {
  //   numbers += '\n'
  // } else {
  //   numbers += ' '
  // }

  if (count % 10 === 9) {
    numbers += '\n'
  } else {
    numbers += ' '
  }
}

console.log(numbers)

numbers = '';

for (let decimal = 0; decimal <= 9; decimal++) {
  for (let unit = 0; unit <= 9; unit++) {
    numbers += `${decimal}${unit}`;

    if (unit === 9 && decimal !== 9) {
      numbers += ',\n';
    } else if (unit !== 9) {
      numbers += ', ';
    }
  }
}

console.log(numbers);
