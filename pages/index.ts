import { html } from "../util/html";

// ✅ we can do async data fetching

type WordInfo = {
  word: string;
  score: number;
  tags: string[];
};

export const SignalSymbol = Symbol("signal");
export const SignalId = Symbol("id");
export const SignalStore = Symbol("store");

function createSignal<T>(initialState: T) {
  let state = initialState;

  if (typeof initialState === "string") {
    state = new String(initialState) as T;
  }

  function getter() {
    (state as any).signal = true;
    return state;
  }

  (getter as any)[SignalId] = "randomId";

  function setter(newState: T) {
    state = newState;
  }
  (setter as any)[SignalId] = "randomId";

  const signal = [getter, setter] as const;
  (state as any)[SignalSymbol] = signal;
  // (signal as any)[SignalSymbol] = true;
  // (getter as any)[SignalSymbol] = signal;
  // (setter as any)[SignalSymbol] = signal;
  return signal;
}

export function createStore<T extends Record<string, any>>(initialState: T) {
  // Create an object to store event handlers
  // const eventHandlers: Record<keyof T, ((...args: any[]) => void)[]> = {};
  const store = initialState;

  return {
    get<K extends keyof T>(event: K) {
      // if (!eventHandlers[event]) {
      //   eventHandlers[event] = [];
      // }
      // eventHandlers[event].push(handler);
      let value = store[event] as any;
      if (typeof value === "string") {
        value = new String(value);
      }
      value[SignalSymbol] = true;
      value[SignalId] = event;
      value[SignalStore] = store;
      return value as T[K];
    },
    set<K extends keyof T>(event: K, value: T[K]) {
      // if (eventHandlers[event]) {
      //   eventHandlers[event].forEach((handler) => handler(value));
      // }
      store[event] = value;
    },
  };
}

export async function handler() {
  // this is defined an an on server, but I also want the
  // same variable names injected into the client
  const { get, set } = createStore<{
    name: string;
  }>({
    name: "cody",
  });

  return html`<div>
    <form
      submit="${async (formData: FormData) => {
        // setName("bob"); // this is ran on client, but setName is not defined
        set("name", "bob");
      }}"
    >
      <input name="text" />
      <button>Submit</button>
    </form>

    <div>${get("name") /** intepolates to "cody" on SSR pass */}</div>
  </div>`;
}
