const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

/////////////////// CONSTANTS ///////////////////

const app = express();
const PORT = 8080; // default port 8080

/////////////////// MIDDLEWARE ///////////////////

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true})); // creates/populates req.body
app.use(cookieParser()); // create/populate req.cookies
app.use(morgan('dev'));

/////////////////// DATABASE ///////////////////

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "1@1.ca",
    password: "12",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "2@2.ca",
    password: "34",
  },
};

/////////////////// LISTENER ///////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Helper function to generate random short URL
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Helper function to look up emails
const getUserByEmail = (email, usersDB) => {
  for (const key in usersDB) {
    if (email === usersDB[key].email) {
      return usersDB[key];
    }
  }
  return undefined;
};

// Helper function to confirm if passwords match
const passwordMatcher = (password, usersDB) => {
  for (const key in usersDB) {
    if (password === usersDB[key].password) {
      return true;
    }
  }
  return undefined;
};

// Helper function to find user
const findUserID = (email, usersDB) => {
  for (const key in usersDB) {
    if (email === usersDB[key].email) {
      return usersDB[key].id;
    }
  }
  return undefined;
};

// Helper function to return URLs that belong to the correct userID

const urlsForUser = (id, urlDatabase) => {
  let userURLs = {};
  for (const shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

/////////////////// ROUTES ///////////////////

// GET - display URL index
app.get("/urls", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    res.status(401).send("Please log in or register to access URLs");
    return;
  }
  const urls = urlsForUser(userID, urlDatabase);
  const templateVars = {
    user: users[req.cookies["userID"]],
    urls
  };
  res.render("urls_index", templateVars);
});

// GET - display new URL submission for logged in
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  const templateVars = {
    user: users[req.cookies["userID"]]
  };
  res.render("urls_new", templateVars);
});

// GET - display single URL
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    res.status(401).send("Please log in or register to access URLs");
    return;
  }
  
  const existingURL = urlDatabase[req.params.id];
  if (!existingURL) {
    res.status(401).send("This short URL does not exist!");
    return;
  }

  if (existingURL.userID !== userID) {
    res.status(401).send("This URL does not belong to you");
    return;
  }

  const templateVars = {
    user: users[req.cookies["userID"]],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
  };
  res.render("urls_show", templateVars);
  console.log(urlDatabase);
});

// GET - handle shortURL requests to redirect to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    res.send("This short URL does not exist!");
    return;
  }
  res.redirect(longURL);
});

// GET - register new users
app.get("/register", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    const templateVars = {
      user: users[req.cookies["userID"]]
    };
    res.render("urls_registration", templateVars);
    return;
  }
  res.redirect("/urls");
});

// GET - login
app.get("/login", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    const templateVars = {
      user: users[req.cookies["userID"]]
    };
    res.render("urls_login", templateVars);
    return;
  }
  res.redirect("/urls");
});

// POST - receive form submission // redirects to /urls/:id
app.post("/urls", (req, res) => {
  const userID = req.cookies["userID"];
  if (!userID) {
    res.status(401).send("You must be logged in to use TinyApp!");
    return;
  }
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID,
  };
  res.redirect(`/urls/${shortURL}`);
});

// POST - deletes a URL
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.cookies["userID"];
  const id = req.params.id;

  // [x] should return a relevant error message if the user is not logged in
  if (!userID) {
    res.status(401).send("Please log in or register to access URLs");
    return;
  }

  // [x] should return a relevant error message if id does not exist
  if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist");
    return;
  }

  // [x] should return a relevant error message if the user does not own the URL
  if (userID !== urlDatabase[id].userID) {
    res.status(401).send("You are not permitted to delete this URL");
    return;
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});

// POST - updates a URL resource
app.post("/urls/:id", (req, res) => {
  const userID = req.cookies["userID"];
  const id = req.params.id;
  const updatedURL = req.body.updatedURL;

  // [x] should return a relevant error message if the user is not logged in
  if (!userID) {
    res.status(401).send("Please log in or register to access URLs");
    return;
  }

  // [x] should return a relevant error message if id does not exist
  if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist");
    return;
  }

  // [x] should return a relevant error message if the user does not own the URL
  if (userID !== urlDatabase[id].userID) {
    res.status(401).send("You are not permitted to edit this URL");
    return;
  }

  urlDatabase[id] = updatedURL;
  res.redirect("/urls");
});

// POST - login endpoint
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // [x] if the email and password are empty strings, send a 400 status code
  if (!email || !password) {
    return res.status(400).send("You must provide an email and password");
  }

  // [x] if a user with that email cannot be found, return a 403 status code
  if (!getUserByEmail(email, users)) {
    return res.status(403).send("This email is not registered");
  }

  // [x] if a user with that email is located, compare the password given in the form with the existing user's pswd, if it doesn't match, return 403 status code
  if (!passwordMatcher(password, users)) {
    return res.status(403).send("The email or password does not match");
  }

  // [x] if both checks pass, set userID cookie with the matching user's random ID and redirect to /urls
  const userID = findUserID(email, users);
  
  res.cookie("userID", userID);
  res.redirect("/urls");
});

// POST - register endpoint
app.post("/register", (req, res) => {

  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // [x] if the email and password are empty strings, send a 400 status code
  if (!email || !password) {
    return res.status(400).send("You must provide an email and password");
  }

  // [x] if someone registers with an email in the users object, send a 400 status code

  if (getUserByEmail(email, users)) {
    return res.status(400).send("There is an account already registered with this email");
  }
  
  users[userID] = {
    id: userID,
    email: email,
    password: password
  };
  res.cookie("userID", userID);
  console.log(users); // print user object
  res.redirect("/urls");
});

// POST - logout endpoint

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/login");
});