
export function isValueDefined<T>(value?: T): value is T {
  return value !== null && value !== undefined;
}
