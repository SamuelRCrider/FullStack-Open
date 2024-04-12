import { useEffect, useState } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import ErrorMessage from "./components/ErrorMessage";
import "./index.css";
import Footer from "./components/Footer";

const App = () => {
  const [currentNotes, setCurrentNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  // get notes from backend every render
  useEffect(() => {
    console.log("effect");
    noteService.getAll().then((allNotes) => {
      console.log("promise fulfilled", allNotes);
      setCurrentNotes(allNotes);
    });
  }, []);
  console.log("render", currentNotes.length, "notes");

  // since note.important is true or false, comparison "=== true" isn't needed in filter test
  const visibleNotes = showAll
    ? currentNotes
    : currentNotes.filter((note) => note.important);

  // create new note obj and post it to backend
  const addNote = (event) => {
    // we don't want to actually submit the html form
    event.preventDefault();
    console.log("Button Clicked", event.target);
    // create note obj, id will be determined by server
    const newNoteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    // send new note obj to server and then set notes to the current notes plus the new note
    noteService.create(newNoteObject).then((createdNote) => {
      console.log(createdNote);
      setCurrentNotes(currentNotes.concat(createdNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  // change the importance of a note, updating it in the backend
  const onToggleImportance = (noteId) => {
    // get the correct note by checking ids
    const note = currentNotes.find((n) => n.id === noteId);
    // spread the new note into the variable and then change the importance to the opposite
    const changedNote = { ...note, important: !note.important };

    // put the changed note into the backend in the correct spot (by sending it to its exact url)
    // then set notes to current notes, which is updated by the map that puts the changed note into the correct id spot
    noteService
      .update(noteId, changedNote)
      .then((updatedNotes) => {
        setCurrentNotes(
          currentNotes.map((n) => (n.id !== noteId ? n : updatedNotes))
        );
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          `The importance of note ${note.content} couldn't be changed`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        // setCurrentNotes(currentNotes.filter((n) => n.id !== noteId));
      });
  };

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      <h1>Notes</h1>
      <button
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        show {showAll ? "important" : "all"}
      </button>
      <form onSubmit={addNote}>
        <input
          placeholder={"a new note..."}
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">add note</button>
      </form>
      <ul>
        {visibleNotes.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => onToggleImportance(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;

// import { useState } from "react";

// const App = () => {
//   const [left, setLeft] = useState(0);
//   const [right, setRight] = useState(0);
//   const [allClicks, setAll] = useState([]);
//   const [total, setTotal] = useState(0);

//   const handleLeftClick = () => {
//     setAll(allClicks.concat("L"));
//     // State is updated async! So in order for total to hold the correct value we must store it in a variable.
//     const newLeft = left + 1;
//     setLeft(newLeft);
//     setTotal(newLeft + right);
//   };

//   const handleRightClick = () => {
//     setAll(allClicks.concat("R"));
//     // State is updated async! So in order for total to hold the correct value we must store it in a variable.
//     const newRight = right + 1;
//     setRight(newRight);
//     setTotal(left + newRight);
//   };

//   return (
//     <div>
//       <Display direction={left} />
//       <Button onClick={handleLeftClick} text="left" />
//       <Button onClick={handleRightClick} text="right" />
//       <Display direction={right} />
//       <History allClicks={allClicks} />
//       <p>Total: {total}</p>
//     </div>
//   );
// };

// const History = ({ allClicks }) => {
//   if (allClicks.length === 0) {
//     return (
//       <div>
//         <p>App usage: click some buttons!</p>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <p>{allClicks.join(" ")}</p>
//     </div>
//   );
// };

// const Display = ({ direction }) => {
//   return <div>{direction}</div>;
// };

// const Button = ({ onClick, text }) => {
//   return <button onClick={onClick}>{text}</button>;
// };
// export default App;
