import { useState } from "react";

const NewNoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true,
    });

    setNewNote("");
  };
  return (
    <div className="formDiv">
      <form onSubmit={addNote}>
        <input
          placeholder={"a new note..."}
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">add note</button>
      </form>
    </div>
  );
};
export default NewNoteForm;
