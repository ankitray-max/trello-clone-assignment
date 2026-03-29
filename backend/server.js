const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 API: get boards
app.get("/boards", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM boards");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching boards");
  }
});

app.get("/test", (req, res) => {
  res.send("Test working");
});

// 🔥 API: get lists
app.get("/lists/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const result = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position",
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching lists");
  }
});

// 🔥 API: get cards
app.get("/cards/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await pool.query(
      "SELECT * FROM cards WHERE list_id = $1 ORDER BY position",
      [listId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching cards");
  }
});

// 🔥 API: load full board
app.get("/load", async (req, res) => {
  try {
    const lists = await pool.query("SELECT * FROM lists ORDER BY position");
    const cards = await pool.query("SELECT * FROM cards ORDER BY position");
    const labels = await pool.query("SELECT * FROM labels");
    const cardLabels = await pool.query("SELECT * FROM card_labels");

    const data = {
      lists: lists.rows.map(list => ({
        id: list.id,
        text: list.title,
        tasks: cards.rows
          .filter(card => card.list_id === list.id)
          .map(card => ({
            id: card.id,
            text: card.title,
            description: card.description || "",
            dueDate: card.due_date,
            labels: cardLabels.rows
              .filter(cl => cl.card_id === card.id)
              .map(cl => labels.rows.find(l => l.id === cl.label_id))
          }))
      }))
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading data");
  }
});

// 🔥 API: save (FIXED)
// 🔥 API: save (FIXED PROPERLY)
app.post("/save", async (req, res) => {
  try {
    const { lists } = req.body;

    // clear old data
    await pool.query("DELETE FROM card_labels");
    await pool.query("DELETE FROM cards");

    // get DB lists
    const dbLists = await pool.query("SELECT * FROM lists ORDER BY position");

    // 🔥 create mapping (IMPORTANT FIX)
    const listMap = {};
    dbLists.rows.forEach((list) => {
      listMap[list.title] = list.id;
    });

    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];

      // ✅ FIX: use title instead of index
      const listId = listMap[list.text];

      if (!listId) continue;

      for (let j = 0; j < list.tasks.length; j++) {
        const task = list.tasks[j];

        const newCard = await pool.query(
          `INSERT INTO cards (title, description, due_date, list_id, position)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            task.text,
            task.description || "",
            task.dueDate || null,
            listId,
            j
          ]
        );

        const cardId = newCard.rows[0].id;

        // labels
        if (task.labels && task.labels.length > 0) {
          for (const label of task.labels) {
            await pool.query(
              "INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2)",
              [cardId, label.id]
            );
          }
        }
      }
    }

    res.send("Saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});
app.get('/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lists (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        position INT DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        due_date TIMESTAMP,
        list_id INT REFERENCES lists(id),
        position INT DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS labels (
        id SERIAL PRIMARY KEY,
        text VARCHAR(50),
        color VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS card_labels (
        id SERIAL PRIMARY KEY,
        card_id INT REFERENCES cards(id),
        label_id INT REFERENCES labels(id)
      );
    `);

    const existing = await pool.query(`SELECT COUNT(*) FROM lists`);

    if (parseInt(existing.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO lists (title, position)
        VALUES 
        ('To Do', 0),
        ('In Progress', 1),
        ('Done', 2);
      `);
    }

    res.send("DB Initialized ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
app.get('/reset', async (req, res) => {
  try {
    await pool.query("DELETE FROM card_labels");
    await pool.query("DELETE FROM cards");
    await pool.query("DELETE FROM lists");

    await pool.query(`
      INSERT INTO lists (title, position)
      VALUES 
      ('To Do', 0),
      ('In Progress', 1),
      ('Done', 2);
    `);

    res.send("DB Reset Done ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});