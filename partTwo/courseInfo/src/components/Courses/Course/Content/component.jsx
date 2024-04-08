import Part from "./Part/component";

const Content = ({ parts }) => {
  const total = parts.reduce((acc, curr) => {
    return acc + curr.exercises;
  }, 0);

  return (
    <div>
      {parts.map((part) => {
        return <Part key={part.id} currentPart={part} />;
      })}
      <p>Total of {total} exercises</p>
    </div>
  );
};

export default Content;
