const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// MIDDLEWARE

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// function to generate random short URL

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

// GET - display URL index

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET - display new URL submission

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// GET - display single URL

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

// POST - receive form submission // redirects to /urls/:id

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.redirect("/urls/:id");
});