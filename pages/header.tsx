import { event } from "../util/events";
import { Get, Set, createStore } from "../util/store";
import * as elements from "typed-html";
import { hide } from "../util/util";

type Store = {
  isLoggedIn: boolean;
};

function Header(get: Get<Store>, set: Set<Store>) {
  return (
    <header class="flex justify-between p-4">
      LOGO
      <div>
        <button
          class={get("isLoggedIn", (isLoggedIn) => hide(!isLoggedIn))}
          onclick={event(() => {
            set("isLoggedIn", true);
          })}
        >
          Log In
        </button>
        <button
          class={get("isLoggedIn", (isLoggedIn) => hide(isLoggedIn))}
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

export async function handler() {
  const { get, set, withStore } = createStore<Store>({
    isLoggedIn: true,
  });

  return withStore(
    <div>
      {Header(get, set)}
      <div class="container mx-auto mt-8">
        Are we logged in? {get("isLoggedIn")}
      </div>
    </div>
  );
}
