export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

export function createStore<T extends Record<string, any>>(initialState: T) {
  // Create an object to store event handlers
  // const eventHandlers: Record<keyof T, ((...args: any[]) => void)[]> = {};
  const store = initialState;

  return {
    get<K extends keyof T>(event: K) {
      // if (!eventHandlers[event]) {
      //   eventHandlers[event] = [];
      // }
      // eventHandlers[event].push(handler);
      let value = store[event] as any;
      if (typeof value === "string") {
        value = new String(value);
      }
      value[SignalSymbol] = true;
      value[SignalId] = event;
      value[SignalStore] = store;
      return value as T[K];
    },
    set<K extends keyof T>(event: K, value: T[K]) {
      // if (eventHandlers[event]) {
      //   eventHandlers[event].forEach((handler) => handler(value));
      // }
      store[event] = value;
    },
  };
}
