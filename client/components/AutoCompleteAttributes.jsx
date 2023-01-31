import React from "react";

import CreatableSelect from "react-select/creatable";

export default ({ sources, setSelected }) => (
  <CreatableSelect
    isClearable
    onChange={(s) => setSelected(s)}
    classNames={{
      control: (state) =>
        state.isFocused ? "outline-purple-600" : "outline-purple-300",
    }}
    isMulti
    options={sources ? sources : []}
  />
);
