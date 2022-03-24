export function* iterateObj<K extends keyof any, V>(
  obj: Record<K, V>,
): Generator<[K, V]> {
  for (const key in obj) {
    yield [key, obj[key]];
  }
}
