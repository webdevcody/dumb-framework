import { Elysia, ws } from "elysia";
import path from "path";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { withTailwind } from "./util/withTailwind";
import { withLiveReload } from "./util/withLiveReload";
import { withHtml } from "./util/withHtml";

function transformHTML(html: string) {
  return replaceValueSignals(replaceAttributeSignals(replaceLists(html)));
}

function replaceValueSignals(html: String): string {
  const regex = /__SIGNAL\(([^,]+),([^,\)]+)(,([^,\)]+))?\)/g;
  const functions = (html as any).functions;
  const store = (html as any).store;
  const transformedHTML = html.replace(
    regex,
    (_match, signalId, functionId, entryIdx) => {
      let dataSignalId = `data-signal-id="innerHTML:${signalId}:${functionId}"`;
      if (entryIdx) {
        const entryId = entryIdx.replace(",", "");
        dataSignalId = `data-signal-id="innerHTML:${signalId}:${functionId}:${entryId}"`;
        const value = functions[functionId](store[signalId], entryId);
        return `<div ${dataSignalId}>${value}</div>`;
      } else {
        const value = functions[functionId](store[signalId]);
        return `<div ${dataSignalId}>${value}</div>`;
      }
    }
  );

  return transformedHTML;
}

function replaceAttributeSignals(html: String): String {
  const regex = /(\w+)="__SIGNAL\(([^,]+),([^,\)]+)(,([^,\)]+))?\)"/g;
  const functions = (html as any).functions;
  const store = (html as any).store;
  const transformedHTML = new String(
    html.replace(
      regex,
      (_match, attributeName, signalId, functionId, entryIdx) => {
        let dataSignalId = `data-signal-id="${attributeName}:${signalId}:${functionId}"`;
        if (entryIdx) {
          const entryId = entryIdx.replace(",", "");

          dataSignalId = `data-signal-id="${attributeName}:${signalId}:${functionId}:${entryId}"`;
          return `${dataSignalId} ${attributeName}="${functions[functionId](
            store[signalId],
            entryId
          )}"`;
        } else {
          return `${dataSignalId} ${attributeName}="${functions[functionId](
            store[signalId]
          )}"`;
        }
      }
    )
  );
  (transformedHTML as any).functions = functions;
  (transformedHTML as any).store = store;
  return transformedHTML;
}

function replaceLists(html: String): String {
  const regex = />__LIST\(([^,]+),([^,\)]+)\)/g;
  const functions = (html as any).functions;
  const store = (html as any).store;
  const transformedHTML = new String(
    html.replace(regex, (_match, signalId, templateId) => {
      let dataSignalId = ` data-signal-id="list:${signalId}:${templateId}"`;
      return `${dataSignalId}>`;
    })
  );
  (transformedHTML as any).functions = functions;
  (transformedHTML as any).store = store;
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
