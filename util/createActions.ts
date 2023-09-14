export function createActions<T extends Record<string, Function>>(actions: T) {
  return {
    runAction<K extends keyof T>(key: K): ReturnType<T[K]> {
      return actions[key]() as ReturnType<T[K]>;
    },
    withActions(html: string) {
      return (
        html +
        `<script>
          
          ${Object.keys(actions)
            .map((key) => {
              const fun = actions[key].toString();
              if (fun.includes("=>") && fun.includes("async")) {
                return `
                  action_${key} = ${fun}
                  `;
              } else if (fun.includes("async")) {
                return `
                  async function action_${fun.replace("async ", "")}
                  `;
              } else {
                return `
                  function action_${actions[key].toString()}
                  `;
              }
            })
            .join("\n")}

          function runAction(key, ...arguments) {
            return window['action_' + key].apply(...arguments);
          }
        </script>`
      );
    },
  };
}
