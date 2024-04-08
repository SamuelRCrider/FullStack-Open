const Part = ({ currentPart }) => {
  return (
    <p>
      {currentPart.name}: {currentPart.exercises}
    </p>
  );
};

export default Part;
