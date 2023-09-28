import * as elements from "typed-html";
import { event, createHandler, hide } from "@dumb-framework/engine";

function Header(store: HeaderPageStore) {
  const { watch, set } = store;
  return (
    <header class="flex justify-between p-4">
      LOGO
      <div>
        <button
          class={watch("isLoggedIn", (isLoggedIn) => hide(!isLoggedIn))}
          onclick={event(() => {
            set("isLoggedIn", true);
          })}
        >
          Log In
        </button>
        <button
          class={watch("isLoggedIn", (isLoggedIn) => hide(isLoggedIn))}
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
    const { watch } = store;
    return (
      <div>
        {Header(store)}
        <div class="container mx-auto mt-8">
          Are we logged in? {watch("isLoggedIn")}
        </div>
      </div>
    );
  },
});
