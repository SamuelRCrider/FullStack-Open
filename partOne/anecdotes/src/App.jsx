import { useState } from "react";
import "./App.css";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const anecdoteListLength = anecdotes.length;

  const [selected, setSelected] = useState(
    Math.floor(Math.random() * anecdoteListLength)
  );
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [mostVotes, setMostVotes] = useState(0);

  const randomAnecdote = () => {
    const randomWholeNum = Math.floor(Math.random() * anecdoteListLength);
    setSelected(randomWholeNum);
  };

  const handleVote = () => {
    const copyOfVotes = [...votes];
    copyOfVotes[selected]++;
    if (copyOfVotes[selected] > votes[mostVotes]) {
      setMostVotes(copyOfVotes.indexOf(copyOfVotes[selected]));
    }
    setVotes(copyOfVotes);
  };

  return (
    <div className="div">
      <h1>Todays Anecdote</h1>
      <div>{anecdotes[selected]}</div>
      <h3>has {votes[selected]} votes</h3>

      <button onClick={handleVote}>vote</button>
      <button onClick={randomAnecdote}>next anecdote</button>
      <h1>Anecdote With Most Votes</h1>
      {!mostVotes ? (
        <div></div>
      ) : (
        <div>
          <div>{anecdotes[mostVotes]}</div>
          <h3>has {votes[mostVotes]} votes</h3>
        </div>
      )}
    </div>
  );
};
export default App;
