import { render, screen } from "@testing-library/react";
import NewNoteForm from "./NewNoteForm";
import userEvent from "@testing-library/user-event";

test("<NewNoteForm /> updates parent state and calls onSubmit", async () => {
  const createNote = vi.fn();
  const user = userEvent.setup();

  render(<NewNoteForm createNote={createNote} />);

  const input = screen.getByPlaceholderText("a new note...");
  const sendButton = screen.getByText("add note");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});
