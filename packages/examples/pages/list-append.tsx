import * as elements from "typed-html";
import { event, createHandler } from "@dumb-framework/engine/client";

export const handler = createHandler<{
  data: string[];
}>({
  initialState: {
    data: ["gg"],
  },
  handler({ set, list }) {
    return (
      <div class="container mx-auto mt-8">
        <button
          onclick={event(() => {
            set("data", (data) => [...data, "hi"]);
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
  },
});
