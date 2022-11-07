import React from "react";

const Button = (props) => {
  return (
    <button
      {...props}
      className={["px-4 py-2 border border-blue-400 rounded-lg hover:bg-blue-100"]}
    />
  );
};

export default Button;
