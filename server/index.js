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
    const { content, status, completion_date } = req.body;
    await db.query(
      "INSERT INTO tasks (content, status, creation_date, completion_date) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)",
      [content, status, completion_date]
    );
    res.status(201).json("Created a task successfully!");
  } catch (error) {
    console.error(error);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { content, status, completion_date } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;

    if (content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(content);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (completion_date !== undefined) {
      fields.push(`completion_date = $${idx++}`);
      values.push(completion_date);
    }

    if (fields.length === 0) {
      return res.status(400).json("No fields to update.");
    }

    values.push(req.params.id);
    const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx}`;
    await db.query(query, values);

    res.status(200).json("Updated a task successfully!");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
  }
});

app.listen(SERVER_PORT, () => {
  console.log("✅ Server is running on port:", SERVER_PORT);
});
