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

module.exports = { generateRandomString, getUserByEmail, urlsForUser };