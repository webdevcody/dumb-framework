import { event } from "../util/events";
import { createStore } from "../util/store";
import * as elements from "typed-html";

type Store = {
  todos: {
    text: string;
    checked: boolean;
  }[];
};

export async function handler() {
  const { get, set, list, withStore } = createStore<Store>({
    todos: [
      {
        text: "give up on this project",
        checked: false,
      },
      { text: "think of another cool idea", checked: false },
      { text: "start another project", checked: true },
      { text: "abandon new project", checked: false },
      { text: "repeat....", checked: true },
    ],
  });

  return withStore(
    <div>
      <div class="container mx-auto mt-8">
        <form
          class="mb-8"
          onsubmit={event((e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const todo = formData.get("todo") as string;
            set("todos", (todos) => [...todos, { text: todo, checked: false }]);
            e.target.reset();
          })}
        >
          <input required="true" name="todo" class="text-black" />
          <button>Submit</button>
        </form>

        <div class="flex gap-4 mb-8">
          <h2>Total Items {get("todos", (todos) => todos.length)}</h2>
          <h2>
            Total Checked{" "}
            {get("todos", (todos) => todos.filter((t) => t.checked).length)}
          </h2>
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1"
            onclick={event(() => {
              set("todos", (todos) =>
                todos.map((todo) => ({ ...todo, checked: true }))
              );
            })}
          >
            Check All
          </button>
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1"
            onclick={event(() => {
              set("todos", (todos) =>
                todos.map((todo) => ({ ...todo, checked: false }))
              );
            })}
          >
            Uncheck All
          </button>
        </div>

        <ul>
          {list("todos", (todo) => {
            return (
              <li class="text-red-400 flex gap-2">
                <input
                  type="checkbox"
                  checked={todo.checked}
                  onchange={event((e, cur) => {
                    set("todos", (todos) => {
                      return todos.map((todo) => {
                        return todo.text === cur.text
                          ? { ...todo, checked: e.target.checked }
                          : todo;
                      });
                    });
                  }, todo)}
                />
                <div>{todo.text}</div>
                <button
                  class="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded"
                  onclick={event((e, curTodo) => {
                    set("todos", (todos) =>
                      todos.filter((todo) => todo.text !== curTodo.text)
                    );
                  }, todo)}
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
