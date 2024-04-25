const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createNewNote = async (page, content) => {
  await page.getByRole("button", { name: "Create a Note" }).click();
  await page.getByRole("textbox").fill(content);
  await page.getByRole("button", { name: "add note" }).click();
  // test creates one note and it starts creating the next one even before the server has responded
  // so we need to wait for each note to render
  await page.getByText(content).waitFor();
};

export { loginWith, createNewNote };
