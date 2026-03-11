export function areaOfCircle(radius) {
  if (typeof radius !== 'number') {
    return NaN;
  }
  return Math.PI * radius ** 2;
}
