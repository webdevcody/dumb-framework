import { event } from "../util/events";
import * as elements from "typed-html";
import { hide } from "../util/util";
import { createHandler } from "../util/createHandler";

type Store = {
  result: string;
  searchString: string;
  disableSubmitButton: boolean;
};

export async function getData() {
  return { word: "gg" };
}

export const handler = createHandler<Store>({
  initialState: {
    result: "",
    searchString: "",
    disableSubmitButton: true,
  },
  handler({ get, set, bind }) {
    return (
      <div class="container mx-auto mt-8">
        <form
          onsubmit={event(async (e) => {
            e.preventDefault();
            if (!e.target) return;
            const result = await getData();
            set("result", result.word);
          })}
        >
          <input
            class="border border-black p-2 text-black"
            oninput={event(async (e: Event) => {
              const target = e.target as any;
              if (!target) return;
              set("disableSubmitButton", !target.value);
              set("searchString", target.value);
            })}
          />
          <button
            class="bg-blue-400 rounded px-2 py-1 hover:bg-blue-500 text-white disabled:bg-gray-400"
            disabled={bind("disableSubmitButton") + ""}
          >
            Submit
          </button>

          <div class={bind("result", hide)}>{bind("result")}</div>
        </form>
      </div>
    );
  },
});
