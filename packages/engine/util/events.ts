export function event<T>(cb: (event: Event, scope: T) => void, scope?: T) {
  return `(${cb.toString()})(event, ${JSON.stringify(scope)})`;
}
