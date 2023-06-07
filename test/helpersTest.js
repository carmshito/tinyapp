const { assert } = require('chai');

const { generateRandomString, getUserByEmail, urlsForUser } = require('../helpers.js');

const testURLs = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
};

const testUsers = {
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

describe('generateRandomString', function() {
  it('should return a random 6 character string', function() {
    const actual = generateRandomString().length;
    const expected = 6;
    assert.equal(actual, expected);
  });
  it('should return a different 6 character string when called more than once', function() {
    const call1 = generateRandomString();
    const call2 = generateRandomString();
    assert.notEqual(call1, call2);
  });
});

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("1@1.ca", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  it('should return undefined with invalid email', function() {
    const user = getUserByEmail("user4@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});

describe('urlsForUser', function() {
  it('should return the longURLs of the shortURLs created by a user with valid email', function() {
    const urls = urlsForUser("userRandomID", testURLs);
    const expectedURLS = {
      "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "userRandomID",
      },
    };
    assert.deepEqual(urls, expectedURLS);
  });
  it('should return an empty object with invalid user ID', function() {
    const user = urlsForUser("userRandomID1234", testURLs);
    const expectedURLS = {};
    assert.deepEqual(user, expectedURLS);
  });
});