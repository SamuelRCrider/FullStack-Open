import { useEffect, useState, useRef } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import loginService from "./services/login";
import ErrorMessage from "./components/ErrorMessage";
import "./index.css";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NewNoteForm from "./components/NewNoteForm";

const App = () => {
  const [currentNotes, setCurrentNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [user, setUser] = useState(null);

  const newNoteFormRef = useRef();

  // get notes from backend every render
  useEffect(() => {
    console.log("effect");
    noteService.getAll().then((allNotes) => {
      console.log("promise fulfilled", allNotes);
      setCurrentNotes(allNotes);
    });
  }, []);
  console.log("render", currentNotes.length, "notes");

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem("loggedInNoteAppUser");
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  // since note.important is true or false, comparison "=== true" isn't needed in filter test
  const visibleNotes = showAll
    ? currentNotes
    : currentNotes.filter((note) => note.important);

  const addNote = async (newNoteObject) => {
    // send new note obj to server and then set notes to the current notes plus the new note
    newNoteFormRef.current.toggleVisibility();
    const createdNote = await noteService.create(newNoteObject);

    setCurrentNotes(currentNotes.concat(createdNote));
  };

  const handleLogin = async (userObj) => {
    try {
      const user = await loginService.login(userObj);

      window.localStorage.setItem("loggedInNoteAppUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Invalid Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
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

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInNoteAppUser");
    setUser(null);
  };

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      {!user ? (
        <Togglable buttonLabel="Login">
          <LoginForm login={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <Togglable buttonLabel="Create a Note" ref={newNoteFormRef}>
            <NewNoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}
      <h1>Notes</h1>
      <button
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        show {showAll ? "important" : "all"}
      </button>

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
