import express from "express";
import path from "path";
const app = express();

app.use(express.static("public"));

app.get("*", async (req, res) => {
  try {
    const file = await import(path.resolve("./pages" + req.path + "/index.ts"));
    const html = await file.default.handler();
    res.send(html);
  } catch (err) {
    console.log(err);
    res.status(404).send("file not found");
  }
});

app.listen(4000);
