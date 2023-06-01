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
  // console.log(urlDatabase);
});

// GET - handle shortURL requests to redirect to its longURL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// POST - receive form submission // redirects to /urls/:id

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// POST - deletes a URL

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// POST - updates a URL resource

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const updatedURL = req.body.updatedURL;
  urlDatabase[id] = updatedURL;
  res.redirect("/urls");
});

// POST - login endpoint

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");
});