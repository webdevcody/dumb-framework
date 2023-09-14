import { event } from "../util/events";
import { Get, Set, createStore } from "../util/store";
import * as elements from "typed-html";
import { hide } from "../util/util";

type Store = {
  todos: string[];
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
  const { get, set, list, withStore } = createStore<Store>({
    todos: [],
    isLoggedIn: true,
  });

  return withStore(
    <div>
      {Header(get, set)}
      <div class="container mx-auto mt-8">
        <form
          onsubmit={event((e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const todo = formData.get("todo") as string;
            set(
              "todos",
              get("todos", (todos) => [...todos, todo])
            );
            e.target.reset();
          })}
        >
          <input name="todo" class="text-black" />
          <button>Submit</button>
        </form>

        <ul>
          {list("todos", (todoString) => {
            return (
              <li class="text-red-400 flex gap-2">
                <div>{todoString}</div>
                <button
                  class="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded"
                  onclick={event((e, todoText) => {
                    set(
                      "todos",
                      get("todos", (todos) =>
                        todos.filter((todo) => todo !== todoText)
                      )
                    );
                  }, todoString)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
