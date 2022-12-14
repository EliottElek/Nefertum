import Select from "react-tailwindcss-select";

const SelectComponent = ({ sources, selected, setSelected }) => {
  const handleChange = (value) => {
    setSelected(value);
  };

  return (
    <div className="pt-4">
      <Select
        primaryColor="purple"
        value={selected}
        isClearable
        isSearchable
        onChange={handleChange}
        options={sources ? sources : []}
        loading={!sources}
        placeholder="Source..."
      />
    </div>
  );
};

export default SelectComponent;
