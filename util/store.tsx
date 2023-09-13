export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

export function createStore<T extends Record<string, any>>(initialState: T) {
  // Create an object to store event handlers
  // const eventHandlers: Record<keyof T, ((...args: any[]) => void)[]> = {};
  const store = initialState;
  const functions = {} as Record<string, any>;
  let id = 0;

  return {
    get<K extends keyof T, X>(key: K, cb?: (value: T[K]) => X) {
      const funId = id++;
      functions[funId] = cb;
      return `__SIGNAL(${String(key)},${funId})` as X;
    },
    set<K extends keyof T>(event: K, value: T[K]) {
      store[event] = value;
    },
    withStore(html: string) {
      const specialString = new String(
        html +
          `<script>
          window.store = ${JSON.stringify(store)};

          function get(key) {
            return window.store[key];
          }
      
          function set(key, value) {
            window.store[key] = value
      
            document.querySelectorAll(\`[data-signal-id*="\${key}"]\`)
              .forEach(el => {
                const signalId = el.dataset.signalId;
                const mappings = signalId.split(',');
                for (let mapping of mappings) {
                  const [attribute, key, functionId] = mapping.split(':');
                  console.log({attribute, key, value, functionId});
                  if (attribute === 'class') {
                    el.className = window['fun' + functionId](window.store[key]);
                  } else {
                    el[attribute] = window['fun' + functionId](window.store[key]);
                  }
                }
              });
          }

          ${Object.keys(functions)
            .map(
              (functionId) => `
            fun${functionId} = ${functions[functionId].toString()}
          `
            )
            .join("\n")}
        </script>`
      );
      (specialString as any).functions = functions;
      (specialString as any).store = store;
      return specialString;
    },
  };
}
