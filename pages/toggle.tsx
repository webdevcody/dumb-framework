import classNames from "classnames";
import { event } from "../util/events";
import * as elements from "typed-html";
import { createHandler } from "../util/createHandler";

export const handler = createHandler<{
  hideText: boolean;
}>({
  initialState: {
    hideText: true,
  },
  handler({ set, watch }) {
    return (
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
          class={watch("hideText", (hideText: boolean) =>
            classNames({
              hidden: hideText,
            })
          )}
        >
          TEXT
        </div>
      </div>
    );
  },
});
