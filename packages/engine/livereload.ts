import { Elysia } from "elysia";
import watch from "node-watch";

let wsConnections = new Set<any>();

function reloadAllBrowsers() {
  wsConnections.forEach((connection) => {
    connection.send("refresh");
  });
  wsConnections = new Set<any>();
}

export function startLiveReloadServer(
  watchDir: string,
  beforeRefresh: () => Promise<void>
) {
  watch(watchDir, { recursive: true }, async function (evt, name) {
    await beforeRefresh();
    reloadAllBrowsers();
  });

  const app = new Elysia()
    .ws("/ws", {
      open(ws) {
        wsConnections.add(ws);
      },
      close(ws) {
        wsConnections.delete(ws);
      },
      message(ws, message) {
        console.log("message", message);
      },
    })
    .listen(4001);

  console.log(
    `🦊 Livereload running ${app.server?.hostname}:${app.server?.port}`
  );
}
