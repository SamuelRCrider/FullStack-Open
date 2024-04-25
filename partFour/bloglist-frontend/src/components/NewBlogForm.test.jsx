import userEvent from "@testing-library/user-event";
// eslint-disable-next-line no-unused-vars -- for screen
import { render, screen } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";

test("the form calls the event handler it received as props with the right details when a new blog is created", async () => {
  const create = vi.fn();
  const user = userEvent.setup();

  const component = render(<NewBlogForm create={create} />);

  const titleInput = component.container.querySelector("#titleTest");
  const authorInput = component.container.querySelector("#authorTest");
  const urlInput = component.container.querySelector("#urlTest");
  const createButton = component.container.querySelector("#createTest");

  await user.type(titleInput, "fake title");
  await user.type(authorInput, "fake author");
  await user.type(urlInput, "fake url");
  await user.click(createButton);
  expect(create.mock.calls).toHaveLength(1);
  expect(create.mock.calls[0][0]).toStrictEqual({
    title: "fake title",
    author: "fake author",
    url: "fake url",
  });
});
