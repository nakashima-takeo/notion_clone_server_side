import express from "express";

const app = express();

app.get("/", (_, res) => {
  return res.send("Hello World!!");
});

app.listen(3010, () => {
  console.log("Server is running on http://localhost:3010");
});
