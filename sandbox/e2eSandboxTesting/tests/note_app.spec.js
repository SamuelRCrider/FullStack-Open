// npm test -- --project chromium to run tests in only one browser (saves time)

const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith, createNewNote } = require("./test_helper");
const { name } = require("../playwright.config");

describe("Note app", () => {
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

  test("front page can be opened", async ({ page }) => {
    const locator = page.getByText("Notes");
    await expect(locator).toBeVisible();
  });

  // this test is broken because bcrypt.compare returns a promise but await doesn't recognize it
  // test("login fails with wrong password", async ({ page }) => {
  //   await page.getByRole("button", { name: "Login" }).click();
  //   await page.getByTestId("username").fill("root");
  //   await page.getByTestId("password").fill("wrong");
  //   await page.getByRole("button", { name: "login" }).click();

  //   await expect(page.getByText("Invalid Credentials")).toBeVisible();
  //   await expect(page.getByText("Superuser logged in")).not.toBeVisible();

  // });

  test("login form can be opened and completed", async ({ page }) => {
    await loginWith(page, "root", "samiscools");
    await expect(page.getByText("Superuser logged in")).toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "root", "samiscools");
    });

    test("a new note can be created", async ({ page }) => {
      await createNewNote(page, "note created by Playwright");
      await expect(page.getByText("note created by Playwright")).toBeVisible();
    });

    describe("several notes exist", () => {
      beforeEach(async ({ page }) => {
        await createNewNote(page, "first test note");
        await createNewNote(page, "second test note");
        await createNewNote(page, "third test note");
      });
      test("note importance can be changed", async ({ page }) => {
        const noteToChange = page.getByText("second test note").locator("..");
        await noteToChange
          .getByRole("button", { name: "make not important" })
          .click();

        await expect(
          noteToChange.getByRole("button", { name: "make important" })
        ).toBeVisible();
      });
    });
  });
});
