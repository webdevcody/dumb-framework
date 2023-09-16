import * as elements from "typed-html";
import { event } from "../util/events";
import { createHandler } from "../util/createHandler";

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
