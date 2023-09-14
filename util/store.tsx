import { event } from "./events";
import { hide } from "./util";

export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

export type Get<T> = <K extends keyof T, X>(
  key: K,
  cb?: (value: T[K]) => X
) => X;

export type Set<T> = <K extends keyof T>(event: K, value: T[K]) => void;

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

  const obj = {
    get,
    list<K extends keyof T>(key: K, cb?: (entryId: string) => any) {
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
    set<K extends keyof T>(event: K, value: T[K]) {
      store[event] = value;
    },
    withStore(html: string) {
      const specialString = new String(
        html +
          `<script>
          window.store = ${JSON.stringify(store)};

          window.event = ${event.toString()}
          window.hide = ${hide.toString()}

          elements = {
            createElement: (type, attributes, ...children) => {
              const el = document.createElement(type);
          
              // Set attributes
              if (attributes) {
                for (const [key, value] of Object.entries(attributes)) {
                  el.setAttribute(key, value);
                }
              }
          
              // Set innerHTML/textContent
              if (children) {
                el.innerHTML = children.join('');
              }
          
              return el.outerHTML;
            }
          };

          function get(key, cb) {
            if (cb) {
              return cb(window.store[key]);
            } else {
              return window.store[key];
            }
          }

          function entry(key, idx) {
            return ''
          }
      
          function set(key, value) {
            window.store[key] = value
      
            document.querySelectorAll(\`[data-signal-id*="\${key}"]\`)
              .forEach(el => {
                const signalId = el.dataset.signalId;
                const mappings = signalId.split(',');
                for (let mapping of mappings) {
                  const [attribute, key, functionId, entryIdx] = mapping.split(':');
                  if (attribute === 'class') {
                    el.className = window['fun' + functionId](window.store[key], entryIdx);
                  } else if (attribute === "list") {
                    el.innerHTML = window.store[key].map((entry, idx) => window['template' + functionId](entry)).join('')
                  } else {
                    el[attribute] = window['fun' + functionId](window.store[key], entryIdx);
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

            ${Object.keys(templates)
              .map(
                (templateId) => `
              template${templateId} = ${templates[templateId].toString()}
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
  return obj;
}
