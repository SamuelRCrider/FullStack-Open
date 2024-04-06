import { useEffect, useState } from "react";
import Filter from "./components/Filter/component";
import AddPersonForm from "./components/AddPersonForm/component";
import PhoneBook from "./components/PhoneBook/component";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((res) => {
      setPersons(res.data);
    }, []);
  });

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
