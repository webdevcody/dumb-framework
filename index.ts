import { Elysia } from "elysia";
import path from "path";
import { staticPlugin } from "@elysiajs/static";
import { withTailwind } from "./util/withTailwind";
import { withLiveReload } from "./util/withLiveReload";
import { withHtml } from "./util/withHtml";
import { compression } from "elysia-compression";
import { withScript } from "./util/withScript";
import { withStore } from "./util/withStore";

function transformHTML(html: String) {
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
  .use(compression())
  .use(
    staticPlugin({
      assets: "public",
    })
  )
  .get("*", async ({ request, set }) => {
    const url = new URL(request.url);
    try {
      let filePath = path.resolve("./pages" + url.pathname + ".tsx");

      const imported = await import(filePath).catch((err) => {
        if (err.message.includes("Cannot find module")) {
          filePath = path.resolve("./pages" + url.pathname + "index.tsx");
          return import(filePath);
        }
      });

      const bundle = await Bun.build({
        entrypoints: [filePath],
      });
      let bundleText = await bundle.outputs[0].text();

      bundleText += Object.keys(imported)
        .map((key) => {
          return `window.${key} = ${key};`;
        })
        .join("\n");

      set.headers["content-type"] = "text/html; charset=utf8";

      const { html, store } = await imported.handler();

      return withScript(bundleText)(
        withTailwind(
          withLiveReload(
            withHtml(transformHTML(withStore(store as any, html as any)))
          )
        )
      );
    } catch (err) {
      console.log(err);
      set.status = 404;
      return "file not found";
    }
  })
  .onStart(() => {
    if (process.env.NODE_ENV === "development") {
      void fetch("http://localhost:4001/restart");
      console.log("🦊 Triggering Live Reload");
    }
  })
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
