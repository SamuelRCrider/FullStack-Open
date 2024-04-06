const PhoneBook = ({ personFilter, filteredPersons, persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {personFilter
        ? filteredPersons.map((person) => {
            return (
              <p key={person.name}>
                {person.name}: {person.number}
              </p>
            );
          })
        : persons.map((person) => {
            return (
              <p key={person.name}>
                {person.name}: {person.number}
              </p>
            );
          })}
    </div>
  );
};

export default PhoneBook;
