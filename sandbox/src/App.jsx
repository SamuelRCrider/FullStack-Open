import { useState } from "react";

const App = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"));
    // State is updated async! So in order for total to hold the correct value we must store it in a variable.
    const newLeft = left + 1;
    setLeft(newLeft);
    setTotal(newLeft + right);
  };

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    // State is updated async! So in order for total to hold the correct value we must store it in a variable.
    const newRight = right + 1;
    setRight(newRight);
    setTotal(left + newRight);
  };

  return (
    <div>
      <Display direction={left} />
      <Button onClick={handleLeftClick} text="left" />
      <Button onClick={handleRightClick} text="right" />
      <Display direction={right} />
      <History allClicks={allClicks} />
      <p>Total: {total}</p>
    </div>
  );
};

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return (
      <div>
        <p>App usage: click some buttons!</p>
      </div>
    );
  }
  return (
    <div>
      <p>{allClicks.join(" ")}</p>
    </div>
  );
};

const Display = ({ direction }) => {
  return <div>{direction}</div>;
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
export default App;
