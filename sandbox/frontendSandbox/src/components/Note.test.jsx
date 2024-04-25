import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Note from "./Note";

test("clicking the button calls event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockHandler = vi.fn();
  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);
  expect(mockHandler.mock.calls).toHaveLength(1);
});

test("renders content", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  render(<Note note={note} />);
  screen.debug();

  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  );

  // Use this method if you are looking for text that is within other text
  //   const element = screen.getByText(
  //     'Does not work anymore :(', { exact: false }
  //   )

  expect(element).toBeDefined();

  //   const { container } = render(<Note note={note} />)

  //   const div = container.querySelector('.note')
  //   expect(div).toHaveTextContent(
  //     'Component testing is done with react-testing-library'
  //   )
});
