import * as elements from "typed-html";
import { event, createHandler } from "@dumb-framework/engine/client";

export function doStuff() {
  console.log("stuff");
}

export const handler = createHandler({
  handler() {
    return (
      <html>
        <head>
          <title>Bundle</title>
          <link rel="stylesheet" href="css/tw.css" />
        </head>
        <body class="bg-gray-800 text-white">
          <button
            onclick={event(() => {
              doStuff();
            })}
          >
            Log Stuff!@
          </button>
        </body>
      </html>
    );
  },
});
