import { HandlerContext } from "../util/context";
import { createStore } from "../util/store";

type WordInfo = {
  word: string;
  score: number;
  tags: string[];
};

export async function handler({ html }: HandlerContext) {
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
        const text = formData.get("text");
        const words: WordInfo[] = await fetch(
          `https://api.datamuse.com/words?ml=${text}`
        ).then((response) => response.json());
        set("name", words[0].word);
      }}"
    >
      <input name="text" />
      <button>Submit</button>
    </form>

    <div>${get("name")}</div>
    <div>${get("name")}</div>
    <div>${get("name")}</div>
    <div>${get("name")}</div>
    <div>${get("name")}</div>
  </div>`;
}
