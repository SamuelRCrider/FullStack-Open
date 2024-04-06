import { useEffect, useState } from "react";
import Note from "./components/Note";
import axios from "axios";

const App = () => {
  const [currentNotes, setCurrentNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/notes").then((res) => {
      console.log("promise fulfilled", res);
      setCurrentNotes(res.data);
    });
  }, []);
  console.log("render", currentNotes.length, "notes");

  // since note.important is true or false, comparison "=== true" isn't needed in filter test
  const visibleNotes = showAll
    ? currentNotes
    : currentNotes.filter((note) => note.important);

  const addNote = (event) => {
    event.preventDefault();
    console.log("Button Clicked", event.target);
    const newNoteObject = {
      id: currentNotes.length + 1,
      content: newNote,
      important: Math.random() < 0.5,
    };

    setCurrentNotes(currentNotes.concat(newNoteObject));
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  return (
    <div>
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
          <Note key={note.id} note={note} />
        ))}
      </ul>
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
