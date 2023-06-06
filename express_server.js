const express = require("express");
const cookieParser = require("cookie-parser");

/////////////////// CONSTANTS ///////////////////

const app = express();
const PORT = 8080; // default port 8080

/////////////////// MIDDLEWARE ///////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true})); // creates/populates req.body
app.use(cookieParser()); // create/populate req.cookies

/////////////////// DATABASE ///////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////// LISTENER ///////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Function to generate random short URL

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

/////////////////// ROUTES ///////////////////

// GET - display URL index

app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies["userID"]],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// GET - display new URL submission

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["userID"]]
  };
  res.render("urls_new", templateVars);
});

// GET - display single URL

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: users[req.cookies["userID"]],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
  // console.log(urlDatabase);
});

// GET - handle shortURL requests to redirect to its longURL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// GET - register new users

app.get("/register", (req, res) => {
  const templateVars = {
    user: users
  };
  res.render("urls_registration", templateVars);
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
  const userID = req.body.userID;
  res.cookie("userID", userID);
  res.redirect("/urls");
});

// POST - register endpoint

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[userID] = {
    id: userID,
    email: email,
    password: password
  };
  res.cookie("userID", userID);
  console.log(users);
  res.redirect("/urls");
});

// POST - logout endpoint

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});