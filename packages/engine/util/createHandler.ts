import { createStore } from "./store";

export type Store<T extends Record<string, any>> = ReturnType<
  typeof createStore<T>
>;

export const createHandler = <T extends Record<string, any>>(options: {
  initialState?: T;
  handler: (store: Store<T>) => string;
  styles?: string[];
}) => {
  const store = createStore<T>(options.initialState ?? ({} as T));
  return () => ({
    html: options.handler(store),
    store,
    styles: options.styles,
  });
};
