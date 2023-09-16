export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

export type Get<T> = <K extends keyof T, X>(
  key: K,
  cb?: (value: T[K]) => X
) => X;

export type Set<T> = <K extends keyof T>(
  event: K,
  value: T[K] | ((current: T[K]) => T[K])
) => void;

export function createStore<T extends Record<string, any>>(initialState: T) {
  // Create an object to store event handlers
  // const eventHandlers: Record<keyof T, ((...args: any[]) => void)[]> = {};
  const store = initialState;
  const functions = {} as Record<string, any>;
  let id = 0;
  const templates = {} as Record<string, Function>;
  let templateId = 0;

  const get: Get<T> = (key, cb) => {
    const funId = id++;
    if (!cb) {
      cb = (value) => value;
    }
    functions[funId] = cb;
    return `__SIGNAL(${String(key)},${funId})` as any;
  };

  const set: Set<T> = (event, cb) => {
    let value = cb;
    if (typeof cb === "function") {
      value = (cb as Function)(store[event]);
    }
    (store[event] as any) = value;
  };

  const obj = {
    get,
    bind: get,
    set,
    getStore() {
      return store;
    },
    getFunctions() {
      return functions;
    },
    getTemplates() {
      return templates;
    },
    list<K extends keyof T>(key: K, cb?: (entry: T[K][0]) => any) {
      const tid = templateId++;
      templates[tid + ""] = cb?.toString();
      return (
        `__LIST(${key},${tid})` +
        store[key]
          .map((entry, idx) => {
            return cb(entry);
          })
          .join("")
      );
    },
    entry<K extends keyof T>(key: K, entryId: string) {
      const funId = id++;
      let cb = (arr, idx) => arr[idx];
      functions[funId] = cb;
      return `__SIGNAL(${String(key)},${funId},${entryId})`;
    },
  };
  return obj;
}
