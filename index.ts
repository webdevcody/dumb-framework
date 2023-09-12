import { Elysia, ws } from "elysia";
import path from "path";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { minify } from "html-minifier-terser";
import { withTailwind } from "./util/withTailwind";
import { withLiveReload } from "./util/withLiveReload";
import { withHtml } from "./util/withHtml";

function transformHTML(html: string) {
  return minify(replaceValueSignals(replaceAttributeSignals(html)), {
    collapseWhitespace: false,
    minifyJS: false,
    minifyCSS: false,
  });
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

function replaceAttributeSignals(html: string): string {
  const regex = /(\w+)="__SIGNAL\(([^,]+),([^,\)]+)\)"/g;
  const transformedHTML = html.replace(
    regex,
    (_match, attributeName, signalName, signalValue) => {
      const dataSignalId = `data-signal-id="${attributeName}:${signalName}"`;
      const attributeValue = signalValue;
      if (attributeName === "if") {
        return `${dataSignalId} style="display: ${
          attributeValue !== "undefined" ? "block" : "none"
        };"`;
      } else {
        return `${dataSignalId} ${attributeName}="${attributeValue}"`;
      }
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
      return transformHTML(withTailwind(withLiveReload(withHtml(html))));
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
