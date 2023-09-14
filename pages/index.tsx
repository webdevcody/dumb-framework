import * as elements from "typed-html";

export async function handler() {
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
    </div>
  );
}
