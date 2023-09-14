import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";

type Store = {
  todos: string[];
};

export async function handler() {
  const { set, list, withStore } = createStore<Store>({
    todos: [],
  });

  return withStore(
    <div>
      <div class="container mx-auto mt-8">
        <form
          onsubmit={event((e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const todo = formData.get("todo") as string;
            set("todos", (todos) => [...todos, todo]);
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
                    set("todos", (todos) =>
                      todos.filter((todo) => todo !== todoText)
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
