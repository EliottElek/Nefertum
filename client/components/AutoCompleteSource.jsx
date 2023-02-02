import React from "react";

import CreatableSelect from "react-select/creatable";

export default ({ sources, setSelected }) => (
  <CreatableSelect
    isClearable
    theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary25: "rgba(207, 70, 202, 0.2)",
        primary: "rgba(207, 70, 202, O.9)",
      },
    })}
    onChange={(s) => setSelected(s)}
    classNames={{
      control: (state) =>
        state.isFocused ? "outline-purple-600" : "outline-purple-300",
    }}
    options={sources ? sources : []}
  />
);
