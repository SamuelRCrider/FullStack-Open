import { useState } from "react";
import Filter from "./components/Filter/component";
import AddPersonForm from "./components/AddPersonForm/component";
import PhoneBook from "./components/PhoneBook/component";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState("");

  // >= 0 ensures accurate search results
  const filteredPersons = persons.filter(
    (person) => person.name.toLowerCase().search(personFilter) >= 0
  );

  const checkPhoneBook = (object) => {
    persons.forEach((person) => {
      if (object.name === person.name) {
        alert(`${object.name} is already in phonebook`);
        throw new Error("This name is already in phonebook");
      }
    });
  };

  const handleNewName = (event) => {
    event.preventDefault();
    const newNameObject = {
      name: newName,
      number: newNumber,
    };

    checkPhoneBook(newNameObject);

    setPersons(persons.concat(newNameObject));
    setNewName("");
    setNewNumber("");
  };

  const onNameChange = (event) => {
    setNewName(event.target.value);
  };

  const onNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const onFilter = (event) => {
    setPersonFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={personFilter} onChange={onFilter} />
      <AddPersonForm
        onSubmit={handleNewName}
        onNameChange={onNameChange}
        onNumberChange={onNumberChange}
        nameValue={newName}
        numberValue={newNumber}
      />
      <PhoneBook
        personFilter={personFilter}
        filteredPersons={filteredPersons}
        persons={persons}
      />
    </div>
  );
};

export default App;
