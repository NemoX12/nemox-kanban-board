const SERVER_PORT = 5542;

const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM tasks");
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const { content, status } = req.body;
    await db.query(
      "INSERT INTO tasks (content, status, creation_date) VALUES ($1, $2, CURRENT_TIMESTAMP)",
      [content, status]
    );
    res.status(201).json("Created a task successfully!");
  } catch (error) {
    console.error(error);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { content, status, completion_date } = req.body;
    await db.query(
      "UPDATE tasks SET content = $1, status = $2, completion_date = $3 WHERE id = $4",
      [content, status, completion_date, req.params.id]
    );
    res.status(200).json("Updated a task successfully!");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.status(204).json("");
  } catch (error) {
    console.error(error);
  }
});

app.listen(SERVER_PORT, () => {
  console.log("✅ Server is running on port:", SERVER_PORT);
});
