const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("most likes", () => {
  test("of empty list", () => {
    const blogs = [];
    const result = listHelper.mostLikes(blogs);

    assert.equal(result, 0);
  });

  test("of most likes is calculates right", () => {});
});
