import { Elysia, ws } from "elysia";
import watch from "node-watch";

let wsConnections = [] as any[];

watch("pages", { recursive: true }, function (evt, name) {
  for (let connection of wsConnections) {
    connection.send("refresh");
  }
});

const app = new Elysia()
  .use(ws())
  .ws("/ws", {
    open(ws) {
      wsConnections.push(ws);
    },
    close(ws) {
      wsConnections = wsConnections.filter((w) => w === ws);
    },
  })
  .listen(4001);

console.log(
  `🦊 Livereload running ${app.server?.hostname}:${app.server?.port}`
);
