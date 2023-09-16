import { createHandler } from "../util/createHandler";
import { event } from "../util/events";
import * as elements from "typed-html";

type Store = {
  todos: {
    text: string;
    checked: boolean;
  }[];
};

export const handler = createHandler<Store>({
  initialState: {
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
  },
  handler({ set, list, bind }) {
    return (
      <div>
        <div class="container mx-auto mt-8">
          <form
            class="mb-8"
            onsubmit={event((e) => {
              e.preventDefault();
              const target = e.target as any;
              if (!target) return;
              const formData = new FormData(target);
              const todo = formData.get("todo") as string;
              set("todos", (todos) => [
                ...todos,
                { text: todo, checked: false },
              ]);
              target.reset();
            })}
          >
            <input required="true" name="todo" class="text-black" />
            <button>Submit</button>
          </form>

          <div class="flex gap-4 mb-8">
            <h2>Total Items {bind("todos", (todos) => todos.length)}</h2>
            <h2>
              Total Checked{" "}
              {bind("todos", (todos) => todos.filter((t) => t.checked).length)}
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
                    onchange={event((e: any, cur) => {
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
  },
});
