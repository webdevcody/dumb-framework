import { HandlerContext } from "../util/context";
import { createStore } from "../util/store";
import * as elements from "typed-html";
import { withTailwind } from "../util/tailwind";
import { withLiveReload } from "../util/withLiveReload";
import { withHtml } from "../util/withHtml";

type DataMuseResult = {
  word: string;
};

function event(cb: (event: Event) => void) {
  return `(${cb.toString()})(event)`;
}

export async function handler() {
  const { get, set, withStore } = createStore<{
    results: DataMuseResult[];
    searchString: string;
    firstResult?: DataMuseResult;
    disableSubmitButton: boolean;
  }>({
    results: [
      {
        word: "hello world",
      },
    ],
    searchString: "",
    firstResult: undefined,
    disableSubmitButton: true,
  });

  return withStore(
    <div class="container mx-auto mt-8">
      <form
        onsubmit={event(async (e) => {
          e.preventDefault();
          if (!e.target) return;
          const results = await fetch(
            `https://api.datamuse.com/words?ml=${encodeURIComponent(
              get("searchString")
            )}`
          ).then((response) => response.json());
          set("results", results as DataMuseResult[]);
          set("firstResult", results[0].word);
        })}
      >
        <input
          class="border border-black p-2 text-black"
          oninput={event(async (e) => {
            if (!e.target) return;
            set("disableSubmitButton", !e.target.value);
            set("searchString", e.target.value);
          })}
        />
        <button
          class="bg-blue-400 rounded px-2 py-1 hover:bg-blue-500 text-white disabled:bg-gray-400"
          disabled={get("disableSubmitButton") + ""}
          onclick={event(async (e) => {
            console.log("clicked");
          })}
        >
          Submit
        </button>

        <div if={get("firstResult")}>{get("firstResult")}</div>
      </form>
    </div>
  );
}
