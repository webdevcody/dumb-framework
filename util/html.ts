import { SignalId, SignalStore, SignalSymbol } from "../pages";

export const html = (
  strings: TemplateStringsArray,
  ...interpolations: any[]
) => {
  let formId = 0;
  let scripts = `<script>
    function set(key, value) {
      window.store[key] = value;

      document.querySelectorAll(\`div[data-signal-id="\${key}"]\`)
        .forEach(el => {
          el.innerText = value;
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
        console.log("we are here");
        if (!scripts.includes("window.store =")) {
          scripts =
            `<script>
            window.store = ${JSON.stringify(interpolation[SignalStore])};
            </script>` + scripts;
        }

        return (
          result +
          string +
          `<div data-signal-id="${interpolation[SignalId]}">${interpolation}</div>`
        );
      } else {
        return result + string + interpolation;
      }
    }, "") + scripts
  );
};
