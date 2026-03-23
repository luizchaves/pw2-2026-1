console.log('Hello, World!');
console.log("Hello, World!");
console.log(`Hello, World!`);

const name = 'Alice';
console.log('Hello, ' + name + '!');
console.log(`Hello, ${name}!`);

const email = 'alice@email.com';

console.log('<tr><td>' + name + '</td><td>' + email + '</td></tr>');
console.log(`
  <tr>
    <td>${name}</td>
    <td>${email}</td>
  </tr>
`);

// Object String
console.log(email); // alice@email.com
console.log(email.length); // 15

console.log(email.includes('@')); // true
console.log(email.startsWith('alice')); // true
console.log(email.endsWith('.com')); // true
console.log(email.toUpperCase()); // ALICE@EMAIL.COM
console.log(email.toLowerCase()); // alice@email.com

console.log(email.split('@')); // ['alice', 'email.com']
const [username] = email.split('@');
console.log(username); // alice

console.log(email.replace('alice', 'bob')); // bob@email.com
console.log(String(2).padStart(3, '0')); // 002
