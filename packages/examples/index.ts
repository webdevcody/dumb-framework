import { runDumb } from "@dumb-framework/engine";
import { startLiveReloadServer } from "@dumb-framework/engine";
import path from "path";
import cp from "child_process";

startLiveReloadServer(path.join(process.cwd(), "./pages"), () => {
  return new Promise((resolve) =>
    cp.exec("bun run build:tailwind", () => {
      resolve();
    })
  );
});
runDumb();

console.log(process.env.NODE_ENV);
