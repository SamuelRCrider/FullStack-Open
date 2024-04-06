const AddPersonForm = ({
  onSubmit,
  onNameChange,
  onNumberChange,
  nameValue,
  numberValue,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <h3>Add Person to Phonebook</h3>
      <div>
        name: <input value={nameValue} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default AddPersonForm;
