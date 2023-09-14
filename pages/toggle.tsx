import classNames from "classnames";
import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";

export async function handler() {
  const { get, set, withStore } = createStore<{
    hideText: boolean;
  }>({
    hideText: true,
  });

  return withStore(
    <div class="container mx-auto mt-8">
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        onclick={event(() => {
          set("hideText", (hideText) => !hideText);
        })}
      >
        TOGGLE TEXT
      </button>

      <div
        class={get("hideText", (hideText: boolean) =>
          classNames({
            hidden: hideText,
          })
        )}
      >
        TEXT
      </div>
    </div>
  );
}
