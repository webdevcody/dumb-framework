import { Store } from "./createHandler";
import { event } from "./events";
import { hide } from "./util";

export const withStore = <T extends Record<string, any>>(
  store: Store<T>,
  html: string
) => {
  const specialString = new String(
    html +
      `<script>
      window.store = ${JSON.stringify(store.getStore())};

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
  
      function set(key, cb) {
        let value = cb;
        if (typeof cb === 'function') {
          value = cb(window.store[key]);
        } 
        window.store[key] = value;
  
        document.querySelectorAll(\`[data-signal-id*="\${key}"]\`)
          .forEach(el => {
            const signalId = el.dataset.signalId;
            const mappings = signalId.split(',');
            for (let mapping of mappings) {
              const [attribute, key, functionId, entryIdx] = mapping.split(':');
              if (attribute === 'class') {
                el.className = window['fun' + functionId](window.store[key], entryIdx);
              } else if (attribute === "list") {
                el.innerHTML = window.store[key].map((entry, idx) => window['template' + functionId](entry)).join('').replaceAll('checked="false"', '')
              } else {
                el[attribute] = window['fun' + functionId](window.store[key], entryIdx);
              }
            }
          });
      }

      ${Object.keys(store.getFunctions())
        .map(
          (functionId) => `
        fun${functionId} = ${store.getFunctions()[functionId].toString()}
      `
        )
        .join("\n")}

        ${Object.keys(store.getTemplates())
          .map(
            (templateId) => `
          template${templateId} = ${store.getTemplates()[templateId].toString()}
        `
          )
          .join("\n")}
    </script>`
  );
  (specialString as any).functions = store.getFunctions();
  (specialString as any).store = store.getStore();
  return specialString;
};
