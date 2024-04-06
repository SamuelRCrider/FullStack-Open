const Filter = ({ personFilter, onChange }) => {
  return (
    <div>
      Filter: <input value={personFilter} onChange={onChange} />
    </div>
  );
};

export default Filter;
