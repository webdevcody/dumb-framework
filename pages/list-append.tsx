import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";

export async function handler() {
  const { get, set, entry, list, withStore } = createStore<{
    data: string[];
  }>({
    data: ["gg"],
  });

  return withStore(
    <div class="container mx-auto mt-8">
      <button
        onclick={event(() => {
          set(
            "data",
            get("data", (data) => {
              return [...data, "hi"];
            })
          );
        })}
      >
        Click Me
      </button>
      <ul>
        {list("data", (entry) => {
          return <li class="text-red-400">{entry}</li>;
        })}
      </ul>
    </div>
  );
}
