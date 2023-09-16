import * as elements from "typed-html";
import { createHandler } from "../util/createHandler";

export const handler = createHandler({
  handler() {
    return (
      <div class="flex text-xl flex-col gap-4 container mx-auto mt-8">
        <a class="text-blue-500 hover:text-blue-600" href="./form-submit">
          Form Submit
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./toggle">
          Toggle
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./list">
          List
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./list-append">
          List Append
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./todo">
          Todo
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./header">
          Header
        </a>
        <a class="text-blue-500 hover:text-blue-600" href="./bundle">
          Bundle
        </a>
      </div>
    );
  },
});
