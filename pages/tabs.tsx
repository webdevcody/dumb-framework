import classNames from "classnames";
import { event } from "../util/events";
import * as elements from "typed-html";
import { createHandler } from "../util/createHandler";

const tabs = ["first", "second", "third"] as const;
type Tab = (typeof tabs)[number];
type Store = {
  tabToDisplay: Tab;
};

export const handler = createHandler<Store>({
  initialState: {
    tabToDisplay: "second",
  },
  handler({ get, set, bind, getStore }) {
    return (
      <div class="container mx-auto mt-8 flex flex-col gap-12">
        <ul class="flex gap-4">
          <button
            class={bind("tabToDisplay", (tabToDisplay) =>
              classNames({
                "text-blue-500": tabToDisplay === "first",
              })
            )}
            onclick={event(() => set("tabToDisplay", "first"))}
          >
            First
          </button>
          <button
            class={bind("tabToDisplay", (tabToDisplay) =>
              classNames({
                "text-blue-500": tabToDisplay === "second",
              })
            )}
            onclick={event(() => set("tabToDisplay", "second"))}
          >
            Second
          </button>
          <button
            class={bind("tabToDisplay", (tabToDisplay) =>
              classNames({
                "text-blue-500": tabToDisplay === "third",
              })
            )}
            onclick={event(() => set("tabToDisplay", "third"))}
          >
            Third
          </button>
        </ul>

        <div
          class={get("tabToDisplay", (tab) =>
            classNames(tab !== "first" && "hidden")
          )}
        >
          First
        </div>
        <div
          class={get("tabToDisplay", (tab) =>
            classNames(tab !== "second" && "hidden")
          )}
        >
          Second
        </div>
        <div
          class={get("tabToDisplay", (tab) =>
            classNames(tab !== "third" && "hidden")
          )}
        >
          Third
        </div>
      </div>
    );
  },
});
