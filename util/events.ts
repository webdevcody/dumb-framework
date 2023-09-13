export function event(cb: (event: Event) => void) {
  return `(${cb.toString()})(event)`;
}
