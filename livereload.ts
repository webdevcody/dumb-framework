import { Elysia, ws } from "elysia";
import watch from "node-watch";

let wsConnections = [] as any[];

watch("pages", { recursive: true }, function (evt, name) {
  console.log(wsConnections.length);
  console.log("here", evt, name);
  for (let connection of wsConnections) {
    connection.send("refresh");
  }
});

const app = new Elysia()
  .use(ws())
  .ws("/ws", {
    open(ws) {
      console.log("got a connection");
      wsConnections.push(ws);
    },
    close(ws) {
      console.log("user disconnected");
      wsConnections = wsConnections.filter((w) => w === ws);
      console.log(wsConnections);
    },
  })
  .listen(4001);

console.log(
  `🦊 Livereload running ${app.server?.hostname}:${app.server?.port}`
);
