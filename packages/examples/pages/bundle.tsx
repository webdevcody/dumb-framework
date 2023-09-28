import * as elements from "typed-html";
import { event, createHandler } from "@dumb-framework/engine";

export function doStuff() {
  console.log("stuff");
}

export const handler = createHandler({
  handler() {
    return (
      <button
        onclick={event(() => {
          doStuff();
        })}
      >
        Log Stuff
      </button>
    );
  },
});
