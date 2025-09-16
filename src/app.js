import express from "express";
import { initDb } from "./db/connectdb.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

initDb();

app.get("/", (req, res) => {
  res.send("Welcome to the Banking Mock API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
