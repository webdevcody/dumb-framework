import { Elysia, ws } from "elysia";
import path from "path";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { minify } from "html-minifier-terser";
import { withTailwind } from "./util/withTailwind";
import { withLiveReload } from "./util/withLiveReload";
import { withHtml } from "./util/withHtml";

function transformHTML(html: string) {
  return replaceValueSignals(replaceAttributeSignals(html));
}

function replaceValueSignals(html: string): string {
  const regex = /__SIGNAL\(([^,]+),([^,\)]+)\)/g;
  const transformedHTML = html.replace(
    regex,
    (_match, signalName, signalValue) => {
      const dataSignalId = `data-signal-id="innerHTML:${signalName}"`;
      const attributeValue = signalValue;
      return `<div ${dataSignalId}>${attributeValue}</div>`;
    }
  );

  return transformedHTML;
}

function replaceAttributeSignals(html: String): string {
  const regex = /(\w+)="__SIGNAL\(([^,]+),([^,\)]+)\)"/g;
  const functions = (html as any).functions;
  const store = (html as any).store;
  const transformedHTML = html.replace(
    regex,
    (_match, attributeName, signalId, functionId) => {
      console.log(functions[functionId](store[signalId]));
      const dataSignalId = `data-signal-id="${attributeName}:${signalId}:${functionId}"`;
      return `${dataSignalId} ${attributeName}="${functions[functionId](
        store[signalId]
      )}"`;
    }
  );

  return transformedHTML;
}

const app = new Elysia()
  // .use(compression())
  .use(
    staticPlugin({
      assets: "public",
    })
  )
  .use(html())
  .get("*", async ({ request, set }) => {
    console.log("got request");
    const url = new URL(request.url);
    try {
      const { handler } = await import(
        path.resolve("./pages" + url.pathname + ".tsx")
      ).catch((err) => {
        if (err.message.includes("Cannot find module")) {
          return import(path.resolve("./pages" + url.pathname + "index.tsx"));
        }
      });
      // TODO: this feels hacky and it should be configured based on the user of the library
      const html = await handler();
      return withTailwind(withLiveReload(withHtml(transformHTML(html))));
    } catch (err) {
      console.log(err);
      set.status = 404;
      return "file not found";
    }
  })
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
