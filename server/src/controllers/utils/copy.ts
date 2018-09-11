export function copy<T>(obj: T): T {
  return Object.assign({}, obj);
}
