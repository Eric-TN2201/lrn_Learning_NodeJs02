import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "permalist",
  password : "123456",
  port : 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// get list
app.get("/", async (req, res) => {
  const result = await db.query("select * from items order by id asc");
  items = [];
  
  result.rows.forEach(item => {
    items.push(item);
  });
  console.log("list", items);
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

// handle add - add new item todo
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("insert into items (title) values ($1)", [item]);    
    res.redirect("/");
  } catch (err) {
    console.error('add', err);
  }
});

// handle edit - edit title
app.post("/edit", async (req, res) => {
  const title = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("update items set title = $1 where id = $2", [title, id]);
    res.redirect("/");
  } catch (err) {
    console.error('update', err);
  }
});

// handle delete
app.post("/delete", async (req, res) => {
  // const ids = req.body
  const id = req.body.deleteItemId;
  try {
    await db.query("delete from items where id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error('delete', error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
