const PhoneBook = ({
  personFilter,
  filteredPersons,
  persons,
  handleDelete,
}) => {
  return (
    <div>
      <h2>Numbers</h2>
      {personFilter
        ? filteredPersons.map((person) => {
            return (
              <p key={person.id}>
                {person.name}: {person.number}
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              </p>
            );
          })
        : persons.map((person) => {
            return (
              <p key={person.id}>
                {person.name}: {person.number}
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              </p>
            );
          })}
    </div>
  );
};

export default PhoneBook;
