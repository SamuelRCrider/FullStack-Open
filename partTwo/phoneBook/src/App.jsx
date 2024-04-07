import { useEffect, useState } from "react";
import Filter from "./components/Filter/component";
import AddPersonForm from "./components/AddPersonForm/component";
import PhoneBook from "./components/PhoneBook/component";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFilter, setPersonFilter] = useState("");

  useEffect(() => {
    personsService.getAll().then((allPersons) => {
      setPersons(allPersons);
    });
  }, []);

  // >= 0 ensures accurate search results
  const filteredPersons = persons.filter(
    (person) => person.name.toLowerCase().search(personFilter) >= 0
  );

  const checkPhoneBook = (object) => {
    // See if new name matches an existing name
    const foundPerson = persons.find((p) => p.name === object.name);

    if (foundPerson) {
      // If name does match a name, foundPerson will be populated with that person
      // Check if user wants to change number of existing person
      if (
        window.confirm(
          `${object.name} is already in phonebook, would you like to replace their number with the new one?`
        )
      ) {
        // If yes, spread the found person and then change their number
        const changedPersonsNumber = { ...foundPerson, number: object.number };
        // Update the backend, then update the frontend by setting persons to a map of persons with
        // the found person overwritten by the updated person, then reset inputs
        personsService
          .update(foundPerson.id, changedPersonsNumber)
          .then((updatedPersons) => {
            setPersons(
              persons.map((p) => (p.id !== foundPerson.id ? p : updatedPersons))
            );
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      // If found person is null, add the new object (new person) to the backend
      // then update the frontend with the addition of the newly created person
      personsService.create(object).then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleDelete = (personId) => {
    if (window.confirm("Are you sure you want to delete this person?"))
      personsService
        .deletePerson(personId)
        .then(setPersons(persons.filter((p) => p.id !== personId)));
  };

  const handleNewName = (event) => {
    event.preventDefault();
    const newNameObject = {
      name: newName,
      number: newNumber,
    };

    checkPhoneBook(newNameObject);
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
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
