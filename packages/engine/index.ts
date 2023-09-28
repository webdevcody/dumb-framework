import { Elysia } from "elysia";
import path from "path";
// import { staticPlugin } from "@elysiajs/static";
import { withLiveReload } from "./util/withLiveReload";
import { withHtml } from "./util/withHtml";
// import { compression } from "elysia-compression";
import { withScript } from "./util/withScript";
import { withStore } from "./util/withStore";
import { mkdir } from "node:fs/promises";

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

export function runDumb() {
  const app = new Elysia()
    // .use(compression())
    // .use(
    //   staticPlugin({
    //     assets: "public",
    //   })
    // )
    .get("*", async ({ request, set }) => {
      const url = new URL(request.url);

      const file = Bun.file(
        path.resolve(process.cwd(), "./public/" + url.pathname)
      );

      if (await file.exists()) {
        const contents = file.text();
        if (url.pathname.endsWith("js")) {
          set.headers["content-type"] = "text/javascript; charset=utf8";
        } else {
          set.headers["content-type"] = "text/html; charset=utf8";
        }

        return contents;
      }

      try {
        let suffix = url.pathname + ".tsx";
        let filePath = path.resolve(process.cwd(), "./pages" + suffix);

        const imported = await import(filePath + `?update=${Date.now()}`).catch(
          (err) => {
            if (err.message.includes("Cannot find module")) {
              suffix = url.pathname + "index.tsx";
              filePath = path.resolve(process.cwd(), "./pages" + suffix);
              return import(filePath + `?update=${Date.now()}`);
            }
          }
        );

        const bundle = await Bun.build({
          entrypoints: [filePath],
        });
        let bundleText = await bundle.outputs[0].text();

        const directoryPath = path.resolve(
          process.cwd(),
          "./public/js/" + suffix
        );
        const parentDirectoryPath = path.dirname(directoryPath);

        await mkdir(parentDirectoryPath, {
          recursive: true,
        });

        const jsFilePath = suffix.replace(".tsx", ".js");

        Bun.write(
          path.resolve(process.cwd(), "./public/js" + jsFilePath),
          bundleText
        );

        const extra = Object.keys(imported)
          .map((key) => {
            return `window.${key} = dumb["${key}"];`;
          })
          .join("\n");

        set.headers["content-type"] = "text/html; charset=utf8";

        const { html, store, styles } = await imported.handler();
        const htmlToReturn = withScript(
          `js${jsFilePath}`,
          extra
        )(
          withLiveReload(
            withHtml(
              transformHTML(withStore(store as any, html as any)),
              styles
            )
          )
        );
        return htmlToReturn;
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
}
