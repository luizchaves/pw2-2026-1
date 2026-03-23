export function sum(...values) {
  return values.reduce((acc, val) => acc + val, 0);
}

export function sumOdds(...values) {
  return values.filter(val => val & 1).reduce((acc, val) => acc + val, 0);
}

export function product(...values) {
  return values.reduce((acc, val) => acc * val, 1);
}
