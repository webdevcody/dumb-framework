import { event } from "../util/events";
import * as elements from "typed-html";
import { hide } from "../util/util";
import { createHandler } from "../util/createHandler";

function Header(store: HeaderPageStore) {
  const { bind, set } = store;
  return (
    <header class="flex justify-between p-4">
      LOGO
      <div>
        <button
          class={bind("isLoggedIn", (isLoggedIn) => hide(!isLoggedIn))}
          onclick={event(() => {
            set("isLoggedIn", true);
          })}
        >
          Log In
        </button>
        <button
          class={bind("isLoggedIn", (isLoggedIn) => hide(isLoggedIn))}
          onclick={event(() => {
            set("isLoggedIn", false);
          })}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}

type HeaderPageStore = ReturnType<typeof handler>["store"];

export const handler = createHandler<{
  isLoggedIn: boolean;
}>({
  initialState: {
    isLoggedIn: false,
  },
  handler(store) {
    const { bind } = store;
    return (
      <div>
        {Header(store)}
        <div class="container mx-auto mt-8">
          Are we logged in? {bind("isLoggedIn")}
        </div>
      </div>
    );
  },
});
