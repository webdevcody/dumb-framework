import { SignalId, SignalStore, SignalSymbol } from "./store";

export const createHtmlRenderer = () => {
  return (strings: TemplateStringsArray, ...interpolations: any[]) => {
    let formId = 0;
    let scripts = `<script>
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
            el[attribute] = value;
          }
        });
    }
  </script>`;

    return (
      strings.reduce((result, string, i) => {
        const interpolation =
          interpolations[i] !== undefined ? interpolations[i] : "";

        if (typeof interpolation === "function") {
          if (string.endsWith('submit="')) {
            string = `${string.slice(0, -8)} data-form-id="${formId}`;
            scripts += `<script>
          document
            .querySelector('form[data-form-id="${formId}"]')
            .addEventListener('submit', () => {
              event.preventDefault();
              const formData = new FormData(event.target);
              (${interpolation.toString().replace(/"/g, "'")})(formData);
            });
        </script>`;

            formId++;

            return result + string;
          } else {
            return (
              result +
              string +
              "(" +
              interpolation.toString().replace(/"/g, "'") +
              ")()"
            );
          }
        } else if (interpolation[SignalSymbol]) {
          if (!scripts.includes("window.store =")) {
            scripts =
              `<script>
            window.store = ${JSON.stringify(interpolation[SignalStore])};
            </script>` + scripts;
          }

          if (string.endsWith('disabled="')) {
            string = string.slice(0, -10);
            return (
              result +
              string +
              `data-signal-id="disabled:${interpolation[SignalId]}" disabled="` +
              interpolation
            );
          } else {
            return (
              result +
              string +
              `<div data-signal-id="innerText:${interpolation[SignalId]}">${interpolation}</div>`
            );
          }
        } else {
          return result + string + interpolation;
        }
      }, "") + scripts
    );
  };
};
