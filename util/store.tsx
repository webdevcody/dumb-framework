export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

export function createStore<T extends Record<string, any>>(initialState: T) {
  // Create an object to store event handlers
  // const eventHandlers: Record<keyof T, ((...args: any[]) => void)[]> = {};
  const store = initialState;

  return {
    get<K extends keyof T>(event: K) {
      return `__SIGNAL(${String(event)},${JSON.stringify(
        store[event]
      )})` as T[K];
    },
    set<K extends keyof T>(event: K, value: T[K]) {
      store[event] = value;
    },
    withStore(html: string) {
      return (
        html +
        `<script>
          window.store = ${JSON.stringify(store)};

          function get(key) {
            return window.store[key];
          }
      
          function set(key, value) {
            window.store[key] = value;
      
            document.querySelectorAll(\`[data-signal-id*="\${key}"]\`)
              .forEach(el => {
                const signalId = el.dataset.signalId;
                const mappings = signalId.split(',');
                for (let mapping of mappings) {
                  const [attribute, key] = mapping.split(':');
                  
                  if (attribute === 'if') {
                    el.style.display = value !== 'undefined' ? 'block' : 'none';
                  } else{
                    el[attribute] = value;
                  }
                }
              });
          }
        </script>`
      );
    },
  };
}
