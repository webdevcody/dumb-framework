import * as elements from "typed-html";
import { event, createHandler } from "@dumb-framework/engine/client";

export function doStuff() {
  console.log("stuff");
}

export const handler = createHandler({
  styles: ["css/tw.css"],
  handler() {
    return (
      <body class="bg-gray-800 text-white">
        <button
          onclick={event(() => {
            doStuff();
          })}
        >
          Log Stuff!!
        </button>
      </body>
    );
  },
});
