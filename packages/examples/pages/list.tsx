import * as elements from "typed-html";
import { event, createHandler } from "@dumb-framework/engine/client";

export const handler = createHandler<{
  data: string[];
}>({
  initialState: {
    data: ["a", "b", "c", "d"],
  },
  handler({ set, list }) {
    return (
      <div class="container mx-auto mt-8">
        <button
          onclick={event(() => {
            set("data", (data) => {
              return data.map((char) =>
                String.fromCharCode(char.charCodeAt(0) + 1)
              );
            });
          })}
        >
          Click Me
        </button>
        <ul>
          {list("data", (entry) => {
            return <li>{entry}</li>;
          })}
        </ul>
      </div>
    );
  },
});
