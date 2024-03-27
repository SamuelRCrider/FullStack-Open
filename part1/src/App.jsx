const Hello = (props) => {
  return (
    <div>
      <p>hello, {props.name}</p>
    </div>
  );
};

function App() {
  const now = new Date();
  const a = 10;
  const b = 20;
  console.log(now, a + b);
  return (
    <div>
      <p>hello, it is {now.toString()}</p>
      <p>
        {a} + {b} = {a + b}
      </p>
      <Hello name="sam" />
    </div>
  );
}

export default App;
