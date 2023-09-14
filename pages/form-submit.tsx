import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";
import { hide } from "../util/util";
import { createActions } from "../util/createActions";

export async function handler() {
  // Any reactive state must be defined inside the store
  const { get, set, withStore } = createStore<{
    result: string;
    searchString: string;
    disableSubmitButton: boolean;
  }>({
    result: "",
    searchString: "",
    disableSubmitButton: true,
  });

  // These are functions that run in the client
  const { runAction, withActions } = createActions({
    async getData() {
      return { word: "gg" };
    },
    doStuff: async () => {
      return "gg";
    },
  });

  return withStore(
    withActions(
      <div class="container mx-auto mt-8">
        <form
          onsubmit={event(async (e) => {
            e.preventDefault();
            if (!e.target) return;
            const result = await runAction("getData");
            await runAction("doStuff");
            set("result", result.word);
          })}
        >
          <input
            class="border border-black p-2 text-black"
            oninput={event(async (e: Event) => {
              const target = e.target;
              if (!target) return;
              set("disableSubmitButton", !target.value);
              set("searchString", target.value);
            })}
          />
          <button
            class="bg-blue-400 rounded px-2 py-1 hover:bg-blue-500 text-white disabled:bg-gray-400"
            disabled={get("disableSubmitButton") + ""}
          >
            Submit
          </button>

          <div class={get("result", hide)}>{get("result")}</div>
        </form>
      </div>
    )
  );
}
