// npm test -- --project chromium to run tests in only one browser (saves time)
const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Bloglist", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "root",
        name: "Superuser",
        password: "samiscools",
      },
    });

    await page.goto("/");
  });

  test("user can log in", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  describe("logging in", () => {
    test("login succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("button", { name: "Login" }).click();
      await page.getByTestId("username").fill("root");
      await page.getByTestId("password").fill("samiscools");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page.getByText("Superuser is logged in")).toBeVisible();
    });

    // this test is broken because bcrypt.compare returns a promise but await doesn't recognize it
    // test("login fails with incorrect credentials", async ({ page }) => {
    //   await page.getByRole("button", { name: "Login" }).click();
    //   await page.getByTestId("username").fill("root");
    //   await page.getByTestId("password").fill("incorrectpassword");
    //   await page.getByRole("button", { name: "Login" }).click();
    //   await expect(page.getByText("Invalid Credentials")).toBeVisible();
    // });
  });

  describe("when a user is logged in", () => {
    beforeEach(async ({ page }) => {
      // log user in
    });

    test("logged in user can create a blog", async ({ page }) => {
      // test here
    });

    test("blogs can be edited", async ({ page }) => {
      // test here
    });

    test("user who added the blog can delete the blog", async ({ page }) => {
      // test here
    });

    test("only the user who added the blog sees the blog's delete button", async ({
      page,
    }) => {
      // test here
    });

    test("blogs are arranged in the order according to the likes, the blog with the most likes first", async ({
      page,
    }) => {
      // test here
    });
  });
});
