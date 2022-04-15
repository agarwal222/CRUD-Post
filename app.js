const express = require("express");
const mysql = require("mysql2");

// create the connection to database
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Utkarsh_12345",
  database: "posts",
});

// express app
const app = express();

// listen for requests
app.listen(3000);

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  const blogs = [];
  // console.log(hid);
  const sql = "SELECT * FROM posts.post LIMIT 200";
  con.query(sql, function (err, results) {
    if (err) throw err;
    results.forEach((res) => {
      blogs.push(res);
    });
    res.render("index", { blogs });
  });
});

app.get("/hiddenpost", (req, res) => {
  const blogs = [];
  // console.log(hid);
  const sql = "SELECT * FROM posts.post LIMIT 200";
  con.query(sql, function (err, results) {
    if (err) throw err;
    results.forEach((res) => {
      blogs.push(res);
    });
    res.render("hidden", { blogs });
  });
});

app.get("/post/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM posts.post WHERE `id` = " + id + ";";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("detail", { blog: result });
  });
});

app.get("/post/:id/edit", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM posts.post WHERE `id` = " + id + ";";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("edit", { blog: result });
  });
});

app.post("/post/:id/update", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const body = req.body.body;

  const sql =
    "UPDATE `post` SET `Title` = '" +
    title +
    "', `Body`= '" +
    body +
    "' WHERE `id` = " +
    id +
    ";";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    // res.json({ redirect: "/" });
    res.redirect(`/post/${id}`);
  });
});

app.put("/post/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  // res.status(200).json("hidden");
  const sqlSelect = "SELECT Hidden FROM posts.post WHERE `id` = " + id + ";";
  con.query(sqlSelect, (err, result) => {
    if (err) throw err;
    let hidden;
    result[0].Hidden == 0 ? (hidden = 1) : (hidden = 0);
    console.log(result[0].Hidden, hidden);
    const sql =
      "UPDATE `post` SET `Hidden` = " + hidden + " WHERE `id` = " + id + ";";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.json({ redirect: "/" });
    });
  });
});

app.delete("/post/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const sql = " DELETE FROM posts.post WHERE `id` = " + id + ";";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json({ redirect: "/" });
  });
});

app.post("/post/new", (req, res) => {
  console.log(req.body);
  const id = Math.floor(Math.random() * 4589);
  const title = req.body.title;
  const body = req.body.body;
  const type = req.body.subtype;
  let hidden;
  if (type === "draft") {
    hidden = 1;
  } else {
    hidden = 0;
  }
  const sql =
    "INSERT INTO `post` (`id`, `Title`, `Body`, `Hidden`) VALUES (" +
    id +
    ",'" +
    title +
    "','" +
    body +
    "', " +
    hidden +
    ");";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/newpost", (req, res) => {
  res.render("create");
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
