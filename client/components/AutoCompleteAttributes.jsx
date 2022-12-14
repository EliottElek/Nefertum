import Select from "react-tailwindcss-select";

const SelectComponent = ({ sources, selected, setSelected }) => {
  const handleChange = (value) => {
    setSelected(value);
  };

  return (
    <div>
      <Select
        primaryColor="purple"
        
        value={selected}
        isMultiple
        isSearchable
        onChange={handleChange}
        options={sources ? sources : []}
        loading={!sources}
        placeholder="Tags..."
      />
    </div>
  );
};

export default SelectComponent;
