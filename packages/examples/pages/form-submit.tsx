import * as elements from "typed-html";
import { event, createHandler, hide } from "@dumb-framework/engine";

type Store = {
  result: string;
  searchString: string;
  disableSubmitButton: boolean;
};

export async function getData(search: string) {
  return { word: search };
}

export const handler = createHandler<Store>({
  initialState: {
    result: "",
    searchString: "",
    disableSubmitButton: true,
  },
  handler({ set, get, watch }) {
    return (
      <div class="container mx-auto mt-8">
        <form
          onsubmit={event(async (e) => {
            e.preventDefault();
            if (!e.target) return;
            const result = await getData(get("searchString"));
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
            disabled={watch("disableSubmitButton") + ""}
          >
            Submit
          </button>

          <div class={watch("result", hide)}>{watch("result")}</div>
        </form>
      </div>
    );
  },
});
