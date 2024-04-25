// eslint-disable-next-line no-unused-vars -- for screen
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  title: "title of fake blog",
  author: "author of fake blog",
  url: "url of fake blog",
  likes: 5,
  user: { name: "fakebloguser" },
};
const user = {
  username: "fakeusername",
};

test("blog component renders the blog's title but does not render its URL, author, or likes by default", () => {
  const component = render(<Blog blog={blog} user={user} />);

  const blogTitle = component.container.querySelector(".topOfBlogTest");
  expect(blogTitle).toBeDefined();
  expect(blogTitle).toHaveTextContent(`${blog.title}`);
  const invisibleContent = component.container.querySelector(
    ".showWhenVisibleTest"
  );
  expect(invisibleContent).not.toBeVisible();
});

test("blog's URL, author, and likes are shown when the button controlling the shown details has been clicked", async () => {
  const component = render(<Blog blog={blog} user={user} />);

  const theUser = userEvent.setup();
  const buttonView = component.getByText("view");
  await theUser.click(buttonView);

  const blogTitle = component.container.querySelector(".topOfBlogTest");
  expect(blogTitle).toBeDefined();
  expect(blogTitle).toHaveTextContent(`${blog.title}`);
  const invisibleContent = component.container.querySelector(
    ".showWhenVisibleTest"
  );
  expect(invisibleContent).toBeVisible();
  expect(invisibleContent).toHaveTextContent(
    `${blog.author}`,
    `${blog.url}`,
    `${blog.likes}`
  );
});
test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {
  const mockHandler = vi.fn();
  const component = render(<Blog blog={blog} user={user} like={mockHandler} />);

  const theUser = userEvent.setup();
  const buttonView = component.getByText("view");
  await theUser.click(buttonView);

  const buttonLike = component.getByText("like");
  await theUser.click(buttonLike);
  await theUser.click(buttonLike);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
