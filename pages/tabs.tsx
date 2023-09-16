import classNames from "classnames";
import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";
import { createActions } from "../util/createActions";

const tabs = ["first", "second", "third"] as const;
type Tab = (typeof tabs)[number];
type Store = {
  tabToDisplay: Tab;
};

export async function handler() {
  const { get, set, bind, withStore } = createStore<Store>({
    tabToDisplay: "first",
  });

  const { runAction, withActions } = createActions({
    isTabSelected(tabToCheck: Tab) {
      return get("tabToDisplay") === tabToCheck;
    },
  });

  return withStore(
    withActions(
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
    )
  );
}
